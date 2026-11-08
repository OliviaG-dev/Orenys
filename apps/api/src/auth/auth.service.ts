import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { hash, verify, Algorithm } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";
import {
  apiError,
  errorCodes,
  memberRole,
  type LoginInput,
  type PublicUser,
  type RegisterInput,
} from "@orenys/domain";
import { PrismaService } from "../prisma/prisma.service";
import { argonOptions } from "./auth.constants";
import { TokenService } from "./token.service";

type IssuedSession = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private dummyHash = "";

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.dummyHash = await hash("orenys-dummy-password", {
      ...argonOptions,
      algorithm: Algorithm.Argon2id,
    });
  }

  async register(input: RegisterInput): Promise<IssuedSession> {
    const passwordHash = await this.hashPassword(input.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: memberRole,
        },
      });
      return this.openSession(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException(
          apiError(errorCodes.emailTaken, "Un compte existe déjà avec cette adresse."),
        );
      }
      throw error;
    }
  }

  async login(input: LoginInput): Promise<IssuedSession> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    const passwordHash = user?.passwordHash ?? this.dummyHash;
    const matches = await verify(passwordHash, input.password);
    if (!user || !matches || user.role !== memberRole) {
      throw new UnauthorizedException(
        apiError(errorCodes.invalidCredentials, "L'adresse ou le mot de passe ne correspond pas."),
      );
    }
    return this.openSession(user);
  }

  async refresh(refreshToken: string | undefined): Promise<IssuedSession> {
    if (!refreshToken) {
      throw this.sessionExpired();
    }
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash: this.tokens.hashRefresh(refreshToken) },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw this.sessionExpired();
    }
    if (session.user.role !== memberRole) {
      throw this.sessionExpired();
    }

    const nextRefresh = this.tokens.issueRefresh();
    const created = await this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      return tx.session.create({
        data: {
          userId: session.userId,
          refreshTokenHash: nextRefresh.hash,
          expiresAt: this.tokens.refreshExpiry(),
        },
      });
    });

    return {
      user: this.toPublicUser(session.user),
      accessToken: this.tokens.signAccess({
        sub: session.user.id,
        email: session.user.email,
        role: memberRole,
        sid: created.id,
      }),
      refreshToken: nextRefresh.token,
    };
  }

  async logout(refreshToken?: string, accessToken?: string): Promise<void> {
    if (refreshToken) {
      await this.prisma.session.updateMany({
        where: { refreshTokenHash: this.tokens.hashRefresh(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return;
    }
    const payload = this.tokens.tryReadAccess(accessToken);
    if (!payload) {
      return;
    }
    await this.prisma.session.updateMany({
      where: { id: payload.sid, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async openSession(user: { id: string; email: string; role: string }): Promise<IssuedSession> {
    if (user.role !== memberRole) {
      throw new UnauthorizedException(
        apiError(errorCodes.invalidCredentials, "L'adresse ou le mot de passe ne correspond pas."),
      );
    }
    const refresh = this.tokens.issueRefresh();
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: refresh.hash,
        expiresAt: this.tokens.refreshExpiry(),
      },
    });
    return {
      user: { id: user.id, email: user.email, role: memberRole },
      accessToken: this.tokens.signAccess({
        sub: user.id,
        email: user.email,
        role: memberRole,
        sid: session.id,
      }),
      refreshToken: refresh.token,
    };
  }

  private toPublicUser(user: { id: string; email: string }): PublicUser {
    return { id: user.id, email: user.email, role: memberRole };
  }

  private hashPassword(password: string): Promise<string> {
    return hash(password, { ...argonOptions, algorithm: Algorithm.Argon2id });
  }

  private sessionExpired(): UnauthorizedException {
    return new UnauthorizedException(
      apiError(errorCodes.sessionExpired, "Ta session a expiré. Reconnecte-toi."),
    );
  }
}

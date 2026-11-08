import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { apiError, errorCodes, memberRole } from "@orenys/domain";
import { PrismaService } from "../prisma/prisma.service";
import { ACCESS_COOKIE } from "./auth.constants";
import { type AuthenticatedRequest } from "./current-user.decorator";
import { TokenService } from "./token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokens: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const payload = this.tokens.tryReadAccess(request.cookies?.[ACCESS_COOKIE]);
    if (!payload) {
      throw this.denied();
    }

    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
      include: { user: true },
    });
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now() ||
      session.userId !== payload.sub ||
      session.user.role !== memberRole
    ) {
      throw this.denied();
    }

    request.user = {
      id: session.user.id,
      email: session.user.email,
      role: memberRole,
    };
    return true;
  }

  private denied(): UnauthorizedException {
    return new UnauthorizedException(
      apiError(errorCodes.unauthenticated, "Ta session a expiré. Reconnecte-toi."),
    );
  }
}

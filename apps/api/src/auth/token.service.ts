import { createHash, randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { accessPayloadSchema, type AccessPayload } from "@orenys/domain";
import jwt from "jsonwebtoken";
import { ENV, type Env } from "../config/env";

@Injectable()
export class TokenService {
  constructor(@Inject(ENV) private readonly env: Env) {}

  signAccess(payload: AccessPayload): string {
    return jwt.sign(payload, this.env.accessTokenSecret, {
      expiresIn: this.env.accessTokenTtlSeconds,
    });
  }

  tryReadAccess(token: string | undefined): AccessPayload | null {
    if (!token) {
      return null;
    }
    try {
      const decoded = jwt.verify(token, this.env.accessTokenSecret);
      const parsed = accessPayloadSchema.safeParse(decoded);
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  issueRefresh(): { token: string; hash: string } {
    const token = randomBytes(32).toString("base64url");
    return { token, hash: this.hashRefresh(token) };
  }

  hashRefresh(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  refreshExpiry(): Date {
    return new Date(Date.now() + this.env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
  }
}

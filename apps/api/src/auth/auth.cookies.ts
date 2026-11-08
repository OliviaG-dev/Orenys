import { Inject, Injectable } from "@nestjs/common";
import type { Response } from "express";
import { ENV, type Env } from "../config/env";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./auth.constants";

@Injectable()
export class AuthCookies {
  constructor(@Inject(ENV) private readonly env: Env) {}

  attach(response: Response, accessToken: string, refreshToken: string): void {
    const base = {
      httpOnly: true,
      secure: this.env.cookieSecure,
      sameSite: "lax" as const,
    };
    response.cookie(ACCESS_COOKIE, accessToken, {
      ...base,
      path: "/",
      maxAge: this.env.accessTokenTtlSeconds * 1000,
    });
    response.cookie(REFRESH_COOKIE, refreshToken, {
      ...base,
      path: "/api/auth",
      maxAge: this.env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    });
  }

  clear(response: Response): void {
    const base = {
      httpOnly: true,
      secure: this.env.cookieSecure,
      sameSite: "lax" as const,
    };
    response.clearCookie(ACCESS_COOKIE, { ...base, path: "/" });
    response.clearCookie(REFRESH_COOKIE, { ...base, path: "/api/auth" });
  }
}

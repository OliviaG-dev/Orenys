import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { loginSchema, registerSchema, type LoginInput, type PublicUser, type RegisterInput } from "@orenys/domain";
import type { Request, Response } from "express";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./auth.constants";
import { AuthCookies } from "./auth.cookies";
import { AuthService } from "./auth.service";

const credentialsSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 10 },
  },
};

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookies,
  ) {}

  @Post("register")
  @HttpCode(201)
  @ApiBody({ schema: credentialsSchema })
  @ApiOkResponse({ description: "Compte créé et session ouverte." })
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUser> {
    const issued = await this.auth.register(body);
    this.cookies.attach(response, issued.accessToken, issued.refreshToken);
    return issued.user;
  }

  @Post("login")
  @HttpCode(200)
  @ApiBody({ schema: credentialsSchema })
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUser> {
    const issued = await this.auth.login(body);
    this.cookies.attach(response, issued.accessToken, issued.refreshToken);
    return issued.user;
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUser> {
    const issued = await this.auth.refresh(request.cookies?.[REFRESH_COOKIE]);
    this.cookies.attach(response, issued.accessToken, issued.refreshToken);
    return issued.user;
  }

  @Post("logout")
  @HttpCode(204)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.auth.logout(request.cookies?.[REFRESH_COOKIE], request.cookies?.[ACCESS_COOKIE]);
    this.cookies.clear(response);
  }
}

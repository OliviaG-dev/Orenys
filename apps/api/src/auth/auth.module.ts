import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthCookies } from "./auth.cookies";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthCookies, AuthGuard, TokenService],
  exports: [AuthGuard, TokenService],
})
export class AuthModule {}

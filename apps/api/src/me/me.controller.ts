import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { PublicUser } from "@orenys/domain";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { ACCESS_COOKIE } from "../auth/auth.constants";

@ApiTags("me")
@ApiCookieAuth(ACCESS_COOKIE)
@UseGuards(AuthGuard)
@Controller("me")
export class MeController {
  @Get()
  @ApiOkResponse({ description: "Profil de la session en cours." })
  me(@CurrentUser() user: PublicUser): PublicUser {
    return user;
  }
}

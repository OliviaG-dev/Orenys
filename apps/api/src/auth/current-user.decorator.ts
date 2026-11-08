import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { PublicUser } from "@orenys/domain";
import type { Request } from "express";

export type AuthenticatedRequest = Request & {
  user?: PublicUser;
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): PublicUser => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  if (!request.user) {
    throw new Error("Utilisateur absent après le garde d'authentification.");
  }
  return request.user;
});

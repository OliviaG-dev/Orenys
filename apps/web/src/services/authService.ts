import type { LoginInput, PublicUser, RegisterInput } from "@orenys/domain";
import { errorCodes } from "@orenys/domain";
import { ApiRequestError, apiRequest } from "./apiClient";

export async function registerAccount(input: RegisterInput): Promise<PublicUser> {
  return apiRequest<PublicUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginAccount(input: LoginInput): Promise<PublicUser> {
  return apiRequest<PublicUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logoutAccount(): Promise<void> {
  await apiRequest<void>("/api/auth/logout", { method: "POST" });
}

export async function fetchMe(): Promise<PublicUser | null> {
  try {
    return await apiRequest<PublicUser>("/api/me");
  } catch (error) {
    if (error instanceof ApiRequestError && error.code === errorCodes.unauthenticated) {
      return null;
    }
    throw error;
  }
}

import { errorCodes, type ApiError, type ApiErrorBody } from "@orenys/domain";

export class ApiRequestError extends Error {
  readonly code: string;
  readonly details: ApiError["details"];

  constructor(error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.details = error.details;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return false;
  }
  const error = (value as { error: unknown }).error;
  return Boolean(error && typeof error === "object" && "code" in error && "message" in error);
}

export async function apiRequest<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (
    response.status === 401 &&
    !retried &&
    isApiErrorBody(payload) &&
    payload.error.code === errorCodes.unauthenticated
  ) {
    const refresh = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
    if (refresh.ok) {
      return apiRequest<T>(path, init, true);
    }
  }

  if (!response.ok) {
    if (isApiErrorBody(payload)) {
      throw new ApiRequestError(payload.error);
    }
    throw new ApiRequestError({
      code: errorCodes.internal,
      message: "Le service ne répond pas. Réessaie dans un instant.",
      details: [],
    });
  }

  return payload as T;
}

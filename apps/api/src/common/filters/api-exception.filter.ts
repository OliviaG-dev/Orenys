import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Response } from "express";
import { apiError, errorCodes, type ApiError } from "@orenys/domain";

function isApiError(value: unknown): value is ApiError {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<ApiError>;
  return typeof candidate.code === "string" && typeof candidate.message === "string" && Array.isArray(candidate.details);
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const raw = exception.getResponse();
      if (isApiError(raw)) {
        response.status(exception.getStatus()).json({ error: raw });
        return;
      }
      response.status(exception.getStatus()).json({
        error: apiError(errorCodes.internal, "La requête n'a pas abouti."),
      });
      return;
    }

    this.logger.error(exception instanceof Error ? exception.message : "Erreur interne");
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: apiError(errorCodes.internal, "Le service a rencontré un incident."),
    });
  }
}

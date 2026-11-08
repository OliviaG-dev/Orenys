import { BadRequestException, Injectable, type PipeTransform } from "@nestjs/common";
import { apiError, errorCodes, zodFieldErrors } from "@orenys/domain";
import type { ZodType } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(
        apiError(
          errorCodes.validation,
          "Les informations envoyées sont incomplètes ou invalides.",
          zodFieldErrors(result.error),
        ),
      );
    }
    return result.data;
  }
}

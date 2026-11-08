import { z } from "zod";

export const memberRole = "member" as const;
export const roles = [memberRole] as const;
export type Role = (typeof roles)[number];

const emailMessage = "Cette adresse e-mail est invalide.";

export const emailSchema = z
  .string({ required_error: "Indique ton adresse e-mail." })
  .trim()
  .min(1, "Indique ton adresse e-mail.")
  .max(254, "Cette adresse e-mail est trop longue.")
  .email(emailMessage)
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string({ required_error: "Choisis un mot de passe." })
  .min(10, "Le mot de passe contient au moins 10 caractères.")
  .max(128, "Le mot de passe est trop long.")
  .refine((value) => /[A-Za-z]/.test(value), {
    message: "Le mot de passe contient au moins une lettre.",
  })
  .refine((value) => /\d/.test(value), {
    message: "Le mot de passe contient au moins un chiffre.",
  });

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Indique ton mot de passe." })
    .min(1, "Indique ton mot de passe.")
    .max(128, "Le mot de passe est trop long."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type PublicUser = {
  id: string;
  email: string;
  role: Role;
};

export const accessPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  role: z.literal(memberRole),
  sid: z.string().uuid(),
});

export type AccessPayload = z.infer<typeof accessPayloadSchema>;

export const errorCodes = {
  validation: "VALIDATION_ERROR",
  emailTaken: "EMAIL_ALREADY_USED",
  invalidCredentials: "INVALID_CREDENTIALS",
  unauthenticated: "UNAUTHENTICATED",
  sessionExpired: "SESSION_EXPIRED",
  internal: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes];

export type FieldError = {
  path: string;
  message: string;
};

export type ApiError = {
  code: string;
  message: string;
  details: FieldError[];
};

export type ApiErrorBody = {
  error: ApiError;
};

export function apiError(
  code: string,
  message: string,
  details: FieldError[] = [],
): ApiError {
  return { code, message, details };
}

export function zodFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

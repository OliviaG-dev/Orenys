import { z } from "zod";

function blankToUndefined(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  COOKIE_SECURE: z.enum(["true", "false"]).default("false"),
  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  WEB_DIST_DIR: z.preprocess(blankToUndefined, z.string().min(1).optional()),
});

export type Env = {
  databaseUrl: string;
  accessTokenSecret: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlDays: number;
  cookieSecure: boolean;
  port: number;
  webOrigin: string;
  webDistDir: string | undefined;
};

export function readEnv(source: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Configuration invalide : ${fields}`);
  }

  return {
    databaseUrl: parsed.data.DATABASE_URL,
    accessTokenSecret: parsed.data.ACCESS_TOKEN_SECRET,
    accessTokenTtlSeconds: parsed.data.ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlDays: parsed.data.REFRESH_TOKEN_TTL_DAYS,
    cookieSecure: parsed.data.COOKIE_SECURE === "true",
    port: parsed.data.PORT,
    webOrigin: parsed.data.WEB_ORIGIN,
    webDistDir: parsed.data.WEB_DIST_DIR,
  };
}

export const ENV = Symbol("ENV");

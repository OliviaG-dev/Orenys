import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EnvModule } from "./config/env.module";
import { HealthModule } from "./health/health.module";
import { MeModule } from "./me/me.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [EnvModule, PrismaModule, HealthModule, AuthModule, MeModule],
})
export class AppModule {}

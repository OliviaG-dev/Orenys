import "./load-env";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";
import { readEnv } from "./config/env";
import { ACCESS_COOKIE } from "./auth/auth.constants";
import { mountWebApp } from "./web/mount-web-app";

export async function createApp() {
  const env = readEnv(process.env);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableCors({ origin: env.webOrigin, credentials: true });
  app.enableShutdownHooks();
  // Avant init : le 404 de Nest est enregistré après ces middlewares.
  mountWebApp(app, env.webDistDir);

  const swagger = new DocumentBuilder()
    .setTitle("ORÉNYS")
    .setDescription("API du socle ORÉNYS.")
    .setVersion("1.0")
    .addCookieAuth(ACCESS_COOKIE)
    .build();
  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swagger));
  return app;
}

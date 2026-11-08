import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Controller, Get, Module, type INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { readEnv } from "../src/config/env";
import { mountWebApp } from "../src/web/mount-web-app";

const baseEnv = {
  DATABASE_URL: "postgresql://orenys:orenys@localhost:5433/orenys",
  ACCESS_TOKEN_SECRET: "local-dev-secret-change-before-any-deploy-32",
};

@Controller("health")
class HealthController {
  @Get()
  health(): { status: "ok" } {
    return { status: "ok" };
  }
}

@Module({ controllers: [HealthController] })
class ProbeModule {}

describe("Front servi par l'API", () => {
  let app: INestApplication;
  let webDist: string;

  beforeAll(async () => {
    webDist = mkdtempSync(join(tmpdir(), "orenys-web-"));
    mkdirSync(join(webDist, "assets"));
    writeFileSync(join(webDist, "index.html"), "<!doctype html><title>ORÉNYS</title>");
    writeFileSync(join(webDist, "assets", "app.js"), "export const build = 'ok';");

    const nest = await NestFactory.create<NestExpressApplication>(ProbeModule, { logger: false });
    nest.setGlobalPrefix("api");
    mountWebApp(nest, webDist);
    await nest.init();
    app = nest;
  });

  afterAll(async () => {
    await app.close();
    rmSync(webDist, { recursive: true, force: true });
  });

  it("sert la page et les routes du navigateur", async () => {
    const home = await request(app.getHttpServer()).get("/").expect(200);
    expect(home.text).toContain("ORÉNYS");
    expect(home.headers["content-type"]).toContain("text/html");
    expect(home.headers["cache-control"]).toBe("no-cache");

    const page = await request(app.getHttpServer()).get("/connexion").expect(200);
    expect(page.text).toContain("ORÉNYS");
  });

  it("sert les fichiers construits et laisse l'API répondre", async () => {
    const asset = await request(app.getHttpServer()).get("/assets/app.js").expect(200);
    expect(asset.text).toContain("ok");
    expect(asset.headers["cache-control"]).toBe("public, max-age=31536000, immutable");

    await request(app.getHttpServer()).get("/assets/missing.js").expect(404);
    await request(app.getHttpServer()).post("/connexion").expect(404);
    await request(app.getHttpServer()).get("/api/health").expect(200).expect({ status: "ok" });
  });

  it("n'exige pas de dossier web en local", () => {
    expect(readEnv(baseEnv).webDistDir).toBeUndefined();
    expect(readEnv({ ...baseEnv, WEB_DIST_DIR: "   " }).webDistDir).toBeUndefined();
    expect(() => mountWebApp({ use() {} }, undefined)).not.toThrow();
  });

  it("refuse un dossier web absent", () => {
    expect(() => mountWebApp({ use() {} }, join(webDist, "absent"))).toThrow(/WEB_DIST_DIR introuvable/);
  });
});

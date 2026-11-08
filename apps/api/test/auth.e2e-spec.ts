import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createApp } from "../src/create-app";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Auth", () => {
  let app: INestApplication;
  const password = "parcours-12";

  beforeAll(async () => {
    app = await createApp();
    await app.init();
  });

  beforeEach(async () => {
    const prisma = app.get(PrismaService);
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it("répond sur la santé", async () => {
    await request(app.getHttpServer()).get("/api/health").expect(200).expect({ status: "ok" });
  });

  it("refuse /me sans cookie", async () => {
    const response = await request(app.getHttpServer()).get("/api/me").expect(401);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("ouvre une session, la renouvelle, puis la ferme", async () => {
    const email = `ada-${randomUUID()}@example.com`;
    const agent = request.agent(app.getHttpServer());

    const created = await agent.post("/api/auth/register").send({ email, password }).expect(201);
    expect(created.body.email).toBe(email);
    expect(created.body.role).toBe("member");

    const me = await agent.get("/api/me").expect(200);
    expect(me.body.email).toBe(email);

    await agent.post("/api/auth/refresh").expect(200);
    await agent.get("/api/me").expect(200);

    await agent.post("/api/auth/logout").expect(204);
    await agent.get("/api/me").expect(401);
  });

  it("reconnecte un compte existant et refuse un mauvais mot de passe", async () => {
    const email = `ada-${randomUUID()}@example.com`;
    await request(app.getHttpServer()).post("/api/auth/register").send({ email, password }).expect(201);

    const agent = request.agent(app.getHttpServer());
    await agent.post("/api/auth/login").send({ email, password }).expect(200);
    await agent.get("/api/me").expect(200);

    const refused = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email, password: "parcours-99" })
      .expect(401);
    expect(refused.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("refuse un second compte avec la même adresse", async () => {
    const email = `ada-${randomUUID()}@example.com`;
    await request(app.getHttpServer()).post("/api/auth/register").send({ email, password }).expect(201);
    const duplicate = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({ email, password })
      .expect(409);
    expect(duplicate.body.error.code).toBe("EMAIL_ALREADY_USED");
  });

  it("refuse une inscription incomplète", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({ email: "pas-un-email", password: "court" })
      .expect(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });
});

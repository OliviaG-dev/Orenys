import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, zodFieldErrors } from "./index";

describe("registerSchema", () => {
  it("accepte un e-mail entouré d'espaces et le met en minuscules", () => {
    const parsed = registerSchema.parse({
      email: "  Ada@Example.COM ",
      password: "parcours-12",
    });

    expect(parsed.email).toBe("ada@example.com");
  });

  it("refuse un e-mail vide", () => {
    const result = registerSchema.safeParse({
      email: "   ",
      password: "parcours-12",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(zodFieldErrors(result.error).some((issue) => issue.path === "email")).toBe(true);
    }
  });

  it("refuse un e-mail sans arobase", () => {
    const result = registerSchema.safeParse({
      email: "ada.example.com",
      password: "parcours-12",
    });

    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe trop court", () => {
    const result = registerSchema.safeParse({
      email: "ada@example.com",
      password: "court1a",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("10 caractères"))).toBe(
        true,
      );
    }
  });

  it("refuse un mot de passe sans chiffre", () => {
    const result = registerSchema.safeParse({
      email: "ada@example.com",
      password: "parcoursclair",
    });

    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans lettre", () => {
    const result = registerSchema.safeParse({
      email: "ada@example.com",
      password: "1234567890",
    });

    expect(result.success).toBe(false);
  });

  it("accepte un mot de passe mélangeant lettres et chiffre", () => {
    const parsed = registerSchema.parse({
      email: "ada@example.com",
      password: "parcours-12",
    });

    expect(parsed.password).toBe("parcours-12");
  });
});

describe("loginSchema", () => {
  it("refuse un mot de passe vide", () => {
    const result = loginSchema.safeParse({
      email: "ada@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["--filter", "@orenys/api", "exec", "prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: "postgresql://orenys:orenys@localhost:5433/orenys_test?schema=public",
  },
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);

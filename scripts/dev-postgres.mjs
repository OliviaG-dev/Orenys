import { spawnSync } from "node:child_process";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 5433;
const adminUrl = `postgresql://orenys:orenys@127.0.0.1:${port}/orenys`;
const databaseDir = path.join(os.homedir(), ".orenys", "pg");

function commandExists(command) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore" });
  return result.status === 0;
}

function portBusy() {
  return new Promise((resolve) => {
    const socket = net.connect(port, "127.0.0.1");
    const finish = (busy) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(busy);
    };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
  });
}

function waitForPort() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const attempt = () => {
      const socket = net.connect(port, "127.0.0.1");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - started > 30000) {
        reject(new Error(`PostgreSQL ne répond pas sur le port ${port}.`));
          return;
        }
        setTimeout(attempt, 400);
      });
    };
    attempt();
  });
}

async function ensureTestDatabase() {
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();
  const existing = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", ["orenys_test"]);
  if (existing.rowCount === 0) {
    await client.query("CREATE DATABASE orenys_test");
  }
  await client.end();
}

async function startEmbedded() {
  const { default: EmbeddedPostgres } = await import("embedded-postgres");
  const server = new EmbeddedPostgres({
    databaseDir,
    user: "orenys",
    password: "orenys",
    port,
    persistent: true,
    autoRehydrateSymlinks: true,
  });
  try {
    await server.initialise();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("already")) {
      throw error;
    }
  }
  await server.start();
  try {
    await server.createDatabase("orenys");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("already")) {
      throw error;
    }
  }
}

async function main() {
  if (await portBusy()) {
    await ensureTestDatabase();
    console.log(`PostgreSQL est déjà disponible sur le port ${port}.`);
    return;
  }

  if (commandExists("docker")) {
    const compose = spawnSync("docker", ["compose", "up", "-d"], { cwd: root, stdio: "inherit" });
    if (compose.status !== 0) {
      throw new Error("docker compose n'a pas pu démarrer PostgreSQL.");
    }
  } else {
    console.log("Docker est absent. Démarrage d'un PostgreSQL local embarqué.");
    await startEmbedded();
  }

  await waitForPort();
  await ensureTestDatabase();
  console.log("PostgreSQL est prêt.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

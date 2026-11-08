import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = dirname(dirname(fileURLToPath(import.meta.url)));
let current = null;

function stopCurrent(signal) {
  current?.kill(signal);
}

process.on("SIGTERM", () => {
  stopCurrent("SIGTERM");
});
process.on("SIGINT", () => {
  stopCurrent("SIGINT");
});

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: apiRoot, stdio: "inherit" });
    current = child;
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (current === child) {
        current = null;
      }
      if (signal) {
        reject(new Error(`Commande interrompue (${signal})`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`prisma migrate deploy a échoué (${code ?? "inconnu"})`));
        return;
      }
      resolve();
    });
  });
}

await run([join(apiRoot, "node_modules/prisma/build/index.js"), "migrate", "deploy"]);

const server = spawn(process.execPath, [join(apiRoot, "dist/main.js")], {
  cwd: apiRoot,
  stdio: "inherit",
});
current = server;
server.on("exit", (code, signal) => {
  process.exit(signal ? 1 : (code ?? 1));
});

import { existsSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import express, { type RequestHandler } from "express";

const ASSET_CACHE = "public, max-age=31536000, immutable";
const DOCUMENT_CACHE = "no-cache";

type MiddlewareApp = {
  use(handler: RequestHandler): void;
};

export function mountWebApp(app: MiddlewareApp, webDistDir: string | undefined): void {
  if (!webDistDir) {
    return;
  }

  const root = resolve(webDistDir);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`WEB_DIST_DIR introuvable : ${webDistDir}`);
  }

  app.use(createWebHandler(root));
}

function createWebHandler(root: string): RequestHandler {
  const assets = express.static(root, {
    index: false,
    redirect: false,
    setHeaders(response, filePath) {
      const cache = filePath.includes(`${sep}assets${sep}`) ? ASSET_CACHE : DOCUMENT_CACHE;
      response.setHeader("Cache-Control", cache);
    },
  });

  return (request, response, next) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      next();
      return;
    }
    if (request.path === "/api" || request.path.startsWith("/api/")) {
      next();
      return;
    }

    assets(request, response, (error) => {
      if (error) {
        next(error);
        return;
      }
      if (response.headersSent) {
        return;
      }
      if (request.path.includes(".")) {
        next();
        return;
      }

      response.setHeader("Cache-Control", DOCUMENT_CACHE);
      response.sendFile(join(root, "index.html"), (sendError) => {
        if (sendError) {
          next(sendError);
        }
      });
    });
  };
}

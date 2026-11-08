FROM node:22-bookworm-slim AS build

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV CI=true
RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma
COPY apps/web/package.json apps/web/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @orenys/domain build \
  && pnpm --filter @orenys/web build \
  && pnpm --filter @orenys/api exec prisma generate \
  && pnpm --filter @orenys/api build

FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates passwd \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --create-home --uid 10001 orenys

WORKDIR /app
COPY --from=build --chown=orenys:orenys /app /app
USER orenys

ENV NODE_ENV=production
ENV WEB_DIST_DIR=/app/apps/web/dist

EXPOSE 8000
CMD ["node", "apps/api/scripts/start-prod.mjs"]

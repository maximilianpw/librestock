# Dockerfile for @librestock/api (NestJS)
# Based on: https://www.tomray.dev/nestjs-docker-production

# Base stage with pnpm
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# Development stage - for local dev with hot reload
FROM base AS development
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/tsconfig/ ./packages/tsconfig/
COPY modules/api/package.json ./modules/api/
RUN pnpm install --frozen-lockfile
COPY modules/api/ ./modules/api/
WORKDIR /app/modules/api
CMD ["pnpm", "start:dev"]

# Build stage
FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/tsconfig/ ./packages/tsconfig/
COPY modules/api/package.json ./modules/api/
RUN pnpm install --frozen-lockfile
COPY modules/api/ ./modules/api/
RUN pnpm --filter @librestock/api build

# Production stage
FROM base AS production
ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/tsconfig/ ./packages/tsconfig/
COPY modules/api/package.json ./modules/api/
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/modules/api/dist ./modules/api/dist

EXPOSE 8080
WORKDIR /app/modules/api
CMD ["node", "dist/main"]

FROM node:20-alpine AS builder
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps ./apps
RUN npm install -g pnpm@8.15.0
RUN pnpm install --filter @petshop/api --frozen-lockfile
RUN pnpm --filter @petshop/api build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=builder /repo/apps/api/node_modules ./node_modules
CMD ["node", "dist/main.js"]

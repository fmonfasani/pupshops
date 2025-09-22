FROM node:20-alpine AS builder
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps ./apps
RUN npm install -g pnpm@8.15.0
RUN pnpm install --filter @petshop/web --frozen-lockfile
RUN pnpm --filter @petshop/web build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /repo/apps/web/.next ./.next
COPY --from=builder /repo/apps/web/package.json ./package.json
COPY --from=builder /repo/apps/web/public ./public
COPY --from=builder /repo/apps/web/node_modules ./node_modules
EXPOSE 3000
CMD ["npx", "next", "start"]

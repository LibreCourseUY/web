FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.18.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG GH_TOKEN
ENV GH_TOKEN=$GH_TOKEN

RUN pnpm build

FROM nginx:stable-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
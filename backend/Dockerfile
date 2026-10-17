FROM ghcr.io/pnpm/pnpm:12

RUN pnpm runtime set node 24 -g

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/ backend/

RUN pnpm install --frozen-lockfile

EXPOSE 5000

WORKDIR /usr/src/app/backend
RUN pnpm run build

CMD ["node", "./dist/index.js"]

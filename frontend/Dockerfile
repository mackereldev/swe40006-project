FROM ghcr.io/pnpm/pnpm:12

RUN pnpm runtime set node 24 -g

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/ frontend/

RUN pnpm install --frozen-lockfile

EXPOSE 4173

WORKDIR /usr/src/app/frontend
RUN pnpm run build

CMD ["pnpm", "run", "preview"]

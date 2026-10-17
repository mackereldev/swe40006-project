FROM ghcr.io/pnpm/pnpm:12
ARG ENV

RUN pnpm runtime set node 24 -g

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/ frontend/

RUN pnpm install --frozen-lockfile

EXPOSE 4173

WORKDIR /usr/src/app/frontend

RUN if [ "$ENV" = "development" ] ; then \
  echo 'pnpm run dev' > ./run.sh; \
else \
  pnpm run build; \
  echo 'pnpm run preview' > ./run.sh; \
fi; \
chmod 777 ./run.sh

CMD ./run.sh

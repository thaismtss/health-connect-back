FROM node:18

ADD . /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY apps/health-connect-back/tsconfig.app.json ./

RUN npx prisma generate 

RUN yarn && yarn build @app/health-connect-back

RUN yarn jiti prisma/seeds/index.ts

EXPOSE 3000
CMD yarn --cwd app start:migrate:dev

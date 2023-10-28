FROM node:18

ADD . /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY apps/glycemic-control/tsconfig.app.json ./

RUN npx prisma generate

RUN yarn && yarn build @app/glycemic-control

EXPOSE 3000
CMD yarn --cwd app start:dev glycemic-control

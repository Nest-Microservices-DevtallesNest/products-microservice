FROM node:21-alpine3.19

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 3001
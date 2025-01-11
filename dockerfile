FROM node:21-alpine3.19

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpx prisma generate

EXPOSE 3001
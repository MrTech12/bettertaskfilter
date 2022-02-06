# Building the Production JS version of the application.
FROM node:16.13.2-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install && npm install -g typescript 

COPY . .

RUN npm run build

CMD [ "node", "./dist/app.js" ]
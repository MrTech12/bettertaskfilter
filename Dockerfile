# Building the Production JS version of the application.
FROM node:16.13.2-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install && npm install -g typescript 

COPY . .

RUN npm run build

#Running the JS version of the application.
FROM node:16.13.2-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./

RUN npm install --production

# Adding a package to be able to change the timezone of the environment.
RUN apk update && apk add --no-cache tzdata

CMD [ "node", "index.js" ]
FROM node:24 AS builder

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:24-slim AS server

WORKDIR /app

COPY --from=builder /app/build ./build

ENV NODE_ENV=production

# internal port
EXPOSE 3000

# run!
CMD [ "node", "build" ]

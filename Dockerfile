FROM node:24 AS builder

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:24-slim AS server

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
RUN npm i --omit=dev

# internal port
EXPOSE 3000

# run!
CMD [ "node", "build" ]

FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm ci --only=production || npm i --only=production

COPY server.js .

COPY users.proto ./users.proto

EXPOSE 50051 4001

CMD ["npm","start"]
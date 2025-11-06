FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm ci --only=production || npm i --only=production

COPY index.js .

ENV PORT=4001
EXPOSE 4001

CMD ["npm","start"]

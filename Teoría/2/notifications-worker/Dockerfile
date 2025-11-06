FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm ci --only=production || npm i --only=production
COPY index.js .
CMD ["npm","start"]

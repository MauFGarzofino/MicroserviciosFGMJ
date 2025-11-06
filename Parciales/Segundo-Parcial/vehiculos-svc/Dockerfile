FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i
COPY src ./src
EXPOSE 3002 50051
CMD ["node", "src/index.js"]

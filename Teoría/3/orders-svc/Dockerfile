FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm ci --only=production || npm i --only=production
COPY index.js .
COPY users.proto ./users.proto
ENV PORT=4002
EXPOSE 4002
CMD ["npm","start"]

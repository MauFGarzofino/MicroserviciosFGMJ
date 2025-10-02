FROM node:20-alpine

# Crea usuario no root
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# Instala dependencias sin copiar todo el código
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el código
COPY . .

# Variables por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Usa el usuario no-root
USER app

EXPOSE 3000
CMD ["npm", "start"]

# Node 20 en Alpine (ligero)
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Solo copiar package.json/lock para cachear dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
# Esto incluye src/, views/, public/, server.js, etc.
COPY . .

# Exponer puerto de la app
EXPOSE 3000

# Comando de para iniciar el servidor
CMD ["node", "src/server.js"]

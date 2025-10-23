# Usamos Node 20
FROM node:20

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Comando por defecto para correr el consumidor
CMD ["node", "consumer.js"]

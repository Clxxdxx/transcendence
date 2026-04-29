FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos de dependencias primero (optimiza el cache)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Angular
EXPOSE 4200

# Comando para arrancar en modo desarrollo
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
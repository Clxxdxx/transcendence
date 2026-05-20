FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./

# Limpiamos instalaciones viejas para que no arrastre el error de caché
RUN npm ci || npm install

# Instalamos explícitamente el plugin oficial que te exige el log de error
RUN npm install -D @tailwindcss/postcss tailwindcss

# Copiamos el resto del código
COPY . .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
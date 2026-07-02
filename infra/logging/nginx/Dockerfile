FROM nginx:alpine

# Instalar htpasswd tool
RUN apk add --no-cache apache2-utils

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Puerto
EXPOSE 5602

# Ejecutar
ENTRYPOINT ["/entrypoint.sh"]

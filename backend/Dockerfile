FROM php:8.3-fpm-alpine

# Instalar dependencias del sistema y extensiones de PHP para Postgres
# Cambiamos pdo_postgresql por pdo_pgsql
RUN apk add --no-cache libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiamos el código
COPY . .

# Instalamos dependencias de PHP
RUN composer install --no-scripts --no-autoloader

# Damos permisos a las carpetas de Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
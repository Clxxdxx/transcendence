FROM php:8.3-fpm-alpine

RUN apk add --no-cache libpq-dev git zip unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql pdo_mysql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiamos solo los archivos de dependencias primero para aprovechar la caché de Docker
COPY composer.* ./

# Añadimos --no-scripts para evitar que busque 'artisan' antes de tiempo
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copiamos el resto del código (aquí ya entra 'artisan')
COPY . .

# Ajuste de permisos (importante para Laravel)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
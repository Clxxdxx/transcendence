FROM php:8.3-fpm-alpine

RUN apk add --no-cache libpq-dev git zip unzip mysql-client \
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

# Crear directorios de runtime que storage/ excluye del build context
RUN mkdir -p /var/www/html/storage/app/private/backups \
             /var/www/html/storage/app/public \
             /var/www/html/storage/framework/cache \
             /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/logs \
             /var/www/html/bootstrap/cache

# Ajuste de permisos (importante para Laravel)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
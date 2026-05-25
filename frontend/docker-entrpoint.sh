#!/bin/sh
set -e

# Asegurar que las dependencias existen
if [ ! -d "vendor" ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Ejecutar el comando pasado (php-fpm)
exec "$@"
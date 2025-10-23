# Usamos PHP 8.2 FPM
FROM php:8.2-fpm

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl \
    && docker-php-ext-install pdo_mysql sockets

# Establecer directorio de trabajo
WORKDIR /var/www

# Copiar todo el proyecto antes de Composer (para que artisan exista)
COPY . .

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Instalar dependencias de Laravel
RUN composer install --no-interaction --prefer-dist

# Exponer puerto 8000
EXPOSE 8000

# Comando por defecto
CMD php artisan serve --host=0.0.0.0 --port=8000

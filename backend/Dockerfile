FROM php:8.2-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install mysqli pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html/

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy secret file if it exists
RUN if [ -f /etc/secrets/.env ]; then cp /etc/secrets/.env /var/www/html/.env; fi

RUN chown -R www-data:www-data /var/www/html
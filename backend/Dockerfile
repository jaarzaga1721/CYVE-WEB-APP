FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY . /var/www/html/

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Update permissions
RUN chown -R www-data:www-data /var/www/html

FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install mysqli extension
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY . /var/www/html/

# Update permissions
RUN chown -R www-data:www-data /var/www/html

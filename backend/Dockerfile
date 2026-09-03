# PHP 8.3 CLI image with the extensions Laravel + this app's mysql/sqlite
# drivers need. Runs `artisan serve` directly rather than php-fpm+nginx,
# to keep this a single-container dev/eval setup matching docker-compose.yml.
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libsqlite3-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-interaction --no-progress --prefer-dist --no-dev \
    && cp .env.example .env \
    && php artisan key:generate

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

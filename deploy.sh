#!/bin/bash

# ===========================================
# ProbmaxCare VPS Deployment Script
# ===========================================

set -e

echo "🚀 Starting ProbmaxCare deployment..."

# Variables
APP_DIR="/var/www/probmaxcare"
REPO_URL="https://github.com/thirza-rep/ProbmaxCare.git"

# 1. Clone or pull repository
if [ -d "$APP_DIR" ]; then
    echo "📥 Pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    echo "📦 Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# 2. Backend setup
echo "🔧 Setting up backend..."
cd $APP_DIR/backend

# Copy production env
cp .env.production .env

# Install dependencies
composer install --no-dev --optimize-autoloader

# Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 3. Frontend setup
echo "🎨 Building frontend..."
cd $APP_DIR/frontend

npm install
npm run build

# 4. Copy nginx configs
echo "🌐 Setting up Nginx..."
sudo cp $APP_DIR/nginx/api.probmaxcare.site.conf /etc/nginx/sites-available/
sudo cp $APP_DIR/nginx/probmaxcare.site.conf /etc/nginx/sites-available/

# Enable sites
sudo ln -sf /etc/nginx/sites-available/api.probmaxcare.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/probmaxcare.site.conf /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

# 5. SSL Certificates (if not exists)
if [ ! -f "/etc/letsencrypt/live/probmaxcare.site/fullchain.pem" ]; then
    echo "🔒 Setting up SSL certificates..."
    sudo certbot --nginx -d probmaxcare.site -d www.probmaxcare.site -d api.probmaxcare.site --non-interactive --agree-tos -m your-email@example.com
fi

echo "✅ Deployment complete!"
echo "🌍 Frontend: https://probmaxcare.site"
echo "🔌 Backend:  https://api.probmaxcare.site"

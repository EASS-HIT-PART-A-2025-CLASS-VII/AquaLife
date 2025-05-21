#!/bin/bash

# Script to initialize Let's Encrypt for aqualife.com

set -e

# Domain and email configuration
domains=(aqualife.com www.aqualife.com)
email="admin@aqualife.com"  # Change to your email
data_path="./ssl/certbot"
rsa_key_size=4096

# Check if we're testing in staging mode
staging=1 # Set to 1 if you're testing your setup

echo "### Creating $data_path directory structure..."
mkdir -p "$data_path/conf/live/$domains"
mkdir -p "$data_path/www"

echo "### Downloading recommended TLS parameters..."
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"

echo "### Creating dummy certificate for ${domains[0]}..."
openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
  -keyout "$data_path/conf/live/$domains/privkey.pem" \
  -out "$data_path/conf/live/$domains/fullchain.pem" \
  -subj "/CN=localhost"

echo "### Starting nginx container for certificate setup..."
docker-compose up -d react-nginx-frontend

echo "### Deleting dummy certificate for ${domains[0]}..."
rm -Rf "$data_path/conf/live"
mkdir -p "$data_path/conf/live/$domains"

echo "### Requesting Let's Encrypt certificate for ${domains[@]}..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate certbot command based on staging flag
staging_arg=""
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $domain_args \
    --email $email \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot

echo "### Stopping initial nginx container..."
docker-compose stop react-nginx-frontend

echo "### Starting all containers..."
docker-compose up -d

echo "### Setup completed successfully!"
echo "Your site should be available at https://${domains[0]}" 
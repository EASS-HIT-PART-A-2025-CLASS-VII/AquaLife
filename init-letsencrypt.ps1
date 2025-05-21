# PowerShell script to initialize Let's Encrypt for aqualife.com

# Domain and email configuration
$domains = @("aqualife.com", "www.aqualife.com")
$email = "admin@aqualife.com"  # Change to your email
$data_path = "./ssl/certbot"
$rsa_key_size = 4096

# Check if we're testing in staging mode (1 for staging, 0 for production)
$staging = 1

Write-Host "### Creating $data_path directory structure..."
New-Item -Path "$data_path/conf/live/$($domains[0])" -ItemType Directory -Force | Out-Null
New-Item -Path "$data_path/www" -ItemType Directory -Force | Out-Null

Write-Host "### Downloading recommended TLS parameters..."
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf" -OutFile "$data_path/conf/options-ssl-nginx.conf"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem" -OutFile "$data_path/conf/ssl-dhparams.pem"

Write-Host "### Creating dummy certificate for $($domains[0])..."
# Using OpenSSL to create dummy certificates (requires OpenSSL installed)
# Check if OpenSSL is available
if (Get-Command "openssl" -ErrorAction SilentlyContinue) {
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 `
        -keyout "$data_path/conf/live/$($domains[0])/privkey.pem" `
        -out "$data_path/conf/live/$($domains[0])/fullchain.pem" `
        -subj "/CN=localhost"
} else {
    Write-Host "OpenSSL not found. Please install OpenSSL or create dummy certificates manually."
    Write-Host "You can download OpenSSL for Windows from https://slproweb.com/products/Win32OpenSSL.html"
    exit 1
}

Write-Host "### Starting nginx container for certificate setup..."
docker-compose up -d react-nginx-frontend

Write-Host "### Deleting dummy certificate for $($domains[0])..."
Remove-Item -Path "$data_path/conf/live" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path "$data_path/conf/live/$($domains[0])" -ItemType Directory -Force | Out-Null

Write-Host "### Requesting Let's Encrypt certificate for $($domains -join ', ')..."
$domain_args = ""
foreach ($domain in $domains) {
    $domain_args += "-d $domain "
}

# Select appropriate certbot command based on staging flag
$staging_arg = ""
if ($staging -ne 0) { $staging_arg = "--staging" }

# Run certbot in Docker
docker-compose run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot $staging_arg $domain_args --email $email --rsa-key-size $rsa_key_size --agree-tos --force-renewal" certbot

Write-Host "### Stopping initial nginx container..."
docker-compose stop react-nginx-frontend

Write-Host "### Starting all containers..."
docker-compose up -d

Write-Host "### Setup completed successfully!"
Write-Host "Your site should be available at https://$($domains[0])" 
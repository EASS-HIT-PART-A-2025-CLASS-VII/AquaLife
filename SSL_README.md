# SSL Setup with Let's Encrypt for AquaLife

This guide walks through setting up SSL certificates with Let's Encrypt for aqualife.com using certbot in Docker.

## Prerequisites

- Docker and Docker Compose installed
- Domain name (aqualife.com) with DNS pointing to your server
- Ports 80 and 443 accessible

## Development vs Production Configuration

The project includes both development (non-SSL) and production (SSL) configurations:

- **Development**: Default configuration without SSL for local development
- **Production**: SSL configuration with Let's Encrypt for the live site

### Switching Between Configurations

To switch from development to production:

```bash
# Copy SSL-ready configurations 
cp docker-compose_SSL.yml docker-compose.yml
cp frontend/nginx/default_SSL.conf frontend/nginx/default.conf

# Then run the certificate initialization script
```

To switch back to development:

```bash
# Restore the original non-SSL configurations
cp docker-compose.yml.bak docker-compose.yml  # If you backed up the original
# OR manually remove SSL-related config
```

## Initial SSL Setup

1. Choose the appropriate initialization script:

   **For Windows (PowerShell):**
   ```
   .\init-letsencrypt.ps1
   ```
   Note: This requires OpenSSL installed on Windows. If you don't have it, download from [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)

   **For Linux/Mac:**
   ```
   chmod +x init-letsencrypt.sh
   ./init-letsencrypt.sh
   ```

2. Edit the initialization script if needed:
   - Change the email address
   - Set staging=1 for testing (to avoid rate limits)
   - Set staging=0 for production once you've confirmed everything works

3. Start your services:
   ```
   docker-compose up -d
   ```

## How It Works

- **Initial Certificate**: The script creates dummy certificates, starts Nginx, obtains real certificates through the ACME challenge, and then configures Nginx to use them.
  
- **Automatic Renewal**: The certbot container will attempt to renew certificates every 12 hours (if they're within 30 days of expiration).

- **Nginx Configuration**: The Nginx server is configured to:
  - Redirect all HTTP traffic to HTTPS
  - Serve certificates
  - Periodically reload to pick up new certificates

## Troubleshooting

- **Certificate Issues**: Check the certbot logs with `docker-compose logs certbot`
- **Nginx Issues**: Check Nginx logs with `docker-compose logs react-nginx-frontend`
- **Common Problems**:
  - DNS not properly configured for domain
  - Ports 80/443 not accessible from the internet
  - Rate limits on Let's Encrypt (use staging=1 for testing)
  - On Windows: Missing OpenSSL or WSL configuration

## Testing SSL Setup

Once deployed, you can check your SSL configuration using:
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [Let's Encrypt Certificate Checker](https://check-your-website.server-daten.de/)

## Manual Renewal

If needed, you can manually trigger certificate renewal:
```
docker-compose run --rm certbot renew
docker-compose exec react-nginx-frontend nginx -s reload
``` 
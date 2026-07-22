# Production Deployment Guide — Momentum

This guide provides step-by-step instructions for deploying **Momentum** on a production Linux server (Ubuntu 22.04 / Debian 12) using **Docker Compose**, **Nginx**, **Let's Encrypt SSL/TLS**, and **PostgreSQL**.

---

## 📋 System Prerequisites

- Linux VPS / Server (2 CPU Cores, 4GB RAM minimum)
- Domain Name pointing to Server IP (e.g. `momentum.cyber`)
- Installed packages: `docker`, `docker-compose-plugin`, `git`

---

## Step 1: Server Preparation

```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify Docker installation
docker --version
docker compose version
```

---

## Step 2: Clone Codebase & Configure Environment Variables

```bash
# Clone repository
git clone https://github.com/your-org/momentum.git /opt/momentum
cd /opt/momentum

# Create production environment file for backend
cp backend/.env.production backend/.env
```

Edit `backend/.env` with your secure production values:
```env
DEBUG=False
SECRET_KEY=generate_a_random_64_character_secret_key_here
ALLOWED_HOSTS=momentum.cyber,api.momentum.cyber,127.0.0.1,localhost

DB_ENGINE=django.db.backends.postgresql
DB_NAME=momentum_prod_db
DB_USER=momentum_prod_user
DB_PASSWORD=your_ultra_secure_postgres_password
DB_HOST=db
DB_PORT=5432

CORS_ALLOWED_ORIGINS=https://momentum.cyber
```

---

## Step 3: Build & Launch Docker Containers

```bash
# Build images and start container services in detached mode
docker compose up -d --build

# Run Django migrations inside backend container
docker compose exec backend python manage.py migrate

# Create Superuser Account for Django Admin
docker compose exec backend python manage.py createsuperuser
```

---

## Step 4: Configure Let's Encrypt HTTPS SSL Certificate

Install `certbot` and obtain a free SSL certificate:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL Certificate
sudo certbot --nginx -d momentum.cyber -d api.momentum.cyber

# Test automatic renewal
sudo certbot renew --dry-run
```

---

## Step 5: Verification & Health Checks

- Check running Docker containers: `docker compose ps`
- Check Gunicorn application logs: `docker compose logs -f backend`
- Check Nginx web server logs: `docker compose logs -f frontend`
- Access Swagger Documentation: `https://momentum.cyber/api/docs/`

---

## 🛡️ Security Hardening Checklist

- [x] Set `DEBUG=False` in Django production configuration.
- [x] Configure strict `CORS_ALLOWED_ORIGINS` and `ALLOWED_HOSTS`.
- [x] Enable HTTP Strict Transport Security (HSTS) and SSL redirection.
- [x] Enforce rate limiting throttling on REST API endpoints (`100 req/min`).
- [x] Set up automated daily database backups via PostgreSQL `pg_dump`.

# Production Deployment & Readiness Checklist — Momentum

This document outlines the final production readiness verification checklist across security, performance, monitoring, backups, environment variables, Docker containerization, and CI/CD pipelines.

---

## 🔒 1. Security & Compliance Checklist

- [x] **Debug Mode Disabled**: `DEBUG=False` set in `.env.production`.
- [x] **Secret Key Security**: Django `SECRET_KEY` pulled strictly from environment variables.
- [x] **Allowed Hosts**: `ALLOWED_HOSTS` configured with explicit domain names (`momentum.cyber`, `api.momentum.cyber`).
- [x] **CORS Origin Whitelist**: `CORS_ALLOWED_ORIGINS` strictly limited to authorized frontend origins (`https://momentum.cyber`).
- [x] **Password Validation**: `AUTH_PASSWORD_VALIDATORS` enabled enforcing length (min 8), similarity, common passwords, and numeric checks.
- [x] **HTTP Security Headers**:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security` (HSTS: 1 Year)
  - `Content-Security-Policy` (CSP)
- [x] **Cookie Security**: `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, and `CSRF_COOKIE_HTTPONLY` set to `True`.
- [x] **API Authorization & IDOR Protection**: Custom `IsOwnerPermission` and serializer task ownership validation enabled.
- [x] **Rate Limiting**: DRF throttling configured (`AnonRateThrottle: 20/min`, `UserRateThrottle: 100/min`).

---

## ⚡ 2. Performance & Caching Checklist

- [x] **Vite Bundle Code Splitting**: Rollup `manualChunks` configured to isolate vendor libraries (`vendor-react`, `vendor-framer`, `vendor-recharts`, `vendor-query`). Initial load payload under **1.51 kB**.
- [x] **Route Lazy Loading**: All 10 feature pages lazy-loaded via `React.lazy()` and `Suspense`.
- [x] **API Response Compression**: Django `GZipMiddleware` enabled for response payload compression over 200 bytes.
- [x] **Database Query Optimization**: DRF querysets use `.select_related('user')` and `.select_related('user', 'task')` to eliminate N+1 queries.
- [x] **TanStack Query Cache**: Client-side query cache validity configured (`staleTime: 5m`, `gcTime: 10m`).

---

## 🐳 3. Docker & Deployment Checklist

- [x] **Backend Dockerfile**: Multi-stage build Python 3.11 slim container running Gunicorn WSGI.
- [x] **Frontend Dockerfile**: Multi-stage Node 20 build compiling Vite static assets to Nginx.
- [x] **Docker Compose**: Orchestrates PostgreSQL 15, Gunicorn backend, and Nginx web proxy.
- [x] **Nginx Reverse Proxy**: Re-routes `/api/` traffic to Gunicorn application server with Gzip compression and static caching.

---

## 📊 4. Logging & Monitoring Checklist

- [x] **Production Logging**: Structured Django `LOGGING` dict configured with ISO timestamps and console handlers.
- [x] **Client Performance Monitoring**: Navigation & Memory timing monitor in `src/utils/performance.ts`.
- [x] **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflows/ci-cd.yml`) executing backend test runner, frontend build verification, and Docker image build checks.

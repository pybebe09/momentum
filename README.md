# Momentum — Production Mission-Control Web Application

[![Build Status](https://img.shields.io/badge/CI%2FCD-passing-brightgreen.svg)](#)
[![Django](https://img.shields.io/badge/Django-4.2-092E20.svg?logo=django)](#)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1.svg?logo=postgresql)](#)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](#)

**Momentum** is a production-grade full-stack web application designed with an **Apple-inspired minimalist aesthetic** fused with a **cybersecurity mission-control dark mode interface**. It empowers operators to manage tasks, track long-term strategic goals (e.g. Japan Relocation, Zero-Trust Cybersecurity Certifications, IELTS, SAT), execute Pomodoro focus sessions, log daily reflections, analyze performance telemetry, and receive intelligent advice from an AI Performance Coach.

---

## 🚀 Key Features & Modules

- **Authentication System**: Email Registration, Login, Google & Apple OAuth triggers, JWT access & refresh token rotation, Password Reset, Email Verification, and Remember Me persistence.
- **Mission Control Dashboard**: Momentum Score counter (94/100), Today's Mission widget, Next Task highlight, Focus Time counter, Current Streak, Weekly Progress chart, and AI Insight cards.
- **Task Management System**: Complete CRUD, Status filtering (*To Do, In Progress, Completed, Blocked*), Priority levels (*Low, Medium, High, Critical*), Duration estimates, Due Date sorting, and Search filter.
- **Strategic Goals Module**: Milestone progress breakdown for **Japan Relocation**, **Cybersecurity Certifications**, **IELTS**, and **SAT** with animated neon progress rings.
- **Focus Mode**: Fullscreen distraction-free timer overlay, Pomodoro presets (25m, 45m, 60m, 90m, Custom), ambient noise generator, keyboard shortcuts (`Esc` exit), and task completion hooks.
- **Daily Reflection Journal**: Mood tracker, 1-10 energy level rating, 3-question daily prompts, markdown support, calendar view, and search tags.
- **Analytics Dashboard**: Interactive Recharts visualizations including Daily/Weekly/Monthly completion trends, Focus vs Study dual bar chart, Task Status Donut chart, Goal Progress breakdown, and an annual 52-week contribution heatmap grid.
- **AI Performance Coach**: Pluggable provider architecture (`BaseAIProvider`, `MockAIProvider`, OpenAI/Gemini/Anthropic ready), daily insight advisory cards, weekly audit modal, and interactive prompt assistant.
- **Settings System**: Operator profile management, Dark Cyber vs Apple Light theme mode switcher, locale language selector, notification toggles, privacy retention options, passphrase updater, active JWT session inspector, JSON data export downloader, and account deletion confirmation modal.
- **RESTful API Infrastructure**: Built on Django REST Framework with SimpleJWT, `django-filter`, pagination (`PageNumberPagination`), rate limiting throttling (`100/min`), `IsOwnerPermission` security, custom JSON exception handler, OpenAPI 3.0 schema generation, and interactive Swagger UI / ReDoc.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla CSS Design Tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query v5 + Axios Client
- **Data Visualization**: Recharts

### Backend
- **Framework**: Django 4.2 LTS + Django REST Framework
- **Authentication**: SimpleJWT (JWT Access & Refresh Token Rotation)
- **Database**: PostgreSQL 15 (with SQLite fallback for rapid dev)
- **Filtering & Search**: `django-filter`, DRF SearchFilter & OrderingFilter
- **OpenAPI Documentation**: `drf-spectacular` (Swagger UI & ReDoc)

### Infrastructure & Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server & Reverse Proxy**: Nginx (with Gzip compression & security headers)
- **Application Server**: Gunicorn
- **CI/CD**: GitHub Actions

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v20+)
- Python (v3.11+)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```
Backend API will be running at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will be running at `http://localhost:3000`.

---

## 🐳 Docker Production Deployment

To launch the complete production stack (PostgreSQL + Gunicorn Backend + Nginx Frontend):

```bash
# Build and run all services in detached mode
docker-compose up -d --build
```

Access the application at:
- **Frontend App**: `http://localhost:80`
- **Backend API**: `http://localhost:80/api/`
- **Swagger API Docs**: `http://localhost:8000/api/docs/`
- **ReDoc API Docs**: `http://localhost:8000/api/redoc/`

---

## 📄 Documentation Links

- [Complete Walkthrough Log](file:///C:/Users/Begi/.gemini/antigravity-ide/brain/711dbc36-08d5-4586-b351-a936f671da01/walkthrough.md)
- [Deployment Guide](file:///c:/Projects/Momentum/docs/deployment_guide.md)

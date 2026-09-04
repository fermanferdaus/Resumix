# Resumix - Modern ATS CV Builder

A full-stack web application designed to create, customize, and manage ATS-friendly Curriculum Vitae (CV) with modern aesthetics, strict dual-ID protection (UUIDv7), robust JWT & OAuth authentication, and dual-environment Docker deployment parity.

---

## 1. Tech Stack & Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo Architecture** | Dual Workspace | `client/` (Frontend SPA) + `server/` (Stateless REST API) |
| **Backend API** | Node.js, Express 5 | Stateless REST API with Service Layer architecture |
| **Database & ORM** | PostgreSQL 15, Prisma ORM | Relational schema with auto-increment internal PK & UUIDv7 public ID |
| **Frontend Client** | React 19, Vite 8, Tailwind CSS v4 | Responsive SPA with TanStack Query & Zustand state management |
| **Authentication** | Dual-Token JWT + Google OAuth | Short-lived Access Token, HttpOnly Refresh Token, 6-digit OTP email flow |
| **Image Processing** | Sharp (Alpine Musl compatible) | Avatar resizing, WebP conversion, auto-cleanup of previous avatars |
| **Email Service** | Nodemailer | Responsive branded HTML templates (no-reply sender, 6-box OTP digits) |
| **Containerization** | Docker, Docker Compose, Nginx | Multi-stage builds, non-root runner, persistent volumes, reverse proxy |
| **Validation** | Zod (End-to-End) | Strict schema validation on client forms and server request payloads |
| **Documentation** | Swagger UI (OpenAPI 3.0.0) | Interactive API exploration at `/api/v1/docs` |

---

## 2. Key Features

### 📄 ATS Resume Builder
* **Dynamic Sections**: Personal Info, Summary, Work Experience, Education, Skills, Projects, and Certifications.
* **Real-Time Live Preview**: Instant visual updates as you type, designed with ATS-friendly layouts.
* **Quota Enforcement**: User quota limit of up to 5 resumes per account.
* **Resume Operations**: Duplicate existing resumes, edit metadata, and soft/hard delete.

### 🔐 Security & Authentication
* **Dual-Token Flow**: 15-minute Access Token in memory/headers + 12-hour HttpOnly Refresh Token in cookies.
* **Google OAuth 2.0 SSO**: One-click authentication with Cross-Origin Opener Policy (COOP) compatibility.
* **6-Digit OTP Verification**: Time-limited OTP codes (5 minutes) for registration and critical actions.
* **Password Reset**: Secure tokenized password reset links sent via email.
* **Route Protection & Direct Logout**: `ProtectedRoute` component protecting authenticated pages (`/dashboard`, `/profile`, `/editor/:id`) with immediate redirection to landing page (`/`) upon logout.

### 👤 Profile & Avatar Management
* **Profile Management**: Full name, bio, birth date, phone number, and address fields.
* **Avatar Upload**: Support for JPEG, PNG, and WebP images with server-side validation and Sharp compression.
* **Smooth UX**: Loading state with `ProfileSkeleton` and avatar pulse animations during upload.
* **Storage Abstraction**: Root-relative `/uploads/` access with automatic cleanup of replaced avatar files.

### ✉️ Branded Transactional Emails
* **Soft Flat Theme**: Email layouts styled to match Resumix dark branding with emerald accents.
* **OTP Digit Boxes**: Individual monospace boxes for each digit of the 6-digit OTP code.
* **Configurable Senders**: `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`, and `MAIL_REPLY_TO` support for proper no-reply compliance.

---

## 3. Directory Structure

```text
cv_ats_builder/
├── client/                     # Frontend Application (React 19 + Vite 8)
│   ├── public/                 # Static assets (favicon, logo.png)
│   ├── src/
│   │   ├── api/                # Axios client & centralized API service endpoints
│   │   ├── components/         # UI components (common, dashboard, editor, layout, profile, ui)
│   │   ├── config/             # Client configuration abstraction layer
│   │   ├── hooks/              # TanStack Query custom mutations & query hooks
│   │   ├── pages/              # Route views (auth, dashboard, editor, error, landing, profile)
│   │   ├── store/              # Zustand global state (AuthStore)
│   │   ├── tests/              # Frontend unit tests
│   │   └── validators/         # Client-side Zod validation schemas
│   ├── .env.example            # Client environment blueprint
│   ├── Dockerfile              # Multi-stage client Docker build
│   ├── nginx.conf              # Nginx reverse proxy & SPA routing config
│   └── package.json
│
├── server/                     # Backend API (Express 5 + Prisma ORM)
│   ├── assets/                 # Server assets (logo.png)
│   ├── config/                 # Server configuration abstraction (app, db, prisma, swagger)
│   ├── controllers/            # HTTP request handlers (auth, resume, user)
│   ├── middlewares/            # Auth guard, error handling, Zod validation
│   ├── prisma/                 # Database schema & PostgreSQL migrations
│   ├── public/uploads/         # Uploaded avatars (mounted to persistent volume in Docker)
│   ├── routes/                 # Express API routes (auth, resumes, users)
│   ├── services/               # Service business logic layer (auth, mail, otp, resume, user)
│   ├── tests/                  # Unit and integration test suites
│   ├── utils/                  # Bcrypt, JWT, UUIDv7, & response formatters
│   ├── validators/             # Server-side Zod validation schemas
│   ├── .env.example            # Server environment blueprint
│   ├── Dockerfile              # Multi-stage server Docker build (Alpine musl)
│   ├── entrypoint.sh           # Container startup & permission initialization script
│   └── package.json
│
├── scripts/
│   └── docker-build.js         # Automated Docker build, version bumper, and deployment runner
├── docker-compose.yml          # Production & local multi-container orchestration
├── docker-compose.db.yml       # Standalone PostgreSQL database service for local dev
├── package.json                # Root scripts (docker:build, docker:up, docker:down)
└── README.md                   # Monorepo documentation
```

---

## 4. Quick Start Guide

### Prerequisites
* **Node.js**: v20.x or later
* **PostgreSQL**: v15.x or later (or via Docker)
* **Docker & Docker Compose**: (Optional, for containerized run)
* **SMTP Provider**: Mailtrap (development) or Gmail / transactional SMTP

---

### Option A: Native Local Development (Recommended for Development)

#### 1. Start Database
You can run PostgreSQL locally or launch a lightweight container:
```bash
docker compose -f docker-compose.db.yml up -d
```

#### 2. Setup Backend Server
```bash
cd server
npm install
cp .env.example .env
```
*Configure your PostgreSQL database credentials (`DATABASE_URL`), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and SMTP settings in `server/.env`.*

Push database schema & start development server:
```bash
npx prisma db push
npx prisma generate
npm run dev
```
* Backend API: `http://localhost:3000`
* Swagger API Documentation: `http://localhost:3000/api/v1/docs`

#### 3. Setup Frontend Client
In a new terminal:
```bash
cd client
npm install
cp .env.example .env
```
*Ensure `VITE_API_URL=http://localhost:3000/api/v1` in `client/.env`.*

Start client development server:
```bash
npm run dev
```
* Frontend Web App: `http://localhost:5173`

---

### Option B: Docker Containerized Deployment

Resumix provides an automated build and version-management script:

1. Pastikan file `server/.env` dan `client/.env` sudah disiapkan.
2. Bangun container image dengan auto-versioning:
   ```bash
   npm run docker:build
   ```
3. Bangun dan langsung jalankan seluruh layanan:
   ```bash
   npm run docker:up
   ```
4. Untuk menghentikan seluruh layanan:
   ```bash
   npm run docker:down
   ```

* Web App (Nginx reverse proxy): `http://localhost:${CLIENT_PORT:-80}`
* Backend API: `http://localhost:${SERVER_PORT:-3000}`

---

## 5. Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Express listening port | `3000` |
| `SERVER_PORT` | Port exposed to host in Docker | `3000` |
| `NODE_ENV` | Application environment | `development` / `production` |
| `APP_URL` | Base URL of backend server | `http://localhost:3000` |
| `CLIENT_URL` | Frontend URL for CORS & email links | `http://localhost:5173` |
| `POSTGRES_USER` | PostgreSQL user | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `secret` |
| `POSTGRES_DB` | PostgreSQL database name | `resumix` |
| `DATABASE_URL` | Prisma connection string | `postgresql://user:pass@localhost:5432/resumix?schema=public` |
| `JWT_ACCESS_SECRET` | Secret key for Access Token | `strong_secret_key` |
| `JWT_ACCESS_EXPIRES_IN` | Access Token duration | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for Refresh Token | `strong_secret_key` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh Token duration | `12h` |
| `OTP_EXPIRES_MINUTES` | OTP code expiry in minutes | `5` |
| `SMTP_HOST` | SMTP server host | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | SMTP port | `587` / `2525` |
| `SMTP_SECURE` | TLS/SSL flag | `false` |
| `SMTP_USER` | SMTP username | `user` |
| `SMTP_PASS` | SMTP password | `password` |
| `MAIL_FROM_ADDRESS` | Sender email address | `noreply@resumix.app` |
| `MAIL_FROM_NAME` | Sender display name | `"Resumix No-Reply"` |
| `MAIL_REPLY_TO` | Reply-To email address | `noreply@resumix.app` |
| `MAIL_LOGO_URL` | Public HTTPS logo URL for email templates | `https://resumix.app/logo.png` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your_google_client_secret` |

### Frontend (`client/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `CLIENT_PORT` | Host port mapped to Nginx in Docker | `80` |
| `VITE_API_URL` | Base API endpoint for client requests | `http://localhost:3000/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID for SSO button | `your_google_client_id` |
| `VITE_SAWERIA_URL` | Support / donation link | `https://saweria.co/fermanferdaus` |
| `VITE_FEEDBACK_EMAIL` | Target email address for user feedback | `your_email@example.com` |
| `VITE_CONTACT_EMAIL` | Contact email address | `contact@resumix.app` |
| `VITE_CONTACT_GITHUB` | Developer GitHub profile URL | `https://github.com/fermanferdaus` |
| `VITE_CONTACT_INSTAGRAM` | Developer Instagram profile URL | `https://instagram.com/fermanferdaus_` |

---

## 6. API Endpoints Reference

### Health & Documentation
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check & database connection status | Public |
| `GET` | `/api/v1/docs` | Interactive Swagger OpenAPI documentation | Public |
| `GET` | `/api/v1/docs.json` | OpenAPI 3.0.0 JSON specification | Public |

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/check-email` | Verify email availability & registered status | Public |
| `POST` | `/api/v1/auth/send-otp` | Send 6-digit OTP code to user email | Public |
| `POST` | `/api/v1/auth/verify-otp` | Validate OTP code | Public |
| `POST` | `/api/v1/auth/register` | Register account with strong password & OTP | Public |
| `POST` | `/api/v1/auth/login` | Email & password login (sets Refresh Cookie) | Public |
| `POST` | `/api/v1/auth/google` | Google OAuth 2.0 credential sign-in | Public |
| `POST` | `/api/v1/auth/refresh-token` | Rotate refresh token & issue new access token | Public (Cookie) |
| `POST` | `/api/v1/auth/logout` | Revoke session & clear HttpOnly cookie | Public |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/api/v1/auth/reset-password` | Reset password using verified token | Public |
| `GET` | `/api/v1/auth/me` | Fetch currently authenticated user session | Bearer JWT |

### User Profile (`/api/v1/users`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/profile` | Get full user profile data | Bearer JWT |
| `PUT` | `/api/v1/users/profile` | Update profile information | Bearer JWT |
| `POST` | `/api/v1/users/avatar` | Upload & compress profile avatar image | Bearer JWT |
| `DELETE` | `/api/v1/users/avatar` | Remove avatar image & reset to default | Bearer JWT |

### Resumes (`/api/v1/resumes`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/resumes` | List user resumes with pagination | Bearer JWT |
| `POST` | `/api/v1/resumes` | Create new resume (enforces max 5 quota) | Bearer JWT |
| `GET` | `/api/v1/resumes/:id` | Get resume details by public UUIDv7 | Bearer JWT |
| `PUT` | `/api/v1/resumes/:id` | Update resume title & ATS content | Bearer JWT |
| `POST` | `/api/v1/resumes/:id/duplicate` | Clone existing resume within quota limit | Bearer JWT |
| `DELETE` | `/api/v1/resumes/:id` | Delete resume | Bearer JWT |

---

## 7. Testing & Code Quality

### Backend Tests
```bash
cd server
npm test            # Run unit tests (node:test: Bcrypt, JWT, UUIDv7, Zod)
npm run test:api    # Run end-to-end HTTP integration test suite
npm run lint        # Check ESLint rules
```

### Frontend Tests & Build
```bash
cd client
npm test            # Run client-side unit tests
npm run lint        # Check ESLint rules
npm run build       # Verify production bundle build
```

### Continuous Integration (CI)
GitHub Actions workflow configured at `.github/workflows/ci.yml` runs automated checks on every push and pull request:
* **Backend Pipeline**: PostgreSQL 16 service container, Prisma push, ESLint check, unit tests, and integration test suite.
* **Frontend Pipeline**: ESLint check, client unit tests, and production Vite build validation.

---

## 8. License

This project is private and proprietary. Developed with ❤️ by Ferman Ferdaus.

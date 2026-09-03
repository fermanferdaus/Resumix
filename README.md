# Resumix - ATS CV Builder

A full-stack web application designed to create and manage professional, ATS-friendly curriculum vitae (CV) with high security, dual-ID protection (UUIDv7), and streamlined authentication workflows.

---

## 1. Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Monorepo Structure** | `client/` (Frontend SPA) + `server/` (Stateless REST API) |
| **Backend** | Node.js, Express 5, Prisma ORM, PostgreSQL |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Zustand, TanStack Query |
| **Authentication** | Dual-Token JWT (Short-lived Access + HttpOnly Refresh Token), OTP 6-Digit Verification, Google OAuth 2.0 SSO |
| **UI Components** | Modern Flat Design System, Shadcn/UI Patterns, Lucide React Icons |
| **Validation** | Zod (End-to-End Type & Schema Validation on Frontend and Backend) |
| **Documentation** | Swagger UI (OpenAPI 3.0.0 Specification) |

---

## 2. Directory Structure

```text
cv_ats_builder/
├── client/                     # Frontend Application (React 19 + Vite 8)
│   ├── public/                 # Static assets (favicon, logo.png)
│   ├── src/
│   │   ├── api/                # Axios client & API endpoints
│   │   ├── components/         # Layout & Shadcn/UI components
│   │   ├── hooks/              # TanStack Query mutations & hooks
│   │   ├── pages/              # Auth & Dashboard views
│   │   ├── store/              # Zustand global state (AuthStore)
│   │   ├── tests/              # Frontend unit tests
│   │   └── validators/         # Zod client validation schemas
│   ├── .env.example            # Client environment blueprint
│   └── package.json
│
├── server/                     # Backend API (Express 5 + Prisma ORM)
│   ├── assets/                 # Server-side assets (email embedded logo.png)
│   ├── config/                 # Config abstraction layer
│   ├── controllers/            # Request handlers
│   ├── middlewares/            # Auth, validation, & error handling
│   ├── prisma/                 # Prisma schema & PostgreSQL definitions
│   ├── routes/                 # Express API routes
│   ├── services/               # Core business logic layer
│   ├── tests/                  # Unit & Integration test suites
│   │   ├── integration/        # End-to-end API HTTP test suite
│   │   └── unit/               # Bcrypt, JWT, UUIDv7, Zod validator tests
│   ├── validators/             # Zod server validation schemas
│   ├── .env.example            # Server environment blueprint
│   └── package.json
│
└── README.md                   # Monorepo documentation
```

---

## 3. Quick Start Guide

### Prerequisites
* **Node.js**: v20.x or later
* **PostgreSQL**: v15.x or later
* **SMTP Provider**: Mailtrap (recommended for development) or Gmail SMTP

---

### Step 1: Backend Setup

1. Masuk ke direktori server:
   ```bash
   cd server
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Siapkan file environment:
   ```bash
   cp .env.example .env
   ```
   *Sesuaikan kredensial PostgreSQL (`DATABASE_URL`), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, dan SMTP Mailtrap.*

4. Sinkronisasi skema database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Jalankan server backend:
   ```bash
   npm run dev
   ```
   * Server aktif di: `http://localhost:3000`
   * Dokumentasi Swagger OpenAPI: `http://localhost:3000/api/v1/docs`

---

### Step 2: Frontend Setup

1. Buka terminal baru dan masuk ke direktori client:
   ```bash
   cd client
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Siapkan file environment:
   ```bash
   cp .env.example .env
   ```
   *Pastikan `VITE_API_URL=http://localhost:3000/api/v1` dan `VITE_GOOGLE_CLIENT_ID` sudah terisi.*

4. Jalankan frontend development server:
   ```bash
   npm run dev
   ```
   * Aplikasi web aktif di: `http://localhost:5173`

---

## 4. Testing & Code Quality

### Backend Tests
```bash
cd server
npm test            # Unit Tests (node:test runner: Bcrypt, JWT, UUIDv7, Zod)
npm run test:api    # End-to-End API Integration Test Suite
npm run lint        # ESLint flat configuration check
```

### Frontend Tests & Build
```bash
cd client
npm test            # Unit Tests (Zod client schemas & UI utility)
npm run lint        # ESLint validation
npm run build       # Production bundle verification
```

### GitHub Actions CI Workflow
Pipeline otomatis telah dikonfigurasi pada [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml) yang berjalan otomatis pada setiap `push` dan `pull_request`:
* **`backend-ci`**: Service container PostgreSQL 16, linting ESLint, migrasi skema Prisma, unit tests, dan pengujian integrasi API.
* **`frontend-ci`**: Linting ESLint, unit tests, dan verifikasi production build Vite.

---

## 5. Security & Architectural Standards

* **Config Abstraction**: Logic dilarang memanggil `process.env` atau `import.meta.env` secara langsung; semua konfigurasi diakses via `config/` dan modul terpusat.
* **Dual-ID Protection**: Data pengguna dilindungi secara internal dengan Primary Key integer auto-increment dan diekspos ke publik menggunakan **UUIDv7** (time-sortable opaque identifier).
* **Token Rotation**: Refresh token disimpan dalam database dan dikirim via cookie `HttpOnly` untuk mencegah serangan XSS.
* **Strong Password Policy**: Wajib minimal 8 karakter, 1 huruf besar (A-Z), 1 angka (0-9), dan 1 simbol spesial.

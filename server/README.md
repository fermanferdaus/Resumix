# Resumix Backend API

Stateless REST API backend for Resumix ATS CV Builder, built with Express 5, Prisma ORM, PostgreSQL, and strict dual-token JWT authentication.

---

## 1. Architecture & Core Modules

```text
server/
├── assets/                  # Embedded assets for email templates (logo.png)
├── config/                  # Configuration abstraction layer
│   ├── app.js               # App, security, CORS, & mail settings
│   ├── db.js                # PostgreSQL connection pool
│   └── prisma.js            # Prisma Client singleton
├── controllers/             # Request handling and response formatting
│   └── authController.js    # Authentication & password endpoints
├── middlewares/             # HTTP middlewares
│   ├── authMiddleware.js    # JWT Bearer token authentication guard
│   ├── errorMiddleware.js   # 404 and global exception handlers
│   └── validateMiddleware.js# Zod schema request validation middleware
├── prisma/                  # Database definitions
│   └── schema.prisma        # PostgreSQL models (User, Otp, RefreshToken, PasswordReset)
├── routes/                  # Express routing modules
│   └── authRoutes.js        # Auth endpoint declarations
├── services/                # Business logic layer
│   ├── authService.js       # Core authentication & password reset business logic
│   ├── googleAuthService.js # Google OAuth SSO verification
│   ├── mailService.js       # Nodemailer HTML templates with embedded CID logo
│   └── otpService.js        # OTP creation, expiration, & verification logic
├── tests/                   # Test suites
│   ├── integration/         # HTTP integration tests (api.test.js)
│   └── unit/                # Unit tests (Bcrypt, JWT, UUIDv7, Zod)
├── utils/                   # Shared utility helpers
│   ├── hash.js              # Bcrypt password hashing
│   ├── id.js                # UUIDv7 public ID generator
│   ├── jwt.js               # JWT signing & verification helpers
│   └── response.js          # Standardized JSON response helpers
└── validators/              # Server-side Zod validation schemas
```

---

## 2. Environment Variables

Pastikan file `.env` sudah dikonfigurasi berdasarkan `.env.example`:

| Variabel | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- |
| `PORT` | Port server Express | `3000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `CLIENT_URL` | URL frontend untuk CORS & Reset Link | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://postgres:password@localhost:5432/cv_ats_builder` |
| `JWT_ACCESS_SECRET` | Secret key Access Token | `your_access_secret_key` |
| `JWT_ACCESS_EXPIRES_IN` | Durasi masa berlaku Access Token | `15m` |
| `JWT_REFRESH_SECRET` | Secret key Refresh Token | `your_refresh_secret_key` |
| `JWT_REFRESH_EXPIRES_IN`| Durasi masa berlaku Refresh Token | `7d` |
| `MAIL_HOST` | Host SMTP Server (e.g. Mailtrap) | `sandbox.smtp.mailtrap.io` |
| `MAIL_PORT` | Port SMTP Server | `2525` |
| `MAIL_USER` | Username SMTP | `mailtrap_username` |
| `MAIL_PASS` | Password SMTP | `mailtrap_password` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id.apps.googleusercontent.com` |

---

## 3. Database & Prisma Commands

Sinkronisasi skema ke PostgreSQL:
```bash
# Push skema schema.prisma ke database PostgreSQL
npx prisma db push

# Generate Prisma Client (Wajib dijalankan saat skema berubah)
npx prisma generate
```

---

## 4. API Endpoints Reference

| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health Check server & DB | Publik |
| `GET` | `/api/v1/docs` | Dokumentasi Swagger UI Interactive | Publik |
| `GET` | `/api/v1/docs.json` | OpenAPI 3.0.0 JSON Specification | Publik |
| `POST` | `/api/v1/auth/check-email` | Cek ketersediaan email | Publik |
| `POST` | `/api/v1/auth/send-otp` | Kirim kode OTP 6-digit ke email | Publik |
| `POST` | `/api/v1/auth/verify-otp` | Verifikasi OTP & aktivasi sesi | Publik |
| `POST` | `/api/v1/auth/register` | Pendaftaran akun baru (trigger OTP) | Publik |
| `POST` | `/api/v1/auth/login` | Masuk menggunakan email & kata sandi | Publik |
| `POST` | `/api/v1/auth/google` | Masuk via Google OAuth SSO | Publik |
| `POST` | `/api/v1/auth/refresh-token`| Rotasi Refresh Token & perbarui Access Token | Publik (Cookie) |
| `POST` | `/api/v1/auth/logout` | Revoke sesi aktif & hapus cookie | Publik |
| `POST` | `/api/v1/auth/forgot-password`| Minta tautan reset kata sandi via email | Publik |
| `POST` | `/api/v1/auth/reset-password` | Simpan kata sandi baru menggunakan token | Publik |
| `GET` | `/api/v1/auth/me` | Ambil data profil pengguna aktif | Private (Bearer JWT) |

---

## 5. Scripts

```bash
# Menjalankan server development dengan nodemon
npm run dev

# Menjalankan unit tests
npm test

# Menjalankan pengujian integrasi API end-to-end
npm run test:api

# Menjalankan pengecekan ESLint
npm run lint

# Menjalankan production server
npm start
```

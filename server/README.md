# Resumix Backend API

Stateless REST API backend for Resumix ATS CV Builder, built with Express 5, Prisma ORM, PostgreSQL, and strict dual-token JWT authentication with dual-environment Docker deployment parity.

---

## 1. Architecture & Core Modules

```text
server/
├── assets/                  # Embedded assets for email templates (logo.png)
├── config/                  # Configuration abstraction layer
│   ├── app.js               # App, security, CORS, & mail settings
│   ├── db.js                # PostgreSQL connection pool
│   ├── prisma.js            # Prisma Client singleton
│   └── swagger.js           # Swagger OpenAPI specification generator
├── controllers/             # Request handling and response formatting
│   ├── authController.js    # Authentication & password endpoints
│   ├── resumeController.js  # Resume CRUD & quota management endpoints
│   └── userController.js    # Profile & avatar management endpoints
├── middlewares/             # HTTP middlewares
│   ├── authMiddleware.js    # JWT Bearer token authentication guard
│   ├── errorMiddleware.js   # 404 and global exception handlers
│   └── validateMiddleware.js# Zod schema request validation middleware
├── prisma/                  # Database definitions
│   └── schema.prisma        # PostgreSQL models (User, Otp, RefreshToken, PasswordReset, Resume)
├── public/uploads/          # Uploaded avatar images (mounted to Docker volume)
├── routes/                  # Express routing modules
│   ├── authRoutes.js        # Auth endpoint declarations
│   ├── index.js             # Route aggregator & /health endpoint
│   ├── resumeRoutes.js      # Resume endpoint declarations
│   └── userRoutes.js        # Profile & avatar endpoint declarations
├── services/                # Business logic layer
│   ├── authService.js       # Core authentication & password reset business logic
│   ├── googleAuthService.js # Google OAuth SSO verification
│   ├── mailService.js       # Nodemailer HTML templates (OTP 6-box & reset password)
│   ├── otpService.js        # OTP creation, expiration, & verification logic
│   ├── resumeService.js     # Resume CRUD, quota check (max 5), & duplication logic
│   └── userService.js       # Profile management & Sharp avatar compression logic
├── tests/                   # Test suites
│   ├── integration/         # HTTP integration tests (api.test.js)
│   └── unit/                # Unit tests (Bcrypt, JWT, UUIDv7, Zod)
├── utils/                   # Shared utility helpers
│   ├── hash.js              # Bcrypt password hashing
│   ├── id.js                # UUIDv7 public ID generator
│   ├── jwt.js               # JWT signing & verification helpers
│   └── response.js          # Standardized JSON response helpers
├── validators/              # Server-side Zod validation schemas
│   ├── authValidator.js     # Auth request schemas
│   ├── resumeValidator.js   # Resume request schemas
│   └── userValidator.js     # Profile & avatar request schemas
├── Dockerfile               # Multi-stage Alpine musl Docker build
├── entrypoint.sh            # Container startup & permission fix script
└── package.json
```

---

## 2. Environment Variables

Pastikan file `.env` sudah dikonfigurasi berdasarkan `.env.example`:

| Variabel | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- |
| `PORT` | Port server Express | `3000` |
| `SERVER_PORT` | Port host dalam Docker | `3000` |
| `APP_VERSION` | Versi rilis container | `1.0` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `APP_URL` | Base URL backend server | `http://localhost:3000` |
| `CLIENT_URL` | URL frontend untuk CORS & Reset Link | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://postgres:password@localhost:5432/resumix?schema=public` |
| `JWT_ACCESS_SECRET` | Secret key Access Token | `your_access_secret_key` |
| `JWT_ACCESS_EXPIRES_IN` | Durasi masa berlaku Access Token | `15m` |
| `JWT_REFRESH_SECRET` | Secret key Refresh Token | `your_refresh_secret_key` |
| `JWT_REFRESH_EXPIRES_IN`| Durasi masa berlaku Refresh Token | `12h` |
| `OTP_EXPIRES_MINUTES` | Durasi berlaku kode OTP (menit) | `5` |
| `SMTP_HOST` | Host SMTP Server (e.g. Mailtrap / Gmail) | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | Port SMTP Server | `587` / `2525` |
| `SMTP_SECURE` | Flag koneksi SSL/TLS | `false` |
| `SMTP_USER` | Username SMTP | `smtp_username` |
| `SMTP_PASS` | Password SMTP | `smtp_password` |
| `MAIL_FROM_ADDRESS` | Alamat pengirim email | `noreply@resumix.app` |
| `MAIL_FROM_NAME` | Nama pengirim email | `"Resumix No-Reply"` |
| `MAIL_REPLY_TO` | Alamat Reply-To | `noreply@resumix.app` |
| `MAIL_LOGO_URL` | URL publik logo untuk email HTML | `https://resumix.app/logo.png` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your_google_client_secret` |

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

### Health & Docs
| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health Check server & DB status | Publik |
| `GET` | `/api/v1/docs` | Dokumentasi Swagger UI Interactive | Publik |
| `GET` | `/api/v1/docs.json` | OpenAPI 3.0.0 JSON Specification | Publik |

### Autentikasi (`/api/v1/auth`)
| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/check-email` | Cek ketersediaan email | Publik |
| `POST` | `/api/v1/auth/send-otp` | Kirim kode OTP 6-digit ke email | Publik |
| `POST` | `/api/v1/auth/verify-otp` | Verifikasi OTP & aktivasi sesi | Publik |
| `POST` | `/api/v1/auth/register` | Pendaftaran akun baru | Publik |
| `POST` | `/api/v1/auth/login` | Masuk menggunakan email & kata sandi | Publik |
| `POST` | `/api/v1/auth/google` | Masuk via Google OAuth SSO | Publik |
| `POST` | `/api/v1/auth/refresh-token`| Rotasi Refresh Token & perbarui Access Token | Publik (Cookie) |
| `POST` | `/api/v1/auth/logout` | Revoke sesi aktif & hapus cookie | Publik |
| `POST` | `/api/v1/auth/forgot-password`| Minta tautan reset kata sandi via email | Publik |
| `POST` | `/api/v1/auth/reset-password` | Simpan kata sandi baru menggunakan token | Publik |
| `GET` | `/api/v1/auth/me` | Ambil data sesi pengguna aktif | Private (Bearer JWT) |

### Profil Pengguna (`/api/v1/users`)
| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/profile` | Ambil data profil lengkap | Private (Bearer JWT) |
| `PUT` | `/api/v1/users/profile` | Perbarui biodata profil | Private (Bearer JWT) |
| `POST` | `/api/v1/users/avatar` | Unggah & kompres foto profil (WebP/Sharp) | Private (Bearer JWT) |
| `DELETE` | `/api/v1/users/avatar` | Hapus foto profil & kembalikan default | Private (Bearer JWT) |

### Resume ATS (`/api/v1/resumes`)
| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/resumes` | Ambil daftar resume pengguna (pagination) | Private (Bearer JWT) |
| `POST` | `/api/v1/resumes` | Buat resume baru (batas kuota 5) | Private (Bearer JWT) |
| `GET` | `/api/v1/resumes/:id` | Ambil detail resume berdasarkan UUIDv7 | Private (Bearer JWT) |
| `PUT` | `/api/v1/resumes/:id` | Perbarui judul & konten ATS resume | Private (Bearer JWT) |
| `POST` | `/api/v1/resumes/:id/duplicate` | Gandakan resume yang sudah ada | Private (Bearer JWT) |
| `DELETE` | `/api/v1/resumes/:id` | Hapus resume | Private (Bearer JWT) |

---

## 5. Scripts

```bash
# Menjalankan server development dengan nodemon
npm run dev

# Menjalankan unit tests (Bcrypt, JWT, UUIDv7, Zod)
npm test

# Menjalankan pengujian integrasi API end-to-end
npm run test:api

# Menjalankan pengecekan ESLint
npm run lint

# Menjalankan production server
npm start
```

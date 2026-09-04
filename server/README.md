# Resumix Backend API

Stateless REST API for the Resumix ATS resume builder, built with Express 5, Prisma ORM, and PostgreSQL.

## Architecture & Modules

```text
server/
├── assets/                  # Assets for email templates (logo.png)
├── config/                  # Configuration abstraction layer
│   ├── app.js               # Application, CORS, security, and mail settings
│   ├── prisma.js            # Prisma Client singleton
│   └── swagger.js           # OpenAPI documentation config
├── controllers/             # HTTP request handlers
│   ├── adminController.js   # Admin analytics, user management, and 2FA settings
│   ├── authController.js    # Authentication and session handlers
│   ├── resumeController.js  # Resume CRUD and duplicate handlers
│   └── userController.js    # User profile and avatar handlers
├── middlewares/             # Express middlewares
│   ├── authMiddleware.js    # JWT Bearer token authentication guard
│   ├── errorMiddleware.js   # Global exception and 404 handlers
│   ├── rateLimitMiddleware.js# Endpoint-level and global rate limiters
│   ├── roleMiddleware.js    # RBAC role enforcement (requireAdmin)
│   └── validateMiddleware.js# Zod request validation middleware
├── prisma/                  # Database definitions
│   ├── schema.prisma        # PostgreSQL data schema
│   └── seed.js              # Initial admin user seeder
├── public/uploads/          # Local storage for avatars
├── routes/                  # Express route definitions
│   ├── adminRoutes.js       # Admin panel and 2FA route mapping
│   ├── authRoutes.js        # Auth route mapping
│   ├── index.js             # Route aggregator and health check
│   ├── resumeRoutes.js      # Resume route mapping
│   └── userRoutes.js        # Profile route mapping
├── services/                # Business logic layer
│   ├── adminService.js      # Admin telemetry, users, anomalies, and logs
│   ├── authService.js       # Authentication and token rotation
│   ├── geoService.js        # IP geolocation resolution
│   ├── googleAuthService.js # Google OAuth verification
│   ├── mailService.js       # Transactional email templates
│   ├── otpService.js        # OTP lifecycle and attempt limits
│   ├── resumeService.js     # Resume data processing and quota checks
│   ├── totpService.js       # RFC 6238 TOTP and backup code engine
│   └── userService.js       # Profile management and Sharp image processing
├── tests/                   # Test suites
│   ├── integration/         # HTTP integration tests
│   └── unit/                # Unit tests (auth, resume, admin, totp)
├── utils/                   # Cryptography, JWT, UUID, and response helpers
├── validators/              # Zod request schemas
├── Dockerfile               # Multi-stage container build
├── entrypoint.sh            # Container initialization script
└── package.json
```

## Environment Variables

Configure `server/.env` based on `server/.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `3000` |
| `SERVER_PORT` | Host port mapped to container in Docker | `3000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `APP_URL` | Base URL of backend service | `http://localhost:3000` |
| `CLIENT_URL` | Frontend origin for CORS and email links | `http://localhost:5173` |
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | - |
| `POSTGRES_DB` | PostgreSQL database name | `resumix` |
| `DATABASE_URL` | Prisma PostgreSQL connection string | - |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | - |
| `JWT_ACCESS_EXPIRES_IN` | Lifetime of access tokens | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | - |
| `JWT_REFRESH_EXPIRES_IN`| Lifetime of refresh tokens | `12h` |
| `OTP_EXPIRES_MINUTES` | OTP code lifetime in minutes | `5` |
| `SMTP_HOST` | SMTP server host | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Enable TLS/SSL connection | `false` |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |
| `MAIL_FROM_ADDRESS` | Sender email address | `noreply@resumix.app` |
| `MAIL_FROM_NAME` | Sender display name | `"Resumix No-Reply"` |
| `MAIL_REPLY_TO` | Reply-To address | `noreply@resumix.app` |
| `MAIL_LOGO_URL` | Hosted logo URL for transactional email header | `http://localhost:5173/logo.png` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | - |
| `ENABLE_AUTH_MOCK` | Enable local authentication mock | `false` |
| `ADMIN_SEED_NAME` | Initial admin account display name | `"Name of Admin"` |
| `ADMIN_SEED_EMAIL` | Initial admin account login email | - |
| `ADMIN_SEED_PASSWORD` | Initial admin account login password | - |

## Database Operations

```bash
# Push schema directly to the database
npx prisma db push

# Generate Prisma Client after schema changes
npx prisma generate

# Seed initial administrator account (reads ADMIN_SEED_* from .env)
npm run prisma:seed
```

## API Documentation

When running in `development`, interactive OpenAPI 3.0 documentation is available at `/api/v1/docs`. The raw JSON specification is accessible at `/api/v1/docs.json`. Swagger UI is disabled in `production` mode.

## Scripts

```bash
# Start development server with file watching
npm run dev

# Run unit tests
npm test

# Run API integration tests
npm run test:api

# Run ESLint check
npm run lint

# Seed initial administrator
npm run prisma:seed

# Start production server
npm start
```

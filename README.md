# Resumix

Resumix is an ATS-compliant resume builder application built with React, Express, PostgreSQL, and Prisma.

## Architecture & Tech Stack

| Layer | Technologies | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 | SPA using Zustand for state and TanStack Query for data fetching |
| **Backend** | Node.js, Express 5, Prisma ORM | Stateless REST API adhering to Service Layer architecture |
| **Database** | PostgreSQL 15 | Relational data model using internal BigInt PK and public UUIDv7 |
| **Authentication** | JWT, Refresh Token, Google OAuth 2.0, RFC 6238 TOTP | Dual-token authentication with HttpOnly cookies, Google Authenticator 2FA, and OTP email verification |
| **Deployment** | Docker, Docker Compose, Nginx | Multi-stage Docker builds with Nginx reverse proxy |
| **Validation** | Zod | End-to-end schema validation on client forms and backend requests |
| **Security** | Helmet, Express Rate Limit, Sharp, RBAC | Role-based route protection (`ADMIN`/`USER`), rate limiting, security headers, WebP conversion, and session revocation |

## Features

### ATS Resume Management
- Resume creation, duplication, and deletion with a quota limit of 5 resumes per account
- Dynamic resume sections: personal details, summary, work experience, education, skills, organizations, and certifications
- Real-time preview formatted for Applicant Tracking Systems (ATS)

### Authentication & Account Security
- Dual-token session: 15-minute in-memory access token with 12-hour HttpOnly refresh cookie
- Refresh Token Rotation (RTR) with reuse detection and automatic session revocation
- Google OAuth 2.0 integration
- Two-Factor Authentication (2FA) via RFC 6238 TOTP (Google Authenticator) and hashed single-use backup codes
- Email verification via 6-digit numeric OTP with rate limiting and brute-force lockout
- Password reset flow via time-limited signed email tokens

### Admin Monitoring & System Telemetry
- Real-time KPI overview: registered users, verified accounts, active sessions, total resumes, and storage utilization
- Geographic telemetry resolving user distributions via IP lookup
- User directory with debounced search, database indexing, status filters, and configurable pagination (10, 25, 50, 100, 500)
- Anomaly detection flagging high resume generation rate, failed login spikes, and dormant accounts
- System audit log inspection with date range filtering and WIB (UTC+7) timestamps
- Dedicated administrative route guard (`AdminProtectedRoute`) restricting access to `ADMIN` role

### Profile & Media Processing
- Profile management: personal bio, contact data, and domicile
- Avatar image upload with file size validation, Sharp compression, WebP conversion, and automatic cleanup of previous files

### Transactional Emails
- Branded notification templates for account verification and password recovery
- Configurable SMTP transports supporting standard mail relays

## Directory Structure

```text
resumix/
├── client/                     # Frontend Application (React 19 + Vite 8)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios client and API services (auth, resume, user, admin)
│   │   ├── components/         # UI components
│   │   │   ├── admin/          # Admin dashboard tabs, metrics, and security controls
│   │   │   ├── common/         # Route guards (ProtectedRoute, AdminProtectedRoute)
│   │   │   ├── ui/             # Reusable UI primitives (badge, card, table, skeleton)
│   │   │   └── ...
│   │   ├── config/             # Client configuration abstraction
│   │   ├── hooks/              # Query and mutation hooks
│   │   ├── lib/                # Utility helpers (cn, date formatting)
│   │   ├── pages/              # Route views (auth, dashboard, editor, admin)
│   │   ├── store/              # Zustand authentication store
│   │   ├── tests/              # Frontend unit tests
│   │   └── validators/         # Zod schemas
│   ├── Dockerfile              # Client Docker container
│   ├── nginx.conf              # Reverse proxy and SPA routing
│   └── package.json
│
├── server/                     # Backend API (Express 5 + Prisma)
│   ├── config/                 # App and database configuration
│   ├── controllers/            # HTTP request handlers (auth, user, resume, admin)
│   ├── middlewares/            # Auth guards, role guards, rate limiters, validation
│   ├── prisma/                 # Database schema, migrations, and seed script
│   ├── public/uploads/         # Uploaded avatars
│   ├── routes/                 # Express route definitions (auth, user, resume, admin)
│   ├── services/               # Business logic layer (auth, resume, admin, geo, totp)
│   ├── tests/                  # Unit and integration tests
│   ├── utils/                  # Cryptography, tokens, and response utilities
│   ├── validators/             # Request payload schemas
│   ├── Dockerfile              # Backend container
│   ├── entrypoint.sh           # Container entrypoint
│   └── package.json
│
├── scripts/
│   └── docker-build.js         # Docker build and version automation
├── docker-compose.yml          # Full-stack production orchestration
├── docker-compose.db.yml       # Standalone PostgreSQL for development
├── package.json                # Monorepo orchestration scripts
└── README.md                   # Monorepo documentation
```

## Getting Started

### Prerequisites
- Node.js 20.x or later
- PostgreSQL 15.x or later (or via Docker)
- Docker and Docker Compose (for containerized setup)

### Native Development Setup

1. **Start the database** (using standalone compose or local PostgreSQL):
   ```bash
   docker compose -f docker-compose.db.yml up -d
   ```

2. **Configure and start the backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and SMTP credentials in `server/.env`.
   
   Apply database schema, seed initial admin user, and start the server:
   ```bash
   npx prisma db push
   npx prisma generate
   npm run prisma:seed
   npm run dev
   ```
   The backend runs at `http://localhost:3000`.

3. **Configure and start the frontend**:
   ```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
   ```
   The frontend runs at `http://localhost:5173`.

### Docker Deployment

To build and run all services with automated versioning:

```bash
# Build container images
npm run docker:build

# Launch containers in background
npm run docker:up

# Stop all services
npm run docker:down
```

The application will be accessible through the Nginx reverse proxy at `http://localhost:80`.

## Environment Variables

### Backend (`server/.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | Express listening port (default: `3000`) |
| `SERVER_PORT` | Host port mapped to backend in Docker (default: `3000`) |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `APP_URL` | Base URL of the backend service |
| `CLIENT_URL` | Frontend origin for CORS and email links |
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | PostgreSQL database name |
| `DATABASE_URL` | Prisma connection string |
| `JWT_ACCESS_SECRET` | Secret key for signing access tokens |
| `JWT_ACCESS_EXPIRES_IN`| Lifetime of access tokens (e.g., `15m`) |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `JWT_REFRESH_EXPIRES_IN`| Lifetime of refresh tokens (e.g., `12h`) |
| `OTP_EXPIRES_MINUTES` | Lifetime of OTP verification codes (default: `5`) |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (e.g., `587` or `2525`) |
| `SMTP_SECURE` | Enable TLS/SSL connection (`true` or `false`) |
| `SMTP_USER` | SMTP authentication username |
| `SMTP_PASS` | SMTP authentication password |
| `MAIL_FROM_ADDRESS` | Sender email address |
| `MAIL_FROM_NAME` | Sender display name |
| `MAIL_REPLY_TO` | Reply-To email address |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client identifier |
| `GOOGLE_CLIENT_SECRET`| Google OAuth 2.0 client secret |
| `ENABLE_AUTH_MOCK` | Enable authentication mock for local testing (`true` or `false`) |
| `MAIL_LOGO_URL` | Hosted logo image URL for email templates |
| `ADMIN_SEED_NAME` | Initial administrator display name for database seeder |
| `ADMIN_SEED_EMAIL` | Initial administrator email for database seeder |
| `ADMIN_SEED_PASSWORD` | Initial administrator password for database seeder |

### Frontend (`client/.env`)

| Variable | Description |
| :--- | :--- |
| `CLIENT_PORT` | Host port mapped to Nginx in Docker (default: `80`) |
| `VITE_API_URL` | Backend API base URL for client requests |
| `VITE_GOOGLE_CLIENT_ID`| Google OAuth 2.0 client identifier for the web client |
| `VITE_FEEDBACK_EMAIL` | Destination email for user feedback |
| `VITE_CONTACT_EMAIL` | Contact email displayed on the landing page |
| `VITE_CONTACT_GITHUB` | Developer GitHub profile URL |
| `VITE_CONTACT_INSTAGRAM`| Developer Instagram profile URL |

## Quality & Testing

### Backend Tests
```bash
cd server
npm test            # Run unit test suite
npm run lint        # Run ESLint analysis
```

### Frontend Tests
```bash
cd client
npm test            # Run frontend test suite
npm run lint        # Run ESLint analysis
npm run build       # Verify production bundle build
```

### Continuous Integration
GitHub Actions runs automated test and build workflows on all pushes to `main` and `develop` branches:
- Backend workflow executes Prisma schema synchronization, ESLint, and unit test suites.
- Frontend workflow executes ESLint, client unit test suites, and production build checks.


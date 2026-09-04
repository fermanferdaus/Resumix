# Resumix Frontend Client

Frontend Single Page Application (SPA) for Resumix ATS CV Builder, built with React 19, Vite 8, Tailwind CSS v4, Zustand, TanStack Query, and Shadcn/UI patterns.

---

## 1. Architecture & Folder Structure

```text
client/
├── public/                  # Static assets (logo.png, favicon)
├── src/
│   ├── api/                 # Axios configuration & API client services
│   │   ├── authApi.js       # Auth endpoint methods (login, OTP, logout, Google, password)
│   │   ├── axios.js         # Base Axios instance with automatic token interceptors
│   │   ├── resumeApi.js     # Resume CRUD & duplicate endpoints
│   │   └── userApi.js       # Profile & avatar upload endpoints
│   ├── components/          # Reusable UI component library
│   │   ├── common/          # Shared components (GoogleAuthButton, ProtectedRoute, ErrorBoundary)
│   │   ├── dashboard/       # Dashboard widgets (ResumeCard, CreateResumeModal, QuotaBanner)
│   │   ├── editor/          # ATS CV Editor sections (PersonalInfo, Experience, Education, Skills, Preview)
│   │   ├── landing/         # Landing page hero, features, and footer sections
│   │   ├── layout/          # Layout wrappers (AuthLayout, Navbar)
│   │   ├── profile/         # Profile form, AvatarUpload, and ProfileSkeleton
│   │   └── ui/              # Shadcn/UI primitives (Button, Input, Label, Alert, OtpInput, Skeleton)
│   ├── config/              # Centralized client configuration
│   │   └── appConfig.js     # App URLs, Google OAuth Client ID, and social links
│   ├── hooks/               # Custom TanStack Query mutations & hooks
│   │   ├── useAuthMutations.js
│   │   ├── useResumeMutations.js
│   │   └── useProfileMutations.js
│   ├── lib/                 # Shared utilities
│   │   └── utils.js         # clsx & tailwind-merge helper (`cn`)
│   ├── pages/               # Application view routes
│   │   ├── auth/            # LoginPage, RegisterPage, OtpVerifyPage, ForgotPasswordPage, ResetPasswordPage
│   │   ├── dashboard/       # DashboardPage
│   │   ├── editor/          # EditorPage (ATS Resume Editor & Live Preview)
│   │   ├── error/           # NotFoundPage (404), ServerErrorPage (500)
│   │   ├── landing/         # LandingPage
│   │   └── profile/         # ProfilePage
│   ├── store/               # Zustand state stores
│   │   └── authStore.js     # User session, tokens, & temp auth state
│   ├── tests/               # Frontend unit tests
│   ├── validators/          # Zod validation schemas
│   ├── App.jsx              # Router tree & QueryClientProvider setup
│   ├── index.css            # Tailwind CSS v4 directives & custom theme
│   └── main.jsx             # React DOM root entrypoint
├── .env.example             # Frontend environment blueprint
├── Dockerfile               # Multi-stage production Nginx container build
├── nginx.conf               # Nginx reverse proxy (/api/v1/ & /uploads/) and SPA routing
├── eslint.config.js         # ESLint configuration
└── vite.config.js           # Vite 8 build & plugin configuration
```

---

## 2. Environment Variables

Salin `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

| Variabel | Deskripsi | Nilai Default |
| :--- | :--- | :--- |
| `CLIENT_PORT` | Port host Nginx dalam Docker | `80` |
| `VITE_API_URL` | Base URL Endpoint Backend API | `http://localhost:3000/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID untuk SSO | `your_google_client_id.apps.googleusercontent.com` |
| `VITE_SAWERIA_URL` | Tautan dukungan/donasi Saweria | `https://saweria.co/fermanferdaus` |
| `VITE_FEEDBACK_EMAIL` | Alamat email feedback pengguna | `feedback@resumix.app` |
| `VITE_CONTACT_EMAIL` | Alamat email kontak developer | `contact@resumix.app` |
| `VITE_CONTACT_GITHUB` | URL profil GitHub | `https://github.com/fermanferdaus` |
| `VITE_CONTACT_INSTAGRAM`| URL profil Instagram | `https://instagram.com/fermanferdaus_` |

---

## 3. UI Design System & Styling

* **Theme**: Resumix Modern Soft Flat Theme with dark backgrounds and emerald accents.
* **Typography**: IBM Plex Sans / Inter Clean Sans.
* **Component Kit**: Shadcn/UI component patterns with minimal footprint and zero bloat.
* **Route Protection**: `ProtectedRoute` protects `/dashboard`, `/profile`, `/editor/:id`, and redirects unauthenticated users directly to `/`.
* **State Management**: Zustand for immediate client session sync, TanStack Query for server data caching and mutations.

---

## 4. Scripts

```bash
# Menjalankan Vite development server dengan HMR
npm run dev

# Menjalankan unit tests frontend (Zod validation & utils)
npm test

# Menjalankan pengecekan ESLint
npm run lint

# Menjalankan bundle build untuk production
npm run build

# Menjalankan preview production build lokal
npm run preview
```

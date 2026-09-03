# Resumix Frontend Client

Frontend Single Page Application (SPA) for Resumix ATS CV Builder, built with React 19, Vite 8, Tailwind CSS v4, and Shadcn/UI patterns.

---

## 1. Architecture & Folder Structure

```text
client/
├── public/                  # Static assets (logo.png, favicon)
├── src/
│   ├── api/                 # Axios configuration & API client services
│   │   ├── authApi.js       # Auth endpoint methods
│   │   └── axios.js         # Base Axios instance with automatic token interceptors
│   ├── components/          # Reusable UI component library
│   │   ├── common/          # Shared components (GoogleAuthButton, ProtectedRoute)
│   │   ├── layout/          # Layout wrappers (AuthLayout, Navbar)
│   │   └── ui/              # Shadcn/UI primitives (Button, Input, Label, Alert, OtpInput)
│   ├── hooks/               # Custom React Query mutations & hooks
│   │   └── useAuthMutations.js
│   ├── lib/                 # Shared utilities
│   │   └── utils.js         # `cn` clsx & tailwind-merge helper
│   ├── pages/               # Application view routes
│   │   ├── auth/            # LoginPage, RegisterPage, OtpVerifyPage, ForgotPasswordPage, ResetPasswordPage
│   │   └── dashboard/       # DashboardPage
│   ├── store/               # Zustand state stores
│   │   └── authStore.js     # User session & temp auth state
│   ├── tests/               # Frontend unit tests
│   │   ├── authSchemas.test.js
│   │   └── utils.test.js
│   ├── validators/          # Zod validation schemas
│   │   └── authSchemas.js   # Client form schemas
│   ├── App.jsx              # Application router & QueryClientProvider
│   ├── index.css            # Tailwind CSS v4 directives & custom theme
│   └── main.jsx             # React DOM root entrypoint
├── .env.example             # Frontend environment blueprint
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
| `VITE_API_URL` | Base URL Endpoint Backend API | `http://localhost:3000/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID untuk tombol SSO | `your_google_client_id.apps.googleusercontent.com` |

---

## 3. UI Design System & Styling

* **Theme**: Resumix Modern Flat Theme (Primary Red `#af101a` / `#d32f2f`, solid borders, sharp modern layout).
* **Typography**: IBM Plex Sans / Clean System Sans.
* **Component Kit**: Shadcn/UI component patterns with zero external unneeded libraries.
* **Feedback System**: Inline `<Alert>` status banners (error, success, warning, info) with dismissible controls.

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

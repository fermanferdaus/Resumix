# Resumix Frontend Client

Single-page application (SPA) for the Resumix ATS resume builder, built with React 19, Vite 8, and Tailwind CSS v4.

## Architecture & Folder Structure

```text
client/
├── public/                  # Static assets
├── src/
│   ├── api/                 # Axios configuration and API service modules
│   │   ├── authApi.js       # Auth request services
│   │   ├── axios.js         # Axios instance with token interceptors and mutex
│   │   ├── resumeApi.js     # Resume CRUD and duplicate services
│   │   └── userApi.js       # Profile and avatar upload services
│   ├── components/          # Reusable UI component modules
│   │   ├── common/          # Error boundary, route guard, OAuth buttons
│   │   ├── dashboard/       # Dashboard cards, modals, and banners
│   │   ├── editor/          # ATS resume editor sections and preview
│   │   ├── landing/         # Landing page presentation components
│   │   ├── layout/          # Page layouts and navigation bar
│   │   ├── profile/         # Profile form, avatar upload, and skeleton
│   │   └── ui/              # Base UI primitives
│   ├── config/              # Centralized client configuration
│   │   └── appConfig.js     # Environment variable abstraction
│   ├── hooks/               # Custom TanStack Query hooks
│   ├── lib/                 # Utility helpers (cn class merger)
│   ├── pages/               # Application view routes
│   │   ├── auth/            # Auth pages (login, register, OTP, reset)
│   │   ├── dashboard/       # Dashboard overview
│   │   ├── editor/          # ATS resume builder and live preview
│   │   ├── error/           # Error pages (404, 500)
│   │   ├── landing/         # Marketing landing page
│   │   └── profile/         # User profile settings
│   ├── store/               # In-memory Zustand state stores
│   │   └── authStore.js     # Session and authentication store
│   ├── tests/               # Frontend unit tests
│   ├── validators/          # Client-side Zod validation schemas
│   ├── App.jsx              # Application router and boot refresh logic
│   ├── index.css            # Tailwind directives and theme variables
│   └── main.jsx             # React DOM entrypoint
├── Dockerfile               # Production multi-stage Nginx container build
├── nginx.conf               # Nginx reverse proxy and SPA routing config
├── eslint.config.js         # ESLint configuration
└── vite.config.js           # Vite build configuration
```

## Environment Variables

Configure `client/.env` based on `client/.env.example`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `CLIENT_PORT` | Host port mapped to Nginx in Docker | `80` |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Web Client ID | - |
| `VITE_SAWERIA_URL` | Donation link | `https://saweria.co/fermanferdaus` |
| `VITE_FEEDBACK_EMAIL` | User feedback email address | `feedback@resumix.app` |
| `VITE_CONTACT_EMAIL` | Contact email address | `contact@resumix.app` |
| `VITE_CONTACT_GITHUB` | Developer GitHub profile URL | `https://github.com/fermanferdaus` |
| `VITE_CONTACT_INSTAGRAM`| Developer Instagram profile URL | `https://instagram.com/fermanferdaus_` |

## Design System & State Management

- **Styling**: Tailwind CSS v4 using CSS theme variables and minimal component primitives.
- **State**: Zustand for in-memory session tokens and client state; TanStack Query for server state caching and request deduplication.
- **Route Guarding**: `ProtectedRoute` protects authenticated application routes (`/dashboard`, `/profile`, `/editor/:id`) and redirects unauthenticated users to `/`.

## Scripts

```bash
# Start Vite development server with HMR
npm run dev

# Run frontend unit tests
npm test

# Run ESLint check
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

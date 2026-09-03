import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "./store/authStore.js";
import { LoginPage } from "./pages/auth/LoginPage.jsx";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";
import { OtpVerifyPage } from "./pages/auth/OtpVerifyPage.jsx";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.jsx";
import { DashboardPage } from "./pages/dashboard/DashboardPage.jsx";
import { EditorPage } from "./pages/editor/EditorPage.jsx";
import { ProfilePage } from "./pages/profile/ProfilePage.jsx";
import { LandingPage } from "./pages/landing/LandingPage.jsx";
import { NotFoundPage } from "./pages/error/NotFoundPage.jsx";
import { ServerErrorPage } from "./pages/error/ServerErrorPage.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Root Route: Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Auth Routes */}
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
              />
              <Route path="/verify-otp" element={<OtpVerifyPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editor/:id" element={<EditorPage />} />
                <Route path="/templates" element={<Navigate to="/dashboard" replace />} />
                <Route path="/editor" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Explicit Server Error Route */}
              <Route path="/500" element={<ServerErrorPage />} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;

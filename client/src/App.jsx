import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";
import { appConfig } from "./config/appConfig.js";
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
import { AdminProtectedRoute } from "./components/common/AdminProtectedRoute.jsx";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const res = await axios.post(
          `${appConfig.apiUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        if (res.data?.success && res.data?.data?.accessToken) {
          const { accessToken, user } = res.data.data;
          useAuthStore.getState().setAuth(user, accessToken);
        } else {
          useAuthStore.getState().setLoading(false);
        }
      } catch {
        useAuthStore.getState().setLoading(false);
      }
    };
    silentRefresh();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={appConfig.googleClientId}>
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

              {/* Admin Protected Routes */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
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

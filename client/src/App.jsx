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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Root Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              }
            />

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
              <Route path="/editor/:id" element={<EditorPage />} />
              <Route path="/templates" element={<Navigate to="/dashboard" replace />} />
              <Route path="/editor" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleAuthButton } from "../../components/common/GoogleAuthButton.jsx";
import { AuthLayout } from "../../components/layout/AuthLayout.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { emailSchema, loginPasswordSchema } from "../../validators/authSchemas.js";
import { useLoginMutation, useSendOtpMutation, useGoogleAuthMutation } from "../../hooks/useAuthMutations.js";
import { Lock, Mail } from "lucide-react";

export const LoginPage = () => {
  const [loginMode, setLoginMode] = useState("otp"); // 'otp' atau 'password'
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const sendOtpMutation = useSendOtpMutation();
  const loginMutation = useLoginMutation();
  const googleAuthMutation = useGoogleAuthMutation();

  // Form untuk Mode OTP
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  // Form untuk Mode Kata Sandi
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: zodResolver(loginPasswordSchema),
  });

  const onSendOtp = async (data) => {
    setErrorMessage("");
    try {
      await sendOtpMutation.mutateAsync(data.email);
      navigate("/verify-otp");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal mengirim kode OTP. Silakan coba lagi."
      );
    }
  };

  const onPasswordLogin = async (data) => {
    setErrorMessage("");
    try {
      await loginMutation.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Alamat email atau kata sandi tidak sesuai."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage("");
    if (credentialResponse.credential) {
      try {
        await googleAuthMutation.mutateAsync(credentialResponse.credential);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Autentikasi Google gagal. Silakan coba lagi."
        );
      }
    }
  };

  return (
    <AuthLayout
      title="Masuk ke Akun"
      subtitle="Masuk ke ruang kerja karir Anda untuk mulai mengelola CV ATS."
      footerLink={
        <p>
          Belum memiliki akun?{" "}
          <Link
            to="/register"
            className="text-[#1a1b22] font-semibold underline underline-offset-4 hover:text-[#af101a] transition-colors"
          >
            Daftar Sekarang
          </Link>
        </p>
      }
    >
      {/* Alert Notifikasi Error di Atas Form */}
      {errorMessage && (
        <div className="mb-5">
          <Alert variant="error" onClose={() => setErrorMessage("")}>
            <span>{errorMessage} </span>
            {errorMessage.toLowerCase().includes("belum terdaftar") && (
              <Link
                to="/register"
                className="font-bold underline ml-1 text-[#93000a] hover:text-[#ba1a1a]"
              >
                Daftar sekarang
              </Link>
            )}
          </Alert>
        </div>
      )}

      {/* Pilihan Mode Masuk */}
      <div className="flex border border-[#e2e8f0] mb-6 bg-[#f8fafc] rounded-none">
        <button
          type="button"
          onClick={() => {
            setLoginMode("otp");
            setErrorMessage("");
          }}
          className={`flex-1 py-2.5 text-xs font-mono-code uppercase font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-none ${
            loginMode === "otp"
              ? "bg-[#1a1c1e] text-white"
              : "text-[#5d5e61] hover:text-[#1a1b22]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Kode OTP</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMode("password");
            setErrorMessage("");
          }}
          className={`flex-1 py-2.5 text-xs font-mono-code uppercase font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-none ${
            loginMode === "password"
              ? "bg-[#1a1c1e] text-white"
              : "text-[#5d5e61] hover:text-[#1a1b22]"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Kata Sandi</span>
        </button>
      </div>

      {loginMode === "otp" ? (
        <form onSubmit={handleSubmitOtp(onSendOtp)} className="space-y-4">
          <div>
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              error={errorsOtp.email?.message}
              {...registerOtp("email")}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={sendOtpMutation.isPending}
            className="mt-2 rounded-none"
          >
            Kirim Kode Verifikasi
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitPassword(onPasswordLogin)} className="space-y-4">
          <div>
            <Label htmlFor="email-pass">Alamat Email</Label>
            <Input
              id="email-pass"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              error={errorsPassword.email?.message}
              {...registerPassword("email")}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="password" className="mb-0">Kata Sandi</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#5d5e61] hover:text-[#af101a] transition-colors font-medium"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errorsPassword.password?.message}
              {...registerPassword("password")}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={loginMutation.isPending}
            className="mt-2 rounded-none"
          >
            Masuk dengan Kata Sandi
          </Button>
        </form>
      )}

      {/* Pembatas */}
      <div className="my-6 flex items-center before:flex-1 before:border-t before:border-[#e2e8f0] after:flex-1 after:border-t after:border-[#e2e8f0]">
        <span className="px-3 text-[11px] font-mono-code uppercase font-semibold text-[#5d5e61]">
          Atau
        </span>
      </div>

      {/* Google OAuth Button */}
      <GoogleAuthButton
        onSuccess={handleGoogleSuccess}
        onError={() => setErrorMessage("Autentikasi Google gagal.")}
        text="continue_with"
      />
    </AuthLayout>
  );
};

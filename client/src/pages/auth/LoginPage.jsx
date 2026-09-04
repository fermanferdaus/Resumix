import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleAuthButton } from "../../components/common/GoogleAuthButton.jsx";
import { AuthLayout } from "../../components/layout/AuthLayout.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { emailSchema, loginPasswordSchema } from "../../validators/authSchemas.js";
import {
  useLoginMutation,
  useSendOtpMutation,
  useGoogleAuthMutation,
  useVerify2FAMutation,
} from "../../hooks/useAuthMutations.js";
import { Lock, Mail, KeyRound, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const [loginMode, setLoginMode] = useState("otp"); // 'otp' atau 'password'
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 2FA Challenge State
  const [requires2FA, setRequires2FA] = useState(Boolean(location.state?.requires2FA));
  const [tempToken, setTempToken] = useState(location.state?.tempToken || "");
  const [twoFactorEmail, setTwoFactorEmail] = useState(location.state?.email || "");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isBackupMode, setIsBackupMode] = useState(false);

  const sendOtpMutation = useSendOtpMutation();
  const loginMutation = useLoginMutation();
  const googleAuthMutation = useGoogleAuthMutation();
  const verify2FAMutation = useVerify2FAMutation();

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
      const res = await loginMutation.mutateAsync(data);
      if (res.data?.requires2FA) {
        setTempToken(res.data.tempToken);
        setTwoFactorEmail(res.data.email || data.email);
        setRequires2FA(true);
        return;
      }
      if (res.data?.user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
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
        const res = await googleAuthMutation.mutateAsync(credentialResponse.credential);
        if (res.data?.requires2FA) {
          setTempToken(res.data.tempToken);
          setTwoFactorEmail(res.data.email || "");
          setRequires2FA(true);
          return;
        }
        if (res.data?.user?.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Autentikasi Google gagal. Silakan coba lagi."
        );
      }
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const cleanToken = twoFactorCode.trim();
    if (!cleanToken) {
      setErrorMessage(
        isBackupMode
          ? "Masukkan kode pemulihan darurat."
          : "Masukkan 6 digit kode dari aplikasi Google Authenticator."
      );
      return;
    }

    try {
      const res = await verify2FAMutation.mutateAsync({
        tempToken,
        token: cleanToken,
      });
      toast.success("Verifikasi 2FA berhasil! Selamat datang kembali.");
      if (res.data?.user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Kode verifikasi tidak valid atau sesi tantangan telah berakhir."
      );
    }
  };

  // Tampilan Tantangan 2FA (Google Authenticator)
  if (requires2FA) {
    return (
      <AuthLayout
        title="Verifikasi Google Authenticator"
        subtitle="Lapisan keamanan tambahan aktif untuk melindungi akun Anda."
      >
        {errorMessage && (
          <div className="mb-5">
            <Alert variant="error" onClose={() => setErrorMessage("")}>
              <span>{errorMessage}</span>
            </Alert>
          </div>
        )}

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-[#af101a]/10 text-[#af101a] flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <p className="text-xs text-[#5d5e61] max-w-xs leading-relaxed">
            {isBackupMode
              ? "Masukkan salah satu kode cadangan darurat 8-karakter (contoh: ABCD-1234) yang Anda peroleh saat aktivasi."
              : `Buka aplikasi Google Authenticator di perangkat Anda dan masukkan 6 digit kode verifikasi untuk akun ${twoFactorEmail || ""}.`}
          </p>
        </div>

        <form onSubmit={handleVerify2FA} className="space-y-4">
          <div>
            <Label
              htmlFor="two-factor-code"
              className="text-center block text-xs font-mono-code uppercase font-semibold text-[#5d5e61]"
            >
              {isBackupMode ? "Kode Cadangan Darurat" : "6-Digit Kode Verifikasi"}
            </Label>
            <Input
              id="two-factor-code"
              type="text"
              inputMode={isBackupMode ? "text" : "numeric"}
              maxLength={isBackupMode ? 9 : 6}
              placeholder={isBackupMode ? "XXXX-XXXX" : "000000"}
              value={twoFactorCode}
              onChange={(e) => {
                let val = e.target.value;
                if (!isBackupMode) {
                  val = val.replace(/\D/g, "").slice(0, 6);
                } else {
                  val = val.toUpperCase().slice(0, 9);
                }
                setTwoFactorCode(val);
              }}
              className="text-center font-mono-code text-2xl tracking-[0.3em] font-bold h-14 rounded-none border-[#e2e8f0] focus:border-[#af101a] focus:ring-[#af101a]"
              autoFocus
              autoComplete="one-time-code"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setIsBackupMode(!isBackupMode);
                setTwoFactorCode("");
                setErrorMessage("");
              }}
              className="text-xs text-[#5d5e61] hover:text-[#af101a] transition-colors underline font-medium cursor-pointer"
            >
              {isBackupMode
                ? "Gunakan Google Authenticator (6 digit)"
                : "Ponsel hilang? Gunakan Kode Cadangan"}
            </button>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={verify2FAMutation.isPending}
            className="rounded-none bg-[#af101a] hover:bg-[#8f0d15] text-white font-semibold cursor-pointer"
          >
            Verifikasi & Masuk
          </Button>

          <Button
            type="button"
            variant="outline"
            fullWidth
            size="sm"
            onClick={() => {
              setRequires2FA(false);
              setTempToken("");
              setTwoFactorCode("");
              setErrorMessage("");
            }}
            className="rounded-none gap-2 border-[#e2e8f0] text-[#5d5e61] hover:text-[#1a1b22] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Batal & Kembali ke Login
          </Button>
        </form>
      </AuthLayout>
    );
  }

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

export default LoginPage;

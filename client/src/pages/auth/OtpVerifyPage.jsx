import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout.jsx";
import { Button } from "../../components/ui/button.jsx";
import { OtpInput } from "../../components/ui/otp-input.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useVerifyOtpMutation, useSendOtpMutation } from "../../hooks/useAuthMutations.js";
import { RefreshCw } from "lucide-react";

export const OtpVerifyPage = () => {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { tempEmail } = useAuthStore();
  const navigate = useNavigate();

  const verifyOtpMutation = useVerifyOtpMutation();
  const sendOtpMutation = useSendOtpMutation();

  useEffect(() => {
    if (!tempEmail) {
      navigate("/login");
    }
  }, [tempEmail, navigate]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage("Silakan masukkan 6 digit kode OTP secara lengkap.");
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        email: tempEmail,
        code,
      });

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Kode OTP yang Anda masukkan salah atau telah kadaluarsa."
      );
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage("");
    try {
      await sendOtpMutation.mutateAsync(tempEmail);
      setSuccessMessage("Kode OTP baru telah berhasil dikirim ke email Anda.");
      setCountdown(60);
      setCanResend(false);
      setCode("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal mengirim ulang kode OTP."
      );
    }
  };

  return (
    <AuthLayout
      title="Verifikasi Akun"
      subtitle={
        <span>
          Kami telah mengirimkan 6 digit kode verifikasi ke:
          <br />
          <strong className="text-[#1a1b22] font-semibold">{tempEmail}</strong>
        </span>
      }
    >
      {/* Alert Error / Success di Atas Form */}
      {errorMessage && (
        <div className="mb-5">
          <Alert variant="error" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        </div>
      )}

      {successMessage && (
        <div className="mb-5">
          <Alert variant="success" onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <OtpInput
          length={6}
          value={code}
          onChange={(val) => {
            setCode(val);
            setErrorMessage("");
          }}
          disabled={verifyOtpMutation.isPending}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={verifyOtpMutation.isPending}
          disabled={code.length !== 6}
          className="rounded-none"
        >
          Verifikasi Akun
        </Button>
      </form>

      {/* Kirim Ulang OTP */}
      <div className="mt-6 text-center text-xs text-[#5d5e61]">
        {canResend ? (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={sendOtpMutation.isPending}
            className="text-[#af101a] hover:underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sendOtpMutation.isPending ? "animate-spin" : ""}`} />
            <span>Kirim Ulang Kode</span>
          </button>
        ) : (
          <p>
            Belum menerima kode? Kirim ulang dalam{" "}
            <span className="font-mono-code font-bold text-[#1a1b22]">{countdown}s</span>
          </p>
        )}
      </div>
    </AuthLayout>
  );
};

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
import { emailSchema, completeProfileSchema } from "../../validators/authSchemas.js";
import { useCheckEmailMutation, useRegisterMutation, useGoogleAuthMutation } from "../../hooks/useAuthMutations.js";

export const RegisterPage = () => {
  const [step, setStep] = useState(1); // Step 1: Cek Email, Step 2: Form Lengkap
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const checkEmailMutation = useCheckEmailMutation();
  const registerMutation = useRegisterMutation();
  const googleAuthMutation = useGoogleAuthMutation();

  // Form Step 1: Input Email
  const {
    register: registerEmailForm,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  // Form Step 2: Nama & Kata Sandi
  const {
    register: registerProfileForm,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(completeProfileSchema),
  });

  // Handle Step 1: Periksa Email
  const onCheckEmail = async (data) => {
    setErrorMessage("");
    try {
      await checkEmailMutation.mutateAsync(data.email);
      setVerifiedEmail(data.email);
      setProfileValue("email", data.email);
      setStep(2);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Email ini sudah terdaftar. Silakan masuk."
      );
    }
  };

  // Handle Step 2: Submit Registrasi & Kirim OTP
  const onRegisterProfile = async (data) => {
    setErrorMessage("");
    try {
      await registerMutation.mutateAsync({
        email: verifiedEmail,
        fullName: data.fullName,
        password: data.password,
        retypePassword: data.retypePassword,
      });
      navigate("/verify-otp");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal melakukan pendaftaran. Silakan periksa kembali formulir Anda."
      );
    }
  };

  // Handle Google Sign-In
  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage("");
    if (credentialResponse.credential) {
      try {
        await googleAuthMutation.mutateAsync(credentialResponse.credential);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Pendaftaran via Google gagal."
        );
      }
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Buat Akun Baru" : "Lengkapi Profil Anda"}
      subtitle={
        step === 1
          ? "Mulai buat CV berstandar ATS profesional dan lolos seleksi kerja impian."
          : "Selesaikan pembuatan akun Anda untuk mulai membuat CV ATS profesional."
      }
      footerLink={
        <p>
          Sudah memiliki akun?{" "}
          <Link
            to="/login"
            className="text-[#1a1b22] font-semibold underline underline-offset-4 hover:text-[#d32f2f] transition-colors"
          >
            Masuk di Sini
          </Link>
        </p>
      }
    >
      {/* Alert Error di Atas Form */}
      {errorMessage && (
        <div className="mb-5">
          <Alert variant="error" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        </div>
      )}

      {step === 1 ? (
        <>
          <form onSubmit={handleSubmitEmail(onCheckEmail)} className="space-y-4">
            <div>
              <Label htmlFor="reg-email">Alamat Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                error={emailErrors.email?.message}
                {...registerEmailForm("email")}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={checkEmailMutation.isPending}
              className="mt-2"
            >
              Lanjutkan
            </Button>
          </form>

          {/* Pembatas */}
          <div className="my-6 flex items-center before:flex-1 before:border-t before:border-[#e2e8f0] after:flex-1 after:border-t after:border-[#e2e8f0]">
            <span className="px-3 text-[11px] font-mono-code uppercase font-semibold text-[#5d5e61]">
              Atau
            </span>
          </div>

          {/* Google Sign-In */}
          <GoogleAuthButton
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMessage("Pendaftaran via Google gagal.")}
            text="signup_with"
          />
        </>
      ) : (
        <form onSubmit={handleSubmitProfile(onRegisterProfile)} className="space-y-4">
          {/* Email Terpilih (Dengan Opsi Ubah) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="selected-email" className="mb-0">Alamat Email</Label>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                }}
                className="text-xs text-[#d32f2f] hover:underline cursor-pointer font-medium"
              >
                Ubah Email
              </button>
            </div>
            <Input
              id="selected-email"
              type="email"
              value={verifiedEmail}
              readOnly
              disabled
              className="bg-[#f8fafc] text-[#5d5e61] cursor-not-allowed"
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="contoh: Alex Davis"
              autoComplete="name"
              error={profileErrors.fullName?.message}
              {...registerProfileForm("fullName")}
            />
          </div>

          {/* Kata Sandi */}
          <div>
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="Contoh: Rahasia123!"
              autoComplete="new-password"
              error={profileErrors.password?.message}
              {...registerProfileForm("password")}
            />
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div>
            <Label htmlFor="retypePassword">Ulangi Kata Sandi</Label>
            <Input
              id="retypePassword"
              type="password"
              placeholder="Ketik ulang kata sandi"
              autoComplete="new-password"
              error={profileErrors.retypePassword?.message}
              {...registerProfileForm("retypePassword")}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={registerMutation.isPending}
            className="mt-4"
          >
            Daftar & Kirim Kode OTP
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

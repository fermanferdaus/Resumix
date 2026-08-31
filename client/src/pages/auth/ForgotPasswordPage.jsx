import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "../../components/layout/AuthLayout.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { forgotPasswordSchema } from "../../validators/authSchemas.js";
import { useForgotPasswordMutation } from "../../hooks/useAuthMutations.js";

export const ForgotPasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setSuccessMessage(
        "Tautan pengaturan ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Email ini belum terdaftar. Silakan daftar terlebih dahulu."
      );
    }
  };

  return (
    <AuthLayout
      title="Lupa Kata Sandi"
      subtitle="Masukkan alamat email akun Anda untuk menerima tautan pemulihan kata sandi."
      footerLink={
        <p>
          Ingat kata sandi Anda?{" "}
          <Link
            to="/login"
            className="text-[#1a1b22] font-semibold underline underline-offset-4 hover:text-[#d32f2f] transition-colors"
          >
            Masuk di Sini
          </Link>
        </p>
      }
    >
      {/* Alert Error / Success di Atas Form */}
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

      {successMessage && (
        <div className="mb-5">
          <Alert variant="success" onClose={() => setSuccessMessage("")}>
            <div className="flex flex-col gap-1">
              <span>{successMessage}</span>
            </div>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="forgot-email">Alamat Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={forgotPasswordMutation.isPending}
          className="mt-2"
        >
          Verifikasi Email
        </Button>
      </form>
    </AuthLayout>
  );
};

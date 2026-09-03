import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "../../components/layout/AuthLayout.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { resetPasswordSchema } from "../../validators/authSchemas.js";
import { useResetPasswordMutation } from "../../hooks/useAuthMutations.js";

export const ResetPasswordPage = () => {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get("token") || "";

  const [errorMessage, setErrorMessage] = useState(
    !token
      ? "Tautan reset kata sandi tidak valid atau tidak memiliki parameter token. Silakan minta tautan baru."
      : ""
  );
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const resetPasswordMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!token) {
      setErrorMessage("Token reset tidak ditemukan. Silakan minta tautan baru.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
        retypePassword: data.retypePassword,
      });

      setSuccessMessage("Kata sandi berhasil diperbarui! Mengalihkan ke halaman login...");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Gagal mereset kata sandi. Tautan mungkin telah kadaluarsa atau sudah digunakan."
      );
    }
  };

  return (
    <AuthLayout
      title="Buat Kata Sandi Baru"
      subtitle="Masukkan kata sandi baru yang kuat untuk mengamankan akun Resumix Anda."
      footerLink={
        <p>
          Sudah ingat kata sandi Anda?{" "}
          <Link
            to="/login"
            className="text-[#1a1b22] font-semibold underline underline-offset-4 hover:text-[#af101a] transition-colors"
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
            {errorMessage.toLowerCase().includes("tidak valid") && (
              <Link
                to="/forgot-password"
                className="font-bold underline ml-1 text-[#93000a] hover:text-[#ba1a1a]"
              >
                Minta tautan baru
              </Link>
            )}
          </Alert>
        </div>
      )}

      {successMessage && (
        <div className="mb-5">
          <Alert variant="success">
            <span>{successMessage}</span>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Kata Sandi Baru */}
        <div>
          <Label htmlFor="new-password">Kata Sandi Baru</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Contoh: RahasiaBaru123!"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <p className="text-[11px] text-[#5d5e61] mt-1">
            Wajib: Min. 8 karakter, 1 huruf besar (A-Z), 1 angka (0-9), & 1 simbol spesial (@, #, $, dll).
          </p>
        </div>

        {/* Ulangi Kata Sandi */}
        <div>
          <Label htmlFor="retype-new-password">Ulangi Kata Sandi Baru</Label>
          <Input
            id="retype-new-password"
            type="password"
            placeholder="Ketik ulang kata sandi baru"
            autoComplete="new-password"
            error={errors.retypePassword?.message}
            {...register("retypePassword")}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={resetPasswordMutation.isPending}
          disabled={!token || !!successMessage}
          className="mt-4 rounded-none"
        >
          Simpan Kata Sandi Baru
        </Button>
      </form>
    </AuthLayout>
  );
};

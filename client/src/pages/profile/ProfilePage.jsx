import { useState, useEffect, useRef } from "react";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { userApi } from "../../api/userApi.js";
import { appConfig } from "../../config/appConfig.js";
import { EditProfileModal } from "../../components/profile/EditProfileModal.jsx";
import { ImageCropperModal } from "../../components/profile/ImageCropperModal.jsx";
import { DeleteConfirmModal } from "../../components/common/DeleteConfirmModal.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  User,
  Camera,
  Trash2,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

/**
 * Helper untuk format tanggal bahasa Indonesia (contoh: 15 Januari 1995)
 */
const formatIndonesianDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Helper untuk mendapatkan URL avatar lengkap
 */
const getAvatarFullUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }
  const base = appConfig.apiUrl.replace(/\/api\/v1\/?$/, "");
  return `${base}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
};

export const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Avatar Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Delete Avatar Confirm
  const [isDeleteAvatarOpen, setIsDeleteAvatarOpen] = useState(false);

  // Alerts
  const [notice, setNotice] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    userApi
      .getProfile()
      .then((res) => {
        if (isMounted && res.data) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat profil pengguna", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  // Handler Pemilihan File Gambar
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input agar bisa memilih file yang sama
    e.target.value = "";

    // Validasi ketat: Hanya boleh file gambar
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File yang dipilih bukan gambar. Harap pilih berkas gambar (.jpg, .jpeg, .png, .webp).");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    // Batasan ukuran: Maks 5MB sebelum crop
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file gambar terlalu besar. Maksimal 5MB.");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Handler Simpan Foto yang Telah Dipotong
  const handleCropComplete = async (croppedWebpDataUrl) => {
    setIsUploadingAvatar(true);
    try {
      const res = await userApi.uploadAvatar(croppedWebpDataUrl);
      if (res.data?.user) {
        setUser(res.data.user);
      }
      setNotice("Foto profil berhasil diperbarui dan disimpan.");
      setTimeout(() => setNotice(null), 4000);
      setCropperOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengunggah foto profil.");
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handler Hapus Avatar
  const handleDeleteAvatar = async () => {
    try {
      const res = await userApi.deleteAvatar();
      if (res.data) {
        setUser(res.data);
      }
      setNotice("Foto profil berhasil dihapus.");
      setTimeout(() => setNotice(null), 4000);
      setIsDeleteAvatarOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menghapus foto profil.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  // Handler Simpan Biodata
  const handleSaveProfile = async (formData) => {
    setIsSubmittingProfile(true);
    try {
      const res = await userApi.updateProfile(formData);
      if (res.data) {
        setUser(res.data);
      }
      setNotice("Informasi pribadi Anda berhasil disimpan.");
      setTimeout(() => setNotice(null), 4000);
      setIsEditingProfile(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal memperbarui informasi profil.");
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const avatarSrc = getAvatarFullUrl(user?.avatarUrl);

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col text-[#1a1b22] rounded-none pt-16 font-sans">
      <Navbar />

      <main className="w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex-1">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#e2e8f0] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code text-xs font-bold text-[#af101a] tracking-wider uppercase">
                Pengaturan Akun
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
              Profil Pengguna
            </h1>
            <p className="text-sm text-[#5d5e61] mt-0.5">
              Kelola informasi pribadi Anda.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditingProfile(true)}
            className="rounded-none border-[#1a1c1e] text-[#1a1c1e] hover:bg-[#f1f5f9] text-xs font-mono-code uppercase font-semibold flex items-center gap-1.5 h-10 px-4 self-start sm:self-auto"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Ubah Profil</span>
          </Button>
        </div>

        {/* Notifications */}
        {notice && (
          <div className="mb-6 p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] text-xs text-[#166534] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-[#fef2f2] border border-[#fecaca] text-xs text-[#991b1b] flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e2e8f0]">
            <Loader2 className="w-8 h-8 text-[#af101a] animate-spin mb-3" />
            <span className="text-xs font-mono-code text-[#5d5e61]">
              Memuat data profil pengguna...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card: Avatar & Account Badge */}
            <div className="md:col-span-1 bg-white border border-[#e2e8f0] p-6 flex flex-col items-center text-center">
              {/* Avatar Frame */}
              <div className="relative group">
                <div className="w-32 h-32 bg-[#f8fafc] border-2 border-[#1a1c1e] overflow-hidden flex items-center justify-center shadow-sm">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user?.fullName || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#fef2f2] text-[#af101a] flex items-center justify-center text-4xl font-bold font-mono-code">
                      {user?.fullName?.charAt(0)?.toUpperCase() || (
                        <User className="w-12 h-12 text-[#af101a]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Hover Quick Overlay on Avatar */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[11px] font-mono-code font-semibold">Ganti Foto</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Name & Email Headline */}
              <h2 className="text-base font-bold text-[#0f172a] mt-4 line-clamp-1">
                {user?.fullName || "Pengguna Resumix"}
              </h2>
              <p className="text-xs text-[#5d5e61] line-clamp-1 mt-0.5 font-mono-code">
                {user?.email}
              </p>

              {/* Status Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-[11px] font-mono-code">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Akun Terverifikasi</span>
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-6 pt-4 border-t border-[#e2e8f0] space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-xs rounded-none border-[#cbd5e1] hover:border-[#af101a] flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-[#af101a]" />
                  <span>Unggah Foto Profil</span>
                </Button>

                {user?.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeleteAvatarOpen(true)}
                    className="w-full text-xs rounded-none text-[#ba1a1a] hover:bg-[#fef2f2] flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto Profil</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Right Card: Personal Information Details */}
            <div className="md:col-span-2 bg-white border border-[#e2e8f0] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-3 mb-6">
                  <h2 className="text-base font-bold text-[#0f172a] uppercase tracking-wide font-mono-code">
                    Informasi Pribadi
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nama Lengkap */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#af101a]" />
                      <span>Nama Lengkap</span>
                    </span>
                    <p className="text-sm font-semibold text-[#0f172a]">
                      {user?.fullName || "-"}
                    </p>
                  </div>

                  {/* Alamat Email */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#af101a]" />
                      <span>Alamat Email</span>
                    </span>
                    <p className="text-sm font-semibold text-[#0f172a] flex items-center gap-1.5">
                      <span>{user?.email || "-"}</span>
                      {user?.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" title="Email Terverifikasi" />
                      )}
                    </p>
                  </div>

                  {/* Nomor Handphone */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#af101a]" />
                      <span>Nomor Handphone</span>
                    </span>
                    <p className="text-sm font-semibold text-[#0f172a]">
                      {user?.phone || "-"}
                    </p>
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#af101a]" />
                      <span>Tanggal Lahir</span>
                    </span>
                    <p className="text-sm font-semibold text-[#0f172a]">
                      {formatIndonesianDate(user?.dob)}
                    </p>
                  </div>

                  {/* Domisili */}
                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#af101a]" />
                      <span>Domisili</span>
                    </span>
                    <p className="text-sm font-semibold text-[#0f172a]">
                      {user?.domicile || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informational Footer Box */}
              <div className="mt-8 pt-4 border-t border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs text-[#5d5e61] flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#af101a] mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  Data biodata Anda tersimpan dengan aman dan dapat digunakan untuk mengisi bagian informasi kontak pada CV secara otomatis saat membuat lembar resume baru.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal Pemotong Gambar Interaktif */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={selectedImageSrc}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
        isUploading={isUploadingAvatar}
      />

      {/* Modal Edit Informasi Biodata */}
      <EditProfileModal
        isOpen={isEditingProfile}
        initialData={user}
        onClose={() => setIsEditingProfile(false)}
        onSave={handleSaveProfile}
        isSubmitting={isSubmittingProfile}
      />

      {/* Modal Konfirmasi Hapus Avatar */}
      <DeleteConfirmModal
        isOpen={isDeleteAvatarOpen}
        title="Hapus Foto Profil?"
        description="Apakah Anda yakin ingin menghapus foto profil ini? Foto akan dihapus dari server."
        onClose={() => setIsDeleteAvatarOpen(false)}
        onConfirm={handleDeleteAvatar}
      />
    </div>
  );
};

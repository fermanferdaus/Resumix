import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";

export const EditProfileModal = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    dob: initialData?.dob || "",
    domicile: initialData?.domicile || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Nama lengkap minimal 2 karakter";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border-2 border-[#1a1c1e] shadow-2xl rounded-none flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Ubah Informasi Pribadi
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#5d5e61] hover:text-[#0f172a] p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="edit-fullName" className="text-xs font-mono-code uppercase font-semibold text-[#0f172a]">
                Nama Lengkap *
              </Label>
              <Input
                id="edit-fullName"
                type="text"
                placeholder="Contoh: Jane Doe"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="mt-1.5 rounded-none"
              />
              {errors.fullName && (
                <p className="text-xs text-[#ba1a1a] mt-1 font-mono-code">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address (Readonly) */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-email" className="text-xs font-mono-code uppercase font-semibold text-[#5d5e61]">
                  Alamat Email
                </Label>
              </div>
              <Input
                id="edit-email"
                type="email"
                value={initialData?.email || ""}
                disabled
                className="mt-1.5 bg-[#f8fafc] text-[#5d5e61] cursor-not-allowed rounded-none border-[#e2e8f0]"
              />
              <p className="text-[11px] text-[#5d5e61] mt-1">
                Email terverifikasi digunakan untuk autentikasi dan tidak dapat diubah di sini.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div>
                <Label htmlFor="edit-phone" className="text-xs font-mono-code uppercase font-semibold text-[#0f172a]">
                  Nomor Handphone
                </Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="Contoh: +62 812-3456-7890"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="mt-1.5 rounded-none"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="edit-dob" className="text-xs font-mono-code uppercase font-semibold text-[#0f172a]">
                  Tanggal Lahir
                </Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="mt-1.5 rounded-none cursor-pointer"
                />
              </div>
            </div>

            {/* Domicile */}
            <div>
              <Label htmlFor="edit-domicile" className="text-xs font-mono-code uppercase font-semibold text-[#0f172a]">
                Domisili
              </Label>
              <Input
                id="edit-domicile"
                type="text"
                placeholder="Contoh: Jakarta, Indonesia"
                value={formData.domicile}
                onChange={(e) => handleChange("domicile", e.target.value)}
                className="mt-1.5 rounded-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-none text-xs"
            >
              Batal
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="rounded-none text-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Simpan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Alert } from "../ui/alert.jsx";
import { X, Plus } from "lucide-react";

export const CreateResumeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul resume tidak boleh kosong.");
      return;
    }
    setError("");
    onSubmit({
      title: title.trim(),
      targetRole: targetRole.trim() || undefined,
    });
  };

  const handleClose = () => {
    setTitle("");
    setTargetRole("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-none relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#5d5e61] hover:text-[#1a1b22] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0f172a] tracking-tight">
            Buat CV ATS Baru
          </h2>
          <p className="text-xs text-[#5d5e61] mt-1 leading-relaxed">
            Berikan nama dan posisi untuk resume baru Anda. Format akan otomatis disesuaikan dengan standar ATS.
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resume-title">Judul Resume *</Label>
            <Input
              id="resume-title"
              type="text"
              placeholder="Contoh: Senior Frontend Developer 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="resume-target-role">Posisi / Pekerjaan (Opsional)</Label>
            <Input
              id="resume-target-role"
              type="text"
              placeholder="Contoh: Full Stack Engineer / UI Designer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-none"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex items-center gap-1.5 rounded-none"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Resume</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Alert } from "../ui/alert.jsx";
import { X, Edit2 } from "lucide-react";

const RenameResumeForm = ({ resume, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState(resume?.title || "");
  const [targetRole, setTargetRole] = useState(resume?.targetRole || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul resume tidak boleh kosong.");
      return;
    }
    setError("");
    onSubmit({
      id: resume.id,
      title: title.trim(),
      targetRole: targetRole.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-none relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5d5e61] hover:text-[#1a1b22] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-mono-code uppercase font-semibold text-[#1a1b22] mb-2 rounded-none">
            <Edit2 className="w-3.5 h-3.5 text-[#af101a]" />
            <span>&lt;Ubah Judul Resume /&gt;</span>
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] tracking-tight">
            Ubah Informasi Resume
          </h2>
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
            <Label htmlFor="rename-title">Judul Resume *</Label>
            <Input
              id="rename-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="rename-target-role">Posisi / Pekerjaan Target</Label>
            <Input
              id="rename-target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-none"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="rounded-none"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const RenameResumeModal = ({ isOpen, resume, onClose, onSubmit, isLoading }) => {
  if (!isOpen || !resume) return null;

  return (
    <RenameResumeForm
      key={resume.id}
      resume={resume}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

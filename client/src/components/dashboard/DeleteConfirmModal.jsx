import { Button } from "../ui/button.jsx";
import { AlertTriangle, X } from "lucide-react";

export const DeleteConfirmModal = ({ isOpen, resume, onClose, onConfirm, isLoading }) => {
  if (!isOpen || !resume) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white border border-[#ba1a1a] p-6 sm:p-8 rounded-none relative animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5d5e61] hover:text-[#1a1b22] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 bg-[#fff1f2] border border-[#ba1a1a] flex items-center justify-center flex-shrink-0 text-[#af101a] rounded-none">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
              Hapus Resume Ini?
            </h2>
            <p className="text-xs text-[#5d5e61] mt-1 leading-relaxed">
              Anda akan menghapus resume <strong className="text-[#1a1b22]">"{resume.title}"</strong> secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
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
            type="button"
            variant="primary"
            onClick={() => onConfirm(resume.id)}
            isLoading={isLoading}
            className="bg-[#ba1a1a] hover:bg-[#93000a] active:bg-[#680004] text-white rounded-none"
          >
            Ya, Hapus Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

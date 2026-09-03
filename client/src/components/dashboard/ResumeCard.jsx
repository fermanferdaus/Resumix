import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button.jsx";
import { MoreVertical, Edit, Copy, Trash2, FileText, Download, Loader2 } from "lucide-react";

export const ResumeCard = ({
  resume,
  onEdit,
  onRename,
  onDuplicate,
  onDelete,
  onDownload,
  isDownloading = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Baru saja";
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] hover:border-[#1a1c1e] transition-colors p-5 flex flex-col justify-between min-h-[220px] rounded-none group relative">
      <div>
        {/* Top Header: Badge & Menu */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className="text-[11px] font-mono-code uppercase font-semibold text-[#af101a] bg-[#fef2f2] border border-[#fecaca] px-2 py-0.5 rounded-none truncate max-w-[75%]">
            &lt;{resume.targetRole || "ATS General"} /&gt;
          </span>

          {/* More Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#5d5e61] hover:text-[#1a1c1e] p-1 cursor-pointer transition-colors"
              title="Opsi resume"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#1a1c1e] shadow-none z-20 rounded-none py-1 animate-in fade-in-50 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(resume);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#1a1b22] hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Edit className="w-3.5 h-3.5 text-[#5d5e61]" />
                  <span>Ubah Judul</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (onDownload) onDownload(resume);
                  }}
                  disabled={isDownloading}
                  className="w-full px-3 py-2 text-left text-xs text-[#1a1b22] hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer font-medium disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-[#5d5e61]" />
                  <span>Unduh PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(resume.id);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#1a1b22] hover:bg-[#f8fafc] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Copy className="w-3.5 h-3.5 text-[#5d5e61]" />
                  <span>Duplikat Resume</span>
                </button>

                <div className="border-t border-[#e2e8f0] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(resume);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#ba1a1a] hover:bg-[#fff1f2] flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#ba1a1a]" />
                  <span>Hapus Resume</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resume Title */}
        <h3 className="text-base font-bold text-[#0f172a] mb-1 line-clamp-2 tracking-tight group-hover:text-[#af101a] transition-colors">
          {resume.title}
        </h3>

        {/* Last Modified Date */}
        <p className="text-xs text-[#5d5e61]">
          Diperbarui: <span className="font-medium text-[#1a1b22]">{formatDate(resume.updatedAt)}</span>
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center gap-2 mt-5 pt-3 border-t border-[#f1f5f9]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(resume)}
          className="flex-1 text-xs font-semibold rounded-none flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-[#af101a]" />
          <span>Edit CV</span>
        </Button>

        <Button
          variant="subtle"
          size="icon"
          className="h-9 w-9 text-[#5d5e61] hover:text-[#af101a] rounded-none flex items-center justify-center cursor-pointer"
          title="Unduh PDF Langsung"
          disabled={isDownloading}
          onClick={() => {
            if (onDownload) onDownload(resume);
          }}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#af101a]" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

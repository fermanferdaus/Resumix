import { Button } from "../ui/button.jsx";
import { Check, Loader2, AlertCircle, Printer, ZoomIn, ZoomOut, RotateCcw, Edit3 } from "lucide-react";

export const EditorSubheader = ({
  title,
  onTitleChange,
  saveStatus,
  zoom,
  onZoomChange,
  onPrint,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#e2e8f0] px-4 sm:px-6 py-2 flex items-center justify-between gap-3 rounded-none print:hidden h-12 flex-shrink-0">
      {/* Left: Back Link & Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Title Editor */}
        <div className="flex items-center gap-1.5 flex-1 max-w-sm min-w-0">
          <Edit3 className="w-3.5 h-3.5 text-[#5d5e61] flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Judul Resume..."
            className="w-full bg-transparent hover:bg-[#f8fafc] focus:bg-white text-xs sm:text-sm font-bold text-[#0f172a] px-2 py-0.5 border border-transparent hover:border-[#e2e8f0] focus:border-[#af101a] outline-none rounded-none transition-colors truncate"
            title="Klik untuk mengubah nama dokumen resume"
          />
        </div>
      </div>

      {/* Right: Zoom & Print PDF Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Autosave Status */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono-code flex-shrink-0">
          {saveStatus === "saving" && (
            <span className="text-[#5d5e61] flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#af101a]" />
              <span>Menyimpan...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[#15803d] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Tersimpan</span>
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-[#ba1a1a] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Gagal menyimpan</span>
            </span>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center border border-[#e2e8f0] rounded-none bg-[#f8fafc]">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="p-1 text-[#5d5e61] hover:text-[#1a1b22] hover:bg-white cursor-pointer"
            title="Perkecil Preview"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono-code px-1 min-w-[36px] text-center font-medium">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(150, zoom + 10))}
            className="p-1 text-[#5d5e61] hover:text-[#1a1b22] hover:bg-white cursor-pointer"
            title="Perbesar Preview"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(100)}
            className="p-1 text-[#5d5e61] hover:text-[#1a1b22] hover:bg-white border-l border-[#e2e8f0] cursor-pointer"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Print / Export Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onPrint}
          className="flex items-center gap-1.5 rounded-none font-semibold text-xs h-8 shadow-none"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Unduh PDF</span>
        </Button>
      </div>
    </div>
  );
};

import { Button } from "../ui/button.jsx";
import {
  Check,
  Loader2,
  AlertCircle,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Edit3,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export const EditorSubheader = ({
  title,
  onTitleChange,
  saveStatus,
  zoom,
  onZoomChange,
  onPrint,
  isSidebarOpen = true,
  onToggleSidebar,
  progress = 0,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#e2e8f0] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-3 rounded-none print:hidden h-12 flex-shrink-0">
      {/* Left: View Panel Toggle (Desktop only) & Title */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
        {/* Toggle Sidebar Button (Desktop only) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`hidden lg:flex p-1.5 border rounded-none transition-colors cursor-pointer items-center justify-center ${
            isSidebarOpen
              ? "bg-[#f8fafc] border-[#e2e8f0] text-[#af101a] hover:bg-[#f1f5f9]"
              : "bg-white border-[#e2e8f0] text-[#5d5e61] hover:text-[#0f172a] hover:bg-[#f8fafc]"
          }`}
          title={isSidebarOpen ? "Sembunyikan Navigasi" : "Tampilkan Navigasi"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        {/* Title Editor */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xs sm:max-w-sm min-w-0">
          <Edit3 className="w-3.5 h-3.5 text-[#5d5e61] flex-shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Judul Resume..."
            className="w-full bg-transparent hover:bg-[#f8fafc] focus:bg-white text-xs sm:text-sm font-bold text-[#0f172a] px-1.5 sm:px-2 py-0.5 border border-transparent hover:border-[#e2e8f0] focus:border-[#af101a] outline-none rounded-none transition-colors truncate"
            title="Klik untuk mengubah nama dokumen resume"
          />
        </div>
      </div>

      {/* Right: Kesiapan ATS, Zoom & Print PDF Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Kesiapan ATS Progress Box */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-none">
          <span className="hidden sm:inline text-[10px] sm:text-[11px] font-mono-code font-bold uppercase text-[#0f172a] whitespace-nowrap">
            Progres
          </span>
          <div className="w-10 sm:w-20 bg-[#e2e8f0] h-1.5 rounded-none overflow-hidden">
            <div
              className="bg-[#af101a] h-full transition-all duration-300 rounded-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] sm:text-xs font-mono-code font-bold text-[#af101a]">
            {progress}%
          </span>
        </div>

        {/* Autosave Status (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono-code flex-shrink-0">
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
              <span>Gagal</span>
            </span>
          )}
        </div>

        {/* Zoom Controls (Desktop only) */}
        <div className="hidden lg:flex items-center border border-[#e2e8f0] rounded-none bg-[#f8fafc]">
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
          className="flex items-center gap-1 sm:gap-1.5 rounded-none font-semibold text-xs h-7 sm:h-8 px-2.5 sm:px-3 shadow-none"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Unduh PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </div>
  );
};

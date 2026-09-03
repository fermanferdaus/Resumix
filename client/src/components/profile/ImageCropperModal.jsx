import { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button.jsx";

export const ImageCropperModal = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  isUploading = false,
}) => {
  const canvasRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const CANVAS_SIZE = 340;

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (isMounted) {
        setImageObj(img);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      }
    };
    img.src = imageSrc;

    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  // Draw on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Save state
    ctx.save();

    // Center origin
    ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x, offset.y);

    // Calculate base aspect fit
    const hRatio = CANVAS_SIZE / imageObj.width;
    const vRatio = CANVAS_SIZE / imageObj.height;
    const ratio = Math.max(hRatio, vRatio);

    const drawWidth = imageObj.width * ratio;
    const drawHeight = imageObj.height * ratio;

    ctx.drawImage(
      imageObj,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Draw Dark Vignette / Circular Mask
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Cut out circular viewport
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 12, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw circular guideline border
    ctx.strokeStyle = "#af101a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 12, 0, Math.PI * 2);
    ctx.stroke();

    // Draw 3x3 Grid Guidelines inside circle
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    const innerRadius = CANVAS_SIZE / 2 - 12;
    const center = CANVAS_SIZE / 2;

    ctx.beginPath();
    // Vertical grid lines
    ctx.moveTo(center - innerRadius / 3, center - innerRadius * 0.9);
    ctx.lineTo(center - innerRadius / 3, center + innerRadius * 0.9);
    ctx.moveTo(center + innerRadius / 3, center - innerRadius * 0.9);
    ctx.lineTo(center + innerRadius / 3, center + innerRadius * 0.9);
    // Horizontal grid lines
    ctx.moveTo(center - innerRadius * 0.9, center - innerRadius / 3);
    ctx.lineTo(center + innerRadius * 0.9, center - innerRadius / 3);
    ctx.moveTo(center - innerRadius * 0.9, center + innerRadius / 3);
    ctx.lineTo(center + innerRadius * 0.9, center + innerRadius / 3);
    ctx.stroke();

    ctx.restore();
  }, [imageObj, zoom, rotation, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse & Touch Dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  // Rotate 90 deg
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Perform Final Crop to Compressed WebP
  const handleApplyCrop = () => {
    if (!imageObj) return;

    // Create high-res export canvas (400x400)
    const exportSize = 400;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const ctx = exportCanvas.getContext("2d");

    // Scale factor from preview canvas
    const factor = exportSize / (CANVAS_SIZE - 24);

    ctx.save();
    ctx.translate(exportSize / 2, exportSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * factor, zoom * factor);
    ctx.translate(offset.x, offset.y);

    const hRatio = CANVAS_SIZE / imageObj.width;
    const vRatio = CANVAS_SIZE / imageObj.height;
    const ratio = Math.max(hRatio, vRatio);

    const drawWidth = imageObj.width * ratio;
    const drawHeight = imageObj.height * ratio;

    ctx.drawImage(
      imageObj,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    // Export strictly as compressed .webp (Quality 0.82)
    const webpDataUrl = exportCanvas.toDataURL("image/webp", 0.82);
    onCropComplete(webpDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-2 border-[#1a1c1e] shadow-2xl rounded-none flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div>
            <span className="font-mono-code text-[11px] font-bold text-[#af101a] tracking-wider uppercase block">
              Editor Foto Profil
            </span>
            <h3 className="text-sm font-bold text-[#0f172a]">
              Sesuaikan & Potong Foto
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="text-[#5d5e61] hover:text-[#0f172a] p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-4 flex flex-col items-center justify-center bg-[#f1f5f9] select-none">
          <div className="relative border-2 border-[#cbd5e1] bg-black overflow-hidden cursor-grab active:cursor-grabbing shadow-inner">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="block"
            />
          </div>
          <p className="text-[11px] text-[#5d5e61] mt-2 font-mono-code">
            Geser gambar untuk mengatur posisi wajah / avatar
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="px-4 py-3 bg-white border-t border-[#e2e8f0] space-y-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="text-[#5d5e61] hover:text-[#0f172a] p-1 cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#af101a] cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="text-[#5d5e61] hover:text-[#0f172a] p-1 cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono-code text-[#5d5e61] w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>

            {/* Rotate Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="h-8 px-2.5 text-xs rounded-none border-[#cbd5e1] hover:border-[#af101a] flex items-center gap-1 ml-1"
              title="Putar 90 derajat"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Putar</span>
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-none text-xs"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApplyCrop}
            disabled={isUploading || !imageObj}
            className="rounded-none text-xs flex items-center gap-1.5"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan & Simpan Foto</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

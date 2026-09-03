import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { YearPicker } from "../../ui/YearPicker.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const CertificationsSectionForm = ({
  data,
  onChange,
  onRequestDelete,
}) => {
  const [dragCertIndex, setDragCertIndex] = useState(null);
  const [dragCertOverIndex, setDragCertOverIndex] = useState(null);

  const handleAddCertification = () => {
    const newCertifications = [
      ...(data.certifications || []),
      { name: "", issuer: "", credentialId: "", year: "" },
    ];
    onChange({ ...data, certifications: newCertifications });
  };

  const handleUpdateCertification = (index, field, value) => {
    const newCertifications = [...(data.certifications || [])];
    const current = newCertifications[index];
    const updated =
      typeof current === "object" && current !== null
        ? { ...current, [field]: value }
        : { name: typeof current === "string" ? current : "", [field]: value };
    newCertifications[index] = updated;
    onChange({ ...data, certifications: newCertifications });
  };

  const handleDeleteCertification = (index) => {
    const newCertifications = (data.certifications || []).filter(
      (_, i) => i !== index
    );
    onChange({ ...data, certifications: newCertifications });
  };

  const confirmDeleteCertification = (index) => {
    onRequestDelete({
      title: "Hapus Sertifikat / Prestasi?",
      description:
        "Apakah Anda yakin ingin menghapus data sertifikat/prestasi ini dari resume Anda?",
      onConfirm: () => handleDeleteCertification(index),
    });
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    setDragCertIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `cert-${index}`);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragCertOverIndex !== index) {
      setDragCertOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragCertIndex === null || dragCertIndex === targetIndex) {
      setDragCertIndex(null);
      setDragCertOverIndex(null);
      return;
    }

    const newCertifications = [...(data.certifications || [])];
    const [moved] = newCertifications.splice(dragCertIndex, 1);
    newCertifications.splice(targetIndex, 0, moved);

    setDragCertIndex(null);
    setDragCertOverIndex(null);
    onChange({ ...data, certifications: newCertifications });
  };

  const handleDragEnd = () => {
    setDragCertIndex(null);
    setDragCertOverIndex(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      {(data.certifications || []).map((cert, idx) => {
        const certObj =
          typeof cert === "object" && cert !== null
            ? cert
            : {
                name: typeof cert === "string" ? cert : "",
                issuer: "",
                credentialId: "",
                year: "",
              };

        const isDragging = dragCertIndex === idx;
        const isOver = dragCertOverIndex === idx && dragCertIndex !== idx;

        return (
          <div
            key={idx}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            className={`p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3 transition-all ${
              isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
            } ${isOver ? "border-t-2 border-t-[#af101a] bg-[#fef2f2]/50" : ""}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 transition-colors"
                  title="Tahan dan geser untuk memindahkan urutan sertifikat"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Sertifikat / Prestasi
                </span>
              </div>
              <button
                type="button"
                onClick={() => confirmDeleteCertification(idx)}
                className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            <div>
              <Label>Nama Sertifikat / Prestasi *</Label>
              <Input
                type="text"
                placeholder="Contoh: Juara 1 Kontes Robot Indonesia / AWS Certified Solutions Architect"
                value={certObj.name || ""}
                onChange={(e) =>
                  handleUpdateCertification(idx, "name", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Penyelenggara / Penerbit</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Amazon Web Services / Puspresnas"
                  value={certObj.issuer || ""}
                  onChange={(e) =>
                    handleUpdateCertification(idx, "issuer", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Tahun Perolehan</Label>
                <YearPicker
                  value={certObj.year || certObj.date || ""}
                  onChange={(val) =>
                    handleUpdateCertification(idx, "year", val)
                  }
                  placeholder="Pilih Tahun"
                />
              </div>
            </div>

            <div>
              <Label>Nomor Sertifikat (Opsional)</Label>
              <Input
                type="text"
                placeholder="Contoh: CERT-123456 / No. 8921 / ID: AWS-987654"
                value={certObj.credentialId || certObj.number || ""}
                onChange={(e) =>
                  handleUpdateCertification(idx, "credentialId", e.target.value)
                }
              />
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddCertification}
        className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Sertifikat / Prestasi</span>
      </Button>
    </div>
  );
};

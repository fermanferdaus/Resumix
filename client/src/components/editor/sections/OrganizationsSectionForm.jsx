import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { MonthYearPicker } from "../../ui/MonthYearPicker.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const OrganizationsSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragOrgIndex, setDragOrgIndex] = useState(null);
  const [dragOrgOverIndex, setDragOrgOverIndex] = useState(null);

  const handleAddOrganization = () => {
    const newOrganizations = [
      ...(data.organizations || []),
      {
        role: "",
        name: "",
        startDate: "",
        endDate: "",
        period: "",
        description: "",
      },
    ];
    onChange({ ...data, organizations: newOrganizations });
  };

  const handleUpdateOrganization = (index, field, value) => {
    const newOrganizations = [...(data.organizations || [])];
    newOrganizations[index] = { ...newOrganizations[index], [field]: value };
    onChange({ ...data, organizations: newOrganizations });
  };

  const handleDeleteOrganization = (index) => {
    const newOrganizations = (data.organizations || []).filter((_, i) => i !== index);
    onChange({ ...data, organizations: newOrganizations });
  };

  const confirmDeleteOrganization = (index) => {
    onRequestDelete({
      title: "Hapus Pengalaman Organisasi?",
      description:
        "Apakah Anda yakin ingin menghapus data organisasi ini dari resume Anda?",
      onConfirm: () => handleDeleteOrganization(index),
    });
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    setDragOrgIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `org-${index}`);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOrgOverIndex !== index) {
      setDragOrgOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragOrgIndex === null || dragOrgIndex === targetIndex) {
      setDragOrgIndex(null);
      setDragOrgOverIndex(null);
      return;
    }

    const newOrganizations = [...(data.organizations || [])];
    const [moved] = newOrganizations.splice(dragOrgIndex, 1);
    newOrganizations.splice(targetIndex, 0, moved);

    setDragOrgIndex(null);
    setDragOrgOverIndex(null);
    onChange({ ...data, organizations: newOrganizations });
  };

  const handleDragEnd = () => {
    setDragOrgIndex(null);
    setDragOrgOverIndex(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      {(data.organizations || []).map((org, idx) => {
        const isDragging = dragOrgIndex === idx;
        const isOver = dragOrgOverIndex === idx && dragOrgIndex !== idx;

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
                  title="Tahan dan geser untuk memindahkan urutan pengalaman organisasi"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Organisasi
                </span>
              </div>
              <button
                type="button"
                onClick={() => confirmDeleteOrganization(idx)}
                className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Jabatan / Peran *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Ketua Departemen Pengembangan SDM"
                  value={org.role || ""}
                  onChange={(e) =>
                    handleUpdateOrganization(idx, "role", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Nama Organisasi *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Himpunan Mahasiswa Teknik Komputer"
                  value={org.name || ""}
                  onChange={(e) =>
                    handleUpdateOrganization(idx, "name", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Periode Organisasi */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Periode Mulai</Label>
                  <MonthYearPicker
                    value={org.startDate || org.period?.split("–")[0]?.trim() || ""}
                    onChange={(val) => {
                      const end = org.endDate || (org.period?.split("–")[1]?.trim() || "");
                      handleUpdateOrganization(idx, "startDate", val);
                      handleUpdateOrganization(idx, "period", end ? `${val} – ${end}` : val);
                    }}
                  />
                </div>
                <div>
                  <Label>Periode Selesai</Label>
                  <MonthYearPicker
                    value={org.endDate || org.period?.split("–")[1]?.trim() || ""}
                    onChange={(val) => {
                      const start = org.startDate || (org.period?.split("–")[0]?.trim() || "");
                      handleUpdateOrganization(idx, "endDate", val);
                      handleUpdateOrganization(idx, "period", start ? `${start} – ${val}` : val);
                    }}
                    disabled={
                      String(org.endDate || org.period || "").toLowerCase().includes("sekarang")
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-0.5">
                <label className="inline-flex items-center gap-1.5 text-xs text-[#0f172a] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={
                      String(org.endDate || org.period || "").toLowerCase().includes("sekarang")
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const end = isChecked ? "Sekarang" : "";
                      const start = org.startDate || org.period?.split("–")[0]?.trim() || "";
                      handleUpdateOrganization(idx, "endDate", end);
                      handleUpdateOrganization(idx, "period", start ? `${start} – ${end}` : end);
                    }}
                    className="accent-[#af101a] w-3.5 h-3.5 rounded-none cursor-pointer"
                  />
                  <span className="text-xs text-[#af101a] font-semibold">
                    Masih aktif di organisasi ini
                  </span>
                </label>
              </div>
            </div>

            <div>
              <Label>Keterangan Tambahan / Prestasi (Opsional)</Label>
              <Input
                type="text"
                placeholder="Contoh: Memimpin riset dan pengembangan robotika..."
                value={org.description || ""}
                onChange={(e) =>
                  handleUpdateOrganization(idx, "description", e.target.value)
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
        onClick={handleAddOrganization}
        className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Pengalaman Organisasi</span>
      </Button>
    </div>
  );
};

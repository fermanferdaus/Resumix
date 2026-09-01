import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { MonthYearPicker } from "../../ui/MonthYearPicker.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const ExperiencesSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragExpIndex, setDragExpIndex] = useState(null);
  const [dragExpOverIndex, setDragExpOverIndex] = useState(null);

  const [dragBulletState, setDragBulletState] = useState({
    expIndex: null,
    fromIndex: null,
    overIndex: null,
  });

  const handleAddExperience = () => {
    const newExperiences = [
      ...(data.experiences || []),
      {
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "Sekarang",
        bullets: [""],
      },
    ];
    onChange({ ...data, experiences: newExperiences });
  };

  const handleUpdateExperience = (index, field, value) => {
    const newExperiences = [...(data.experiences || [])];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onChange({ ...data, experiences: newExperiences });
  };

  const handleDeleteExperience = (index) => {
    const newExperiences = (data.experiences || []).filter((_, i) => i !== index);
    onChange({ ...data, experiences: newExperiences });
  };

  const confirmDeleteExperience = (index) => {
    onRequestDelete({
      title: "Hapus Pengalaman Kerja?",
      description:
        "Apakah Anda yakin ingin menghapus data pengalaman kerja ini dari resume Anda?",
      onConfirm: () => handleDeleteExperience(index),
    });
  };

  const handleAddBullet = (expIndex) => {
    const newExperiences = [...(data.experiences || [])];
    newExperiences[expIndex].bullets = [
      ...(newExperiences[expIndex].bullets || []),
      "",
    ];
    onChange({ ...data, experiences: newExperiences });
  };

  const handleUpdateBullet = (expIndex, bulletIndex, value) => {
    const newExperiences = [...(data.experiences || [])];
    const newBullets = [...(newExperiences[expIndex].bullets || [])];
    newBullets[bulletIndex] = value;
    newExperiences[expIndex].bullets = newBullets;
    onChange({ ...data, experiences: newExperiences });
  };

  const handleDeleteBullet = (expIndex, bulletIndex) => {
    const newExperiences = [...(data.experiences || [])];
    newExperiences[expIndex].bullets = (
      newExperiences[expIndex].bullets || []
    ).filter((_, i) => i !== bulletIndex);
    onChange({ ...data, experiences: newExperiences });
  };

  const confirmDeleteBullet = (expIndex, bulletIndex) => {
    onRequestDelete({
      title: "Hapus Poin Deskripsi Pekerjaan?",
      description: "Apakah Anda yakin ingin menghapus poin tanggung jawab/pencapaian ini?",
      onConfirm: () => handleDeleteBullet(expIndex, bulletIndex),
    });
  };

  // Experience Drag & Drop
  const handleExpDragStart = (e, index) => {
    setDragExpIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `exp-${index}`);
  };

  const handleExpDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragExpOverIndex !== index) {
      setDragExpOverIndex(index);
    }
  };

  const handleExpDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragExpIndex === null || dragExpIndex === targetIndex) {
      setDragExpIndex(null);
      setDragExpOverIndex(null);
      return;
    }

    const newExperiences = [...(data.experiences || [])];
    const [moved] = newExperiences.splice(dragExpIndex, 1);
    newExperiences.splice(targetIndex, 0, moved);

    setDragExpIndex(null);
    setDragExpOverIndex(null);
    onChange({ ...data, experiences: newExperiences });
  };

  const handleExpDragEnd = () => {
    setDragExpIndex(null);
    setDragExpOverIndex(null);
  };

  // Bullet Drag & Drop
  const handleBulletDragStart = (e, expIndex, bulletIndex) => {
    e.stopPropagation();
    setDragBulletState({ expIndex, fromIndex: bulletIndex, overIndex: bulletIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `exp-bullet-${expIndex}-${bulletIndex}`);
  };

  const handleBulletDragOver = (e, expIndex, bulletIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (
      dragBulletState.expIndex === expIndex &&
      dragBulletState.overIndex !== bulletIndex
    ) {
      setDragBulletState((prev) => ({ ...prev, overIndex: bulletIndex }));
    }
  };

  const handleBulletDrop = (e, expIndex, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragBulletState.expIndex === expIndex &&
      dragBulletState.fromIndex !== null &&
      dragBulletState.fromIndex !== targetIndex
    ) {
      const newExperiences = [...(data.experiences || [])];
      const newBullets = [...(newExperiences[expIndex].bullets || [])];
      const [moved] = newBullets.splice(dragBulletState.fromIndex, 1);
      newBullets.splice(targetIndex, 0, moved);
      newExperiences[expIndex].bullets = newBullets;
      onChange({ ...data, experiences: newExperiences });
    }
    setDragBulletState({ expIndex: null, fromIndex: null, overIndex: null });
  };

  const handleBulletDragEnd = () => {
    setDragBulletState({ expIndex: null, fromIndex: null, overIndex: null });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      {(data.experiences || []).map((exp, idx) => {
        const isDragging = dragExpIndex === idx;
        const isOver = dragExpOverIndex === idx && dragExpIndex !== idx;

        return (
          <div
            key={idx}
            draggable={true}
            onDragStart={(e) => handleExpDragStart(e, idx)}
            onDragOver={(e) => handleExpDragOver(e, idx)}
            onDrop={(e) => handleExpDrop(e, idx)}
            onDragEnd={handleExpDragEnd}
            className={`p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3 transition-all ${
              isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
            } ${isOver ? "border-t-2 border-t-[#af101a] bg-[#fef2f2]/50" : ""}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 transition-colors"
                  title="Tahan dan geser untuk memindahkan urutan pengalaman kerja"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Pengalaman Kerja
                </span>
              </div>
              <button
                type="button"
                onClick={() => confirmDeleteExperience(idx)}
                className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Posisi / Jabatan *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Senior Frontend Engineer"
                  value={exp.role || ""}
                  onChange={(e) =>
                    handleUpdateExperience(idx, "role", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Nama Perusahaan *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: PT Teknologi Bangsa Indonesia"
                  value={exp.company || ""}
                  onChange={(e) =>
                    handleUpdateExperience(idx, "company", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Lokasi Perusahaan</Label>
              <Input
                type="text"
                placeholder="Contoh: Jakarta Pusat, Indonesia"
                value={exp.location || ""}
                onChange={(e) =>
                  handleUpdateExperience(idx, "location", e.target.value)
                }
              />
            </div>

            {/* Periode Kerja */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Periode Mulai</Label>
                  <MonthYearPicker
                    value={exp.startDate || ""}
                    onChange={(val) =>
                      handleUpdateExperience(idx, "startDate", val)
                    }
                  />
                </div>
                <div>
                  <Label>Periode Selesai</Label>
                  <MonthYearPicker
                    value={exp.endDate || ""}
                    onChange={(val) =>
                      handleUpdateExperience(idx, "endDate", val)
                    }
                    disabled={
                      String(exp.endDate || "").toLowerCase() === "sekarang"
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-0.5">
                <label className="inline-flex items-center gap-1.5 text-xs text-[#0f172a] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={
                      String(exp.endDate || "").toLowerCase() === "sekarang"
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleUpdateExperience(
                        idx,
                        "endDate",
                        isChecked ? "Sekarang" : ""
                      );
                    }}
                    className="accent-[#af101a] w-3.5 h-3.5 rounded-none cursor-pointer"
                  />
                  <span className="text-xs text-[#af101a] font-semibold">
                    Masih aktif bekerja di posisi ini
                  </span>
                </label>
              </div>
            </div>

            {/* Bullet Points Deskripsi */}
            <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
              <Label>Poin Tanggung Jawab & Pencapaian</Label>
              {(exp.bullets || []).map((bullet, bIdx) => {
                const isBulletDragging =
                  dragBulletState.expIndex === idx &&
                  dragBulletState.fromIndex === bIdx;
                const isBulletOver =
                  dragBulletState.expIndex === idx &&
                  dragBulletState.overIndex === bIdx &&
                  dragBulletState.fromIndex !== bIdx;

                return (
                  <div
                    key={bIdx}
                    draggable={true}
                    onDragStart={(e) => handleBulletDragStart(e, idx, bIdx)}
                    onDragOver={(e) => handleBulletDragOver(e, idx, bIdx)}
                    onDrop={(e) => handleBulletDrop(e, idx, bIdx)}
                    onDragEnd={handleBulletDragEnd}
                    className={`flex gap-1.5 items-start transition-all ${
                      isBulletDragging
                        ? "opacity-30 border border-dashed border-[#af101a]"
                        : ""
                    } ${isBulletOver ? "border-t-2 border-t-[#af101a]" : ""}`}
                  >
                    <span
                      className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 mt-1 flex-shrink-0"
                      title="Tahan dan geser untuk memindahkan urutan poin"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Merancang dan membangun aplikasi web fullstack..."
                      value={bullet}
                      onChange={(e) =>
                        handleUpdateBullet(idx, bIdx, e.target.value)
                      }
                      className="flex-1 bg-white border border-[#e2e8f0] text-xs text-[#0f172a] p-2 rounded-none outline-none focus:border-[#af101a] transition-colors resize-y leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => confirmDeleteBullet(idx, bIdx)}
                      className="text-[#5d5e61] hover:text-[#ba1a1a] p-1.5 mt-1 cursor-pointer"
                      title="Hapus poin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleAddBullet(idx)}
                className="text-xs text-[#af101a] font-semibold hover:bg-[#fef2f2] rounded-none px-2 py-1 h-auto"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Tambah Poin Deskripsi</span>
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddExperience}
        className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Pengalaman Kerja</span>
      </Button>
    </div>
  );
};

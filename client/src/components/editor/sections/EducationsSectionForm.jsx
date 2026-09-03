import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { MonthYearPicker } from "../../ui/MonthYearPicker.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const EducationsSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragEduIndex, setDragEduIndex] = useState(null);
  const [dragEduOverIndex, setDragEduOverIndex] = useState(null);

  const [dragBulletState, setDragBulletState] = useState({
    eduIndex: null,
    fromIndex: null,
    overIndex: null,
  });

  const handleAddEducation = () => {
    const newEducations = [
      ...(data.educations || []),
      {
        degree: "",
        gpa: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [],
      },
    ];
    onChange({ ...data, educations: newEducations });
  };

  const handleUpdateEducation = (index, field, value) => {
    const newEducations = [...(data.educations || [])];
    newEducations[index] = { ...newEducations[index], [field]: value };
    onChange({ ...data, educations: newEducations });
  };

  const handleDeleteEducation = (index) => {
    const newEducations = (data.educations || []).filter((_, i) => i !== index);
    onChange({ ...data, educations: newEducations });
  };

  const confirmDeleteEducation = (index) => {
    onRequestDelete({
      title: "Hapus Riwayat Pendidikan?",
      description:
        "Apakah Anda yakin ingin menghapus data pendidikan ini dari resume Anda?",
      onConfirm: () => handleDeleteEducation(index),
    });
  };

  const handleAddEduBullet = (eduIndex) => {
    const newEducations = [...(data.educations || [])];
    newEducations[eduIndex].bullets = [
      ...(newEducations[eduIndex].bullets || []),
      "",
    ];
    onChange({ ...data, educations: newEducations });
  };

  const handleUpdateEduBullet = (eduIndex, bulletIndex, value) => {
    const newEducations = [...(data.educations || [])];
    const newBullets = [...(newEducations[eduIndex].bullets || [])];
    newBullets[bulletIndex] = value;
    newEducations[eduIndex].bullets = newBullets;
    onChange({ ...data, educations: newEducations });
  };

  const handleDeleteEduBullet = (eduIndex, bulletIndex) => {
    const newEducations = [...(data.educations || [])];
    newEducations[eduIndex].bullets = (
      newEducations[eduIndex].bullets || []
    ).filter((_, i) => i !== bulletIndex);
    onChange({ ...data, educations: newEducations });
  };

  const confirmDeleteEduBullet = (eduIndex, bulletIndex) => {
    onRequestDelete({
      title: "Hapus Poin Prestasi/Fokus?",
      description: "Apakah Anda yakin ingin menghapus poin prestasi atau fokus akademik ini?",
      onConfirm: () => handleDeleteEduBullet(eduIndex, bulletIndex),
    });
  };

  // Education card Drag & Drop
  const handleEduDragStart = (e, index) => {
    setDragEduIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `edu-${index}`);
  };

  const handleEduDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragEduOverIndex !== index) {
      setDragEduOverIndex(index);
    }
  };

  const handleEduDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragEduIndex === null || dragEduIndex === targetIndex) {
      setDragEduIndex(null);
      setDragEduOverIndex(null);
      return;
    }

    const newEducations = [...(data.educations || [])];
    const [moved] = newEducations.splice(dragEduIndex, 1);
    newEducations.splice(targetIndex, 0, moved);

    setDragEduIndex(null);
    setDragEduOverIndex(null);
    onChange({ ...data, educations: newEducations });
  };

  const handleEduDragEnd = () => {
    setDragEduIndex(null);
    setDragEduOverIndex(null);
  };

  // Bullet Drag & Drop
  const handleBulletDragStart = (e, eduIndex, bulletIndex) => {
    e.stopPropagation();
    setDragBulletState({ eduIndex, fromIndex: bulletIndex, overIndex: bulletIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `edu-bullet-${eduIndex}-${bulletIndex}`);
  };

  const handleBulletDragOver = (e, eduIndex, bulletIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (
      dragBulletState.eduIndex === eduIndex &&
      dragBulletState.overIndex !== bulletIndex
    ) {
      setDragBulletState((prev) => ({ ...prev, overIndex: bulletIndex }));
    }
  };

  const handleBulletDrop = (e, eduIndex, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragBulletState.eduIndex === eduIndex &&
      dragBulletState.fromIndex !== null &&
      dragBulletState.fromIndex !== targetIndex
    ) {
      const newEducations = [...(data.educations || [])];
      const newBullets = [...(newEducations[eduIndex].bullets || [])];
      const [moved] = newBullets.splice(dragBulletState.fromIndex, 1);
      newBullets.splice(targetIndex, 0, moved);
      newEducations[eduIndex].bullets = newBullets;
      onChange({ ...data, educations: newEducations });
    }
    setDragBulletState({ eduIndex: null, fromIndex: null, overIndex: null });
  };

  const handleBulletDragEnd = () => {
    setDragBulletState({ eduIndex: null, fromIndex: null, overIndex: null });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      {(data.educations || []).map((edu, idx) => {
        const isDragging = dragEduIndex === idx;
        const isOver = dragEduOverIndex === idx && dragEduIndex !== idx;

        return (
          <div
            key={idx}
            draggable={true}
            onDragStart={(e) => handleEduDragStart(e, idx)}
            onDragOver={(e) => handleEduDragOver(e, idx)}
            onDrop={(e) => handleEduDrop(e, idx)}
            onDragEnd={handleEduDragEnd}
            className={`p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3 transition-all ${
              isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
            } ${isOver ? "border-t-2 border-t-[#af101a] bg-[#fef2f2]/50" : ""}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 transition-colors"
                  title="Tahan dan geser untuk memindahkan urutan riwayat pendidikan"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Pendidikan
                </span>
              </div>
              <button
                type="button"
                onClick={() => confirmDeleteEducation(idx)}
                className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Jenjang & Jurusan *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: S1 Teknik Informatika / SMK Rekayasa Perangkat Lunak"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleUpdateEducation(idx, "degree", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Nilai Akhir / IPK</Label>
                <Input
                  type="text"
                  placeholder="Contoh: 3.80 / 4.00 atau 88.5"
                  value={edu.gpa || ""}
                  onChange={(e) =>
                    handleUpdateEducation(idx, "gpa", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Nama Sekolah / Kampus *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Universitas Indonesia / Institut Teknologi Bandung"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    handleUpdateEducation(idx, "institution", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Lokasi (Kota, Negara)</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Depok, Indonesia / Bandung, Indonesia"
                  value={edu.location || ""}
                  onChange={(e) =>
                    handleUpdateEducation(idx, "location", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Periode Studi */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Periode Mulai</Label>
                  <MonthYearPicker
                    value={edu.startDate || ""}
                    onChange={(val) =>
                      handleUpdateEducation(idx, "startDate", val)
                    }
                  />
                </div>
                <div>
                  <Label>Periode Selesai</Label>
                  <MonthYearPicker
                    value={edu.endDate || ""}
                    onChange={(val) =>
                      handleUpdateEducation(idx, "endDate", val)
                    }
                    disabled={
                      String(edu.endDate || "").toLowerCase() === "sekarang"
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-0.5">
                <label className="inline-flex items-center gap-1.5 text-xs text-[#0f172a] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={
                      String(edu.endDate || "").toLowerCase() === "sekarang"
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleUpdateEducation(
                        idx,
                        "endDate",
                        isChecked ? "Sekarang" : ""
                      );
                    }}
                    className="accent-[#af101a] w-3.5 h-3.5 rounded-none cursor-pointer"
                  />
                  <span className="text-xs text-[#af101a] font-semibold">
                    Masih menempuh studi di sini
                  </span>
                </label>
              </div>
            </div>

            {/* Bullet Points Deskripsi / Prestasi / Fokus Pendidikan */}
            <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
              <Label>Poin Deskripsi / Prestasi / Fokus Akademik (Opsional)</Label>
              {(edu.bullets || []).map((bullet, bIdx) => {
                const isBulletDragging =
                  dragBulletState.eduIndex === idx &&
                  dragBulletState.fromIndex === bIdx;
                const isBulletOver =
                  dragBulletState.eduIndex === idx &&
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
                      placeholder="Contoh: Meraih Peringkat 1 paralel jurusan IPA / Judul Skripsi / Fokus kejuruan..."
                      value={bullet}
                      onChange={(e) =>
                        handleUpdateEduBullet(idx, bIdx, e.target.value)
                      }
                      className="flex-1 bg-white border border-[#e2e8f0] text-xs text-[#0f172a] p-2 rounded-none outline-none focus:border-[#af101a] transition-colors resize-y leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => confirmDeleteEduBullet(idx, bIdx)}
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
                onClick={() => handleAddEduBullet(idx)}
                className="text-xs text-[#af101a] font-semibold hover:bg-[#fef2f2] rounded-none px-2 py-1 h-auto"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Tambah Poin Deskripsi / Prestasi</span>
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddEducation}
        className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Riwayat Pendidikan</span>
      </Button>
    </div>
  );
};

import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { MonthYearPicker } from "../../ui/MonthYearPicker.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const ProjectsSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragProjIndex, setDragProjIndex] = useState(null);
  const [dragProjOverIndex, setDragProjOverIndex] = useState(null);

  const [dragBulletState, setDragBulletState] = useState({
    projIndex: null,
    fromIndex: null,
    overIndex: null,
  });

  const handleAddProject = () => {
    const newProjects = [
      ...(data.projects || []),
      {
        name: "",
        role: "",
        link: "",
        technologies: "",
        startDate: "",
        endDate: "",
        bullets: [""],
      },
    ];
    onChange({ ...data, projects: newProjects });
  };

  const handleUpdateProject = (index, field, value) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...data, projects: newProjects });
  };

  const handleDeleteProject = (index) => {
    const newProjects = (data.projects || []).filter((_, i) => i !== index);
    onChange({ ...data, projects: newProjects });
  };

  const confirmDeleteProject = (index) => {
    onRequestDelete({
      title: "Hapus Proyek?",
      description:
        "Apakah Anda yakin ingin menghapus data proyek ini dari resume Anda?",
      onConfirm: () => handleDeleteProject(index),
    });
  };

  const handleAddBullet = (projIndex) => {
    const newProjects = [...(data.projects || [])];
    newProjects[projIndex].bullets = [
      ...(newProjects[projIndex].bullets || []),
      "",
    ];
    onChange({ ...data, projects: newProjects });
  };

  const handleUpdateBullet = (projIndex, bulletIndex, value) => {
    const newProjects = [...(data.projects || [])];
    const newBullets = [...(newProjects[projIndex].bullets || [])];
    newBullets[bulletIndex] = value;
    newProjects[projIndex].bullets = newBullets;
    onChange({ ...data, projects: newProjects });
  };

  const handleDeleteBullet = (projIndex, bulletIndex) => {
    const newProjects = [...(data.projects || [])];
    newProjects[projIndex].bullets = (
      newProjects[projIndex].bullets || []
    ).filter((_, i) => i !== bulletIndex);
    onChange({ ...data, projects: newProjects });
  };

  const confirmDeleteBullet = (projIndex, bulletIndex) => {
    onRequestDelete({
      title: "Hapus Poin Deskripsi Proyek?",
      description: "Apakah Anda yakin ingin menghapus poin tanggung jawab/pencapaian proyek ini?",
      onConfirm: () => handleDeleteBullet(projIndex, bulletIndex),
    });
  };

  // Project Drag & Drop
  const handleProjDragStart = (e, index) => {
    setDragProjIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `proj-${index}`);
  };

  const handleProjDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragProjOverIndex !== index) {
      setDragProjOverIndex(index);
    }
  };

  const handleProjDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragProjIndex === null || dragProjIndex === targetIndex) {
      setDragProjIndex(null);
      setDragProjOverIndex(null);
      return;
    }

    const newProjects = [...(data.projects || [])];
    const [moved] = newProjects.splice(dragProjIndex, 1);
    newProjects.splice(targetIndex, 0, moved);

    setDragProjIndex(null);
    setDragProjOverIndex(null);
    onChange({ ...data, projects: newProjects });
  };

  const handleProjDragEnd = () => {
    setDragProjIndex(null);
    setDragProjOverIndex(null);
  };

  // Bullet Drag & Drop
  const handleBulletDragStart = (e, projIndex, bulletIndex) => {
    e.stopPropagation();
    setDragBulletState({ projIndex, fromIndex: bulletIndex, overIndex: bulletIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `proj-bullet-${projIndex}-${bulletIndex}`);
  };

  const handleBulletDragOver = (e, projIndex, bulletIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (
      dragBulletState.projIndex === projIndex &&
      dragBulletState.overIndex !== bulletIndex
    ) {
      setDragBulletState((prev) => ({ ...prev, overIndex: bulletIndex }));
    }
  };

  const handleBulletDrop = (e, projIndex, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragBulletState.projIndex === projIndex &&
      dragBulletState.fromIndex !== null &&
      dragBulletState.fromIndex !== targetIndex
    ) {
      const newProjects = [...(data.projects || [])];
      const newBullets = [...(newProjects[projIndex].bullets || [])];
      const [moved] = newBullets.splice(dragBulletState.fromIndex, 1);
      newBullets.splice(targetIndex, 0, moved);
      newProjects[projIndex].bullets = newBullets;
      onChange({ ...data, projects: newProjects });
    }
    setDragBulletState({ projIndex: null, fromIndex: null, overIndex: null });
  };

  const handleBulletDragEnd = () => {
    setDragBulletState({ projIndex: null, fromIndex: null, overIndex: null });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      {(data.projects || []).map((proj, idx) => {
        const isDragging = dragProjIndex === idx;
        const isOver = dragProjOverIndex === idx && dragProjIndex !== idx;

        return (
          <div
            key={idx}
            draggable={true}
            onDragStart={(e) => handleProjDragStart(e, idx)}
            onDragOver={(e) => handleProjDragOver(e, idx)}
            onDrop={(e) => handleProjDrop(e, idx)}
            onDragEnd={handleProjDragEnd}
            className={`p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3 transition-all ${
              isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
            } ${isOver ? "border-t-2 border-t-[#af101a] bg-[#fef2f2]/50" : ""}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 transition-colors"
                  title="Tahan dan geser untuk memindahkan urutan proyek"
                >
                  <GripVertical className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Proyek
                </span>
              </div>
              <button
                type="button"
                onClick={() => confirmDeleteProject(idx)}
                className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            <div>
              <Label>Nama Proyek *</Label>
              <Input
                type="text"
                placeholder="Contoh: Sistem Informasi Manajemen Rumah Sakit / E-Commerce Mobile App"
                value={proj.name || ""}
                onChange={(e) =>
                  handleUpdateProject(idx, "name", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Peran (Opsional)</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Lead Frontend Developer / Full Stack Developer"
                  value={proj.role || ""}
                  onChange={(e) =>
                    handleUpdateProject(idx, "role", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Tautan Proyek (Opsional)</Label>
                <Input
                  type="text"
                  placeholder="Contoh: https://github.com/user/project atau https://app.com"
                  value={proj.link || ""}
                  onChange={(e) =>
                    handleUpdateProject(idx, "link", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Teknologi / Tools yang Digunakan (Opsional)</Label>
              <Input
                type="text"
                placeholder="Contoh: React, TypeScript, Express.js, PostgreSQL, Docker, Tailwind CSS"
                value={proj.technologies || ""}
                onChange={(e) =>
                  handleUpdateProject(idx, "technologies", e.target.value)
                }
              />
            </div>

            {/* Periode Pengerjaan Proyek */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Periode Mulai</Label>
                  <MonthYearPicker
                    value={proj.startDate || ""}
                    onChange={(val) =>
                      handleUpdateProject(idx, "startDate", val)
                    }
                  />
                </div>
                <div>
                  <Label>Periode Selesai</Label>
                  <MonthYearPicker
                    value={proj.endDate || ""}
                    onChange={(val) =>
                      handleUpdateProject(idx, "endDate", val)
                    }
                    disabled={
                      String(proj.endDate || "").toLowerCase() === "sekarang"
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-end pt-0.5">
                <label className="inline-flex items-center gap-1.5 text-xs text-[#0f172a] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={
                      String(proj.endDate || "").toLowerCase() === "sekarang"
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleUpdateProject(
                        idx,
                        "endDate",
                        isChecked ? "Sekarang" : ""
                      );
                    }}
                    className="accent-[#af101a] w-3.5 h-3.5 rounded-none cursor-pointer"
                  />
                  <span className="text-xs text-[#af101a] font-semibold">
                    Masih aktif mengembangkan proyek ini
                  </span>
                </label>
              </div>
            </div>

            {/* Bullet Points Deskripsi & Fitur Utama */}
            <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
              <Label>Poin Deskripsi / Fitur / Dampak Proyek</Label>
              {(proj.bullets || []).map((bullet, bIdx) => {
                const isBulletDragging =
                  dragBulletState.projIndex === idx &&
                  dragBulletState.fromIndex === bIdx;
                const isBulletOver =
                  dragBulletState.projIndex === idx &&
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
                      placeholder="Contoh: Mengembangkan fitur autentikasi multi-factor dan integrasi payment gateway..."
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
                <span>Tambah Poin Deskripsi Proyek</span>
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddProject}
        className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah Proyek Baru</span>
      </Button>
    </div>
  );
};

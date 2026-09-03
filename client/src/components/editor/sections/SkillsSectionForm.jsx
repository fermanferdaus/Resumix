import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const SkillsSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragHardIndex, setDragHardIndex] = useState(null);
  const [dragHardOverIndex, setDragHardOverIndex] = useState(null);

  const [dragSoftIndex, setDragSoftIndex] = useState(null);
  const [dragSoftOverIndex, setDragSoftOverIndex] = useState(null);

  // Hard Skills Handlers
  const handleAddHardSkill = () => {
    const newHardSkills = [
      ...(data.skills?.hardSkills || []),
      { category: "", items: "" },
    ];
    onChange({
      ...data,
      skills: { ...(data.skills || {}), hardSkills: newHardSkills },
    });
  };

  const handleUpdateHardSkill = (index, field, value) => {
    const newHardSkills = [...(data.skills?.hardSkills || [])];
    newHardSkills[index] = { ...newHardSkills[index], [field]: value };
    onChange({
      ...data,
      skills: { ...(data.skills || {}), hardSkills: newHardSkills },
    });
  };

  const handleDeleteHardSkill = (index) => {
    const newHardSkills = (data.skills?.hardSkills || []).filter(
      (_, i) => i !== index
    );
    onChange({
      ...data,
      skills: { ...(data.skills || {}), hardSkills: newHardSkills },
    });
  };

  const confirmDeleteHardSkill = (index) => {
    onRequestDelete({
      title: "Hapus Entri Keahlian Teknis?",
      description: "Apakah Anda yakin ingin menghapus kelompok keahlian teknis ini?",
      onConfirm: () => handleDeleteHardSkill(index),
    });
  };

  // Soft Skills Handlers
  const handleAddSoftSkill = () => {
    const newSoftSkills = [...(data.skills?.softSkills || []), ""];
    onChange({
      ...data,
      skills: { ...(data.skills || {}), softSkills: newSoftSkills },
    });
  };

  const handleUpdateSoftSkill = (index, value) => {
    const newSoftSkills = [...(data.skills?.softSkills || [])];
    newSoftSkills[index] = value;
    onChange({
      ...data,
      skills: { ...(data.skills || {}), softSkills: newSoftSkills },
    });
  };

  const handleDeleteSoftSkill = (index) => {
    const newSoftSkills = (data.skills?.softSkills || []).filter(
      (_, i) => i !== index
    );
    onChange({
      ...data,
      skills: { ...(data.skills || {}), softSkills: newSoftSkills },
    });
  };

  const confirmDeleteSoftSkill = (index) => {
    onRequestDelete({
      title: "Hapus Soft Skill?",
      description: "Apakah Anda yakin ingin menghapus soft skill ini?",
      onConfirm: () => handleDeleteSoftSkill(index),
    });
  };

  // Hard Skill Drag & Drop
  const handleHardDragStart = (e, index) => {
    setDragHardIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `hard-${index}`);
  };

  const handleHardDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragHardOverIndex !== index) {
      setDragHardOverIndex(index);
    }
  };

  const handleHardDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragHardIndex === null || dragHardIndex === targetIndex) {
      setDragHardIndex(null);
      setDragHardOverIndex(null);
      return;
    }

    const newHardSkills = [...(data.skills?.hardSkills || [])];
    const [moved] = newHardSkills.splice(dragHardIndex, 1);
    newHardSkills.splice(targetIndex, 0, moved);

    setDragHardIndex(null);
    setDragHardOverIndex(null);

    onChange({
      ...data,
      skills: { ...(data.skills || {}), hardSkills: newHardSkills },
    });
  };

  const handleHardDragEnd = () => {
    setDragHardIndex(null);
    setDragHardOverIndex(null);
  };

  // Soft Skill Drag & Drop
  const handleSoftDragStart = (e, index) => {
    setDragSoftIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `soft-${index}`);
  };

  const handleSoftDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragSoftOverIndex !== index) {
      setDragSoftOverIndex(index);
    }
  };

  const handleSoftDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragSoftIndex === null || dragSoftIndex === targetIndex) {
      setDragSoftIndex(null);
      setDragSoftOverIndex(null);
      return;
    }

    const newSoftSkills = [...(data.skills?.softSkills || [])];
    const [moved] = newSoftSkills.splice(dragSoftIndex, 1);
    newSoftSkills.splice(targetIndex, 0, moved);

    setDragSoftIndex(null);
    setDragSoftOverIndex(null);

    onChange({
      ...data,
      skills: { ...(data.skills || {}), softSkills: newSoftSkills },
    });
  };

  const handleSoftDragEnd = () => {
    setDragSoftIndex(null);
    setDragSoftOverIndex(null);
  };

  const hardSkills = data.skills?.hardSkills || [];
  const softSkills = data.skills?.softSkills || [];

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-150">
      {/* Hard Skills */}
      <div className="space-y-3">
        <div>
          <span className="text-xs font-mono-code uppercase font-bold text-[#0f172a] block">
            HARD SKILL / KEAHLIAN TEKNIS
          </span>
        </div>

        {hardSkills.map((h, idx) => {
          const isDragging = dragHardIndex === idx;
          const isOver = dragHardOverIndex === idx && dragHardIndex !== idx;

          return (
            <div
              key={idx}
              draggable={true}
              onDragStart={(e) => handleHardDragStart(e, idx)}
              onDragOver={(e) => handleHardDragOver(e, idx)}
              onDrop={(e) => handleHardDrop(e, idx)}
              onDragEnd={handleHardDragEnd}
              className={`p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-none space-y-2 relative transition-all ${
                isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
              } ${isOver ? "border-t-2 border-t-[#af101a] bg-[#fef2f2]/50" : ""}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span
                    className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-0.5 -ml-0.5 transition-colors"
                    title="Tahan dan geser untuk memindahkan urutan keahlian"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono-code font-semibold text-[#af101a]">
                    Entri Keahlian #{idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => confirmDeleteHardSkill(idx)}
                  className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <Label>Nama Kategori</Label>
                  <Input
                    type="text"
                    placeholder="Kosongkan jika tanpa kategori"
                    value={h.category || ""}
                    onChange={(e) =>
                      handleUpdateHardSkill(idx, "category", e.target.value)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Keahlian *</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: React, Next.js, Express.js, TypeScript, PostgreSQL"
                    value={Array.isArray(h.items) ? h.items.join(", ") : h.items || ""}
                    onChange={(e) =>
                      handleUpdateHardSkill(idx, "items", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddHardSkill}
          className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Keahlian / Kategori</span>
        </Button>
      </div>

      {/* Soft Skills */}
      <div className="space-y-3 pt-3 border-t border-[#e2e8f0]">
        <div>
          <span className="text-xs font-mono-code uppercase font-bold text-[#0f172a] block">
            SOFT SKILL
          </span>
        </div>

        {softSkills.map((s, idx) => {
          const isDragging = dragSoftIndex === idx;
          const isOver = dragSoftOverIndex === idx && dragSoftIndex !== idx;

          return (
            <div
              key={idx}
              draggable={true}
              onDragStart={(e) => handleSoftDragStart(e, idx)}
              onDragOver={(e) => handleSoftDragOver(e, idx)}
              onDrop={(e) => handleSoftDrop(e, idx)}
              onDragEnd={handleSoftDragEnd}
              className={`flex gap-2 items-center transition-all ${
                isDragging ? "opacity-30 border border-dashed border-[#af101a]" : ""
              } ${isOver ? "border-t-2 border-t-[#af101a]" : ""}`}
            >
              <span
                className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 flex-shrink-0"
                title="Tahan dan geser untuk memindahkan urutan soft skill"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-[#af101a]">•</span>
              <Input
                type="text"
                placeholder="Contoh: Problem Solving, Critical Thinking, Team Leadership"
                value={typeof s === "string" ? s : s.name || ""}
                onChange={(e) => handleUpdateSoftSkill(idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => confirmDeleteSoftSkill(idx)}
                className="text-[#5d5e61] hover:text-[#ba1a1a] p-1.5 cursor-pointer"
                title="Hapus soft skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSoftSkill}
          className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs mt-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Soft Skill</span>
        </Button>
      </div>
    </div>
  );
};

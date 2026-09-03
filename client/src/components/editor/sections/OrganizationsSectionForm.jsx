import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { MonthYearPicker } from "../../ui/MonthYearPicker.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const OrganizationsSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragOrgIndex, setDragOrgIndex] = useState(null);
  const [dragOrgOverIndex, setDragOrgOverIndex] = useState(null);
  const [dragBulletState, setDragBulletState] = useState({
    orgIndex: null,
    fromIndex: null,
    overIndex: null,
  });

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
        bullets: [""],
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

  // Bullet Handlers
  const handleAddBullet = (orgIndex) => {
    const newOrganizations = [...(data.organizations || [])];
    const org = newOrganizations[orgIndex];
    const currentBullets = Array.isArray(org.bullets)
      ? [...org.bullets]
      : org.description
      ? [org.description]
      : [];
    newOrganizations[orgIndex] = {
      ...org,
      bullets: [...currentBullets, ""],
    };
    onChange({ ...data, organizations: newOrganizations });
  };

  const handleUpdateBullet = (orgIndex, bulletIndex, value) => {
    const newOrganizations = [...(data.organizations || [])];
    const org = newOrganizations[orgIndex];
    const currentBullets = Array.isArray(org.bullets)
      ? [...org.bullets]
      : org.description
      ? [org.description]
      : [""];
    currentBullets[bulletIndex] = value;
    newOrganizations[orgIndex] = {
      ...org,
      bullets: currentBullets,
      description: currentBullets[0] || "",
    };
    onChange({ ...data, organizations: newOrganizations });
  };

  const handleDeleteBullet = (orgIndex, bulletIndex) => {
    const newOrganizations = [...(data.organizations || [])];
    const org = newOrganizations[orgIndex];
    const currentBullets = (org.bullets || []).filter((_, i) => i !== bulletIndex);
    newOrganizations[orgIndex] = {
      ...org,
      bullets: currentBullets,
      description: currentBullets[0] || "",
    };
    onChange({ ...data, organizations: newOrganizations });
  };

  const confirmDeleteBullet = (orgIndex, bulletIndex) => {
    const org = data.organizations?.[orgIndex];
    const currentBullets = org?.bullets || [];
    if (currentBullets[bulletIndex]?.trim()) {
      onRequestDelete({
        title: "Hapus Poin Organisasi?",
        description: "Apakah Anda yakin ingin menghapus poin kegiatan organisasi ini?",
        onConfirm: () => handleDeleteBullet(orgIndex, bulletIndex),
      });
    } else {
      handleDeleteBullet(orgIndex, bulletIndex);
    }
  };

  // Drag and Drop Bullet Points
  const handleBulletDragStart = (e, orgIndex, bulletIndex) => {
    e.stopPropagation();
    setDragBulletState({ orgIndex, fromIndex: bulletIndex, overIndex: bulletIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `org-bullet-${orgIndex}-${bulletIndex}`);
  };

  const handleBulletDragOver = (e, orgIndex, bulletIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (
      dragBulletState.orgIndex === orgIndex &&
      dragBulletState.overIndex !== bulletIndex
    ) {
      setDragBulletState((prev) => ({ ...prev, overIndex: bulletIndex }));
    }
  };

  const handleBulletDrop = (e, orgIndex, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragBulletState.orgIndex === orgIndex &&
      dragBulletState.fromIndex !== null &&
      dragBulletState.fromIndex !== targetIndex
    ) {
      const newOrganizations = [...(data.organizations || [])];
      const org = newOrganizations[orgIndex];
      const newBullets = [...(org.bullets || [])];
      const [moved] = newBullets.splice(dragBulletState.fromIndex, 1);
      newBullets.splice(targetIndex, 0, moved);
      newOrganizations[orgIndex] = {
        ...org,
        bullets: newBullets,
        description: newBullets[0] || "",
      };
      onChange({ ...data, organizations: newOrganizations });
    }
    setDragBulletState({ orgIndex: null, fromIndex: null, overIndex: null });
  };

  const handleBulletDragEnd = () => {
    setDragBulletState({ orgIndex: null, fromIndex: null, overIndex: null });
  };

  // Drag and Drop Organisasi
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

            {/* Poin-Poin Keterangan / Kegiatan Organisasi */}
            <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
              <Label>Keterangan / Kegiatan Organisasi</Label>
              {(Array.isArray(org.bullets) && org.bullets.length > 0
                ? org.bullets
                : org.description
                ? [org.description]
                : [""]
              ).map((bullet, bIdx) => {
                const isBulletDragging =
                  dragBulletState.orgIndex === idx &&
                  dragBulletState.fromIndex === bIdx;
                const isBulletOver =
                  dragBulletState.orgIndex === idx &&
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
                      placeholder="Contoh: Mengoordinasikan program kerja dan memimpin tim beranggotakan 20 orang..."
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
                <span>Tambah Poin Kegiatan</span>
              </Button>
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

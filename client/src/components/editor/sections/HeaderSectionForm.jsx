import { useState } from "react";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Button } from "../../ui/button.jsx";
import { Plus, Trash2, GripVertical } from "lucide-react";

export const HeaderSectionForm = ({ data, onChange, onRequestDelete }) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const getHeaderLinks = () => {
    if (Array.isArray(data.header?.links) && data.header.links.length > 0) {
      return data.header.links;
    }
    if (data.header?.website) {
      return [data.header.website];
    }
    return [""];
  };

  const handleHeaderChange = (field, value) => {
    onChange({
      ...data,
      header: {
        ...(data.header || {}),
        [field]: value,
      },
    });
  };

  const handleAddLink = () => {
    const currentLinks = getHeaderLinks();
    const newLinks = [...currentLinks, ""];
    onChange({
      ...data,
      header: {
        ...(data.header || {}),
        links: newLinks,
        website: newLinks[0] || "",
      },
    });
  };

  const handleUpdateLink = (index, value) => {
    const currentLinks = [...getHeaderLinks()];
    currentLinks[index] = value;
    onChange({
      ...data,
      header: {
        ...(data.header || {}),
        links: currentLinks,
        website: currentLinks[0] || "",
      },
    });
  };

  const handleDeleteLink = (index) => {
    const currentLinks = getHeaderLinks().filter((_, i) => i !== index);
    const updatedLinks = currentLinks.length > 0 ? currentLinks : [""];
    onChange({
      ...data,
      header: {
        ...(data.header || {}),
        links: updatedLinks,
        website: updatedLinks[0] || "",
      },
    });
  };

  const confirmDeleteLink = (index) => {
    onRequestDelete({
      title: "Hapus Tautan Profil?",
      description:
        "Apakah Anda yakin ingin menghapus tautan profil ini dari header resume Anda?",
      onConfirm: () => handleDeleteLink(index),
    });
  };

  // Drag and Drop for links
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const currentLinks = [...getHeaderLinks()];
    const [moved] = currentLinks.splice(dragIndex, 1);
    currentLinks.splice(targetIndex, 0, moved);

    setDragIndex(null);
    setDragOverIndex(null);

    onChange({
      ...data,
      header: {
        ...(data.header || {}),
        links: currentLinks,
        website: currentLinks[0] || "",
      },
    });
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const links = getHeaderLinks();

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150">
      <div>
        <Label htmlFor="header-fullname">Nama Lengkap *</Label>
        <Input
          id="header-fullname"
          type="text"
          placeholder="Contoh: Budi Santoso, S.Kom."
          value={data.header?.fullName || ""}
          onChange={(e) => handleHeaderChange("fullName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="header-targetrole">Profesi / Bidang Keahlian</Label>
        <Input
          id="header-targetrole"
          type="text"
          placeholder="Contoh: Senior Full Stack Developer / Data Scientist"
          value={data.header?.targetRole || ""}
          onChange={(e) => handleHeaderChange("targetRole", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="header-phone">Nomor Telepon / WA</Label>
          <Input
            id="header-phone"
            type="text"
            placeholder="Contoh: +62 812 3456 7890"
            value={data.header?.phone || ""}
            onChange={(e) => handleHeaderChange("phone", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="header-email">Alamat Email *</Label>
          <Input
            id="header-email"
            type="email"
            placeholder="Contoh: nama.anda@example.com"
            value={data.header?.email || ""}
            onChange={(e) => handleHeaderChange("email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="header-location">Domisili / Kota, Negara</Label>
        <Input
          id="header-location"
          type="text"
          placeholder="Contoh: Jakarta Selatan, DKI Jakarta, Indonesia"
          value={data.header?.location || ""}
          onChange={(e) => handleHeaderChange("location", e.target.value)}
        />
      </div>

      {/* Tautan Web / Portofolio / LinkedIn / GitHub */}
      <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
        <Label>Tautan Profil / Portfolio / LinkedIn / GitHub</Label>
        {links.map((link, lIdx) => {
          const isDragging = dragIndex === lIdx;
          const isOver = dragOverIndex === lIdx && dragIndex !== lIdx;

          return (
            <div
              key={lIdx}
              draggable={links.length > 1}
              onDragStart={(e) => handleDragStart(e, lIdx)}
              onDragOver={(e) => handleDragOver(e, lIdx)}
              onDrop={(e) => handleDrop(e, lIdx)}
              onDragEnd={handleDragEnd}
              className={`flex gap-2 items-center transition-all ${
                isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
              } ${isOver ? "border-t-2 border-t-[#af101a]" : ""}`}
            >
              {links.length > 1 && (
                <span
                  className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 flex-shrink-0"
                  title="Tahan dan geser untuk memindahkan urutan tautan"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </span>
              )}
              <Input
                type="text"
                placeholder="Contoh: https://linkedin.com/in/username atau https://github.com/username"
                value={link}
                onChange={(e) => handleUpdateLink(lIdx, e.target.value)}
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => confirmDeleteLink(lIdx)}
                  className="text-[#5d5e61] hover:text-[#ba1a1a] p-2 cursor-pointer transition-colors"
                  title="Hapus tautan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddLink}
          className="text-xs text-[#af101a] font-semibold hover:bg-[#fef2f2] rounded-none px-2 py-1 h-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Tambah Tautan Baru</span>
        </Button>
      </div>
    </div>
  );
};

import { useState } from "react";
import { CheckCircle2, GripVertical } from "lucide-react";
import {
  SECTIONS,
  normalizeSectionOrder,
} from "../../constants/editorSections.js";

export const EditorSidebar = ({
  activeSection,
  onSelectSection,
  formData,
  isFormOpen = true,
  onReorderSections,
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const headerSection = SECTIONS.find((s) => s.id === "header") || SECTIONS[0];
  const bodySectionOrder = normalizeSectionOrder(formData.sectionOrder);

  // Map section object from ID
  const bodySections = bodySectionOrder
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter(Boolean);

  // Cek apakah suatu bagian sudah terisi
  const isSectionFilled = (sectionId) => {
    const h = formData.header || {};
    switch (sectionId) {
      case "header":
        return !!(h.fullName?.trim() && h.targetRole?.trim() && h.email?.trim());
      case "summary":
        return !!formData.summary?.trim();
      case "educations":
        return (formData.educations || []).length > 0;
      case "experiences":
        return (formData.experiences || []).length > 0;
      case "organizations":
        return (formData.organizations || []).length > 0;
      case "certifications":
        return (formData.certifications || []).length > 0;
      case "skills":
        return (
          (formData.skills?.hardSkills || []).length > 0 ||
          (formData.skills?.softSkills || []).length > 0
        );
      default:
        return false;
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
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

  const handleDragLeave = (e, index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...bodySectionOrder];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    onReorderSections?.(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const isHeaderActive = activeSection === headerSection.id && isFormOpen;
  const isHeaderFilled = isSectionFilled(headerSection.id);
  const HeaderIcon = headerSection.icon;

  return (
    <aside className="w-full lg:w-60 bg-white border-r border-[#e2e8f0] flex flex-col justify-between p-3 sm:p-4 flex-shrink-0 print:hidden h-full overflow-y-auto select-none">
      <div className="space-y-3">
        {/* 1. Header / Informasi Pribadi (Fixed Top) */}
        <div>
          <button
            type="button"
            onClick={() => onSelectSection(headerSection.id)}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-medium rounded-none transition-colors cursor-pointer ${
              isHeaderActive
                ? "bg-[#fef2f2] text-[#af101a] border border-[#fecaca] font-bold"
                : "text-[#1a1b22] hover:bg-[#f8fafc] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <HeaderIcon
                className={`w-4 h-4 flex-shrink-0 ${
                  isHeaderActive ? "text-[#af101a]" : "text-[#5d5e61]"
                }`}
              />
              <span className="truncate">{headerSection.label}</span>
            </div>

            {isHeaderFilled && (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0 ml-2" />
            )}
          </button>
        </div>

        {/* Separator / Drag Instruction Label */}
        <div className="pt-2 border-t border-[#f1f5f9]">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#5d5e61]">
              Urutan Konten
            </span>
            <span className="text-[10px] text-[#94a3b8] font-mono-code">
              Drag & Drop
            </span>
          </div>

          {/* 2. Draggable Body Sections */}
          <nav className="space-y-1">
            {bodySections.map((sec, index) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id && isFormOpen;
              const isFilled = isSectionFilled(sec.id);
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index && draggedIndex !== index;

              return (
                <div
                  key={sec.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={(e) => handleDragLeave(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative flex items-center rounded-none transition-all ${
                    isDragging ? "opacity-30 border-2 border-dashed border-[#af101a]" : ""
                  } ${
                    isOver ? "border-t-2 border-t-[#af101a] bg-[#fef2f2]/60" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectSection(sec.id)}
                    className={`w-full pl-2 pr-3 py-2.5 flex items-center justify-between text-left text-xs font-medium rounded-none transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#fef2f2] text-[#af101a] border border-[#fecaca] font-bold"
                        : "text-[#1a1b22] hover:bg-[#f8fafc] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {/* Drag Handle Indicator */}
                      <span
                        className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-0.5"
                        title="Tahan dan geser untuk memindahkan urutan bagian"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="w-3.5 h-3.5 flex-shrink-0" />
                      </span>

                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? "text-[#af101a]" : "text-[#5d5e61]"
                        }`}
                      />
                      <span className="truncate">{sec.label}</span>
                    </div>

                    {isFilled && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Hint */}
      <div className="pt-3 border-t border-[#f1f5f9] text-[11px] text-[#5d5e61] flex items-center gap-1.5">
        <GripVertical className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
        <span className="leading-tight">Tarik & lepas bagian untuk mengatur urutan pada CV.</span>
      </div>
    </aside>
  );
};

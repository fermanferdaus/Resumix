import { useState, useMemo } from "react";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Button } from "../ui/button.jsx";
import {
  SECTIONS,
  DEFAULT_SECTION_TITLES,
  normalizeSectionOrder,
} from "../../constants/editorSections.js";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal.jsx";

// Modular Section Sub-components
import { HeaderSectionForm } from "./sections/HeaderSectionForm.jsx";
import { SummarySectionForm } from "./sections/SummarySectionForm.jsx";
import { EducationsSectionForm } from "./sections/EducationsSectionForm.jsx";
import { ExperiencesSectionForm } from "./sections/ExperiencesSectionForm.jsx";
import { OrganizationsSectionForm } from "./sections/OrganizationsSectionForm.jsx";
import { CertificationsSectionForm } from "./sections/CertificationsSectionForm.jsx";
import { SkillsSectionForm } from "./sections/SkillsSectionForm.jsx";

export const EditorSectionForm = ({
  activeSection,
  onSelectSection,
  data,
  onChange,
  onClose,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const orderedSections = useMemo(() => {
    const bodyOrder = normalizeSectionOrder(data?.sectionOrder);
    const headerSection = SECTIONS.find((s) => s.id === "header") || SECTIONS[0];
    const bodySections = bodyOrder
      .map((id) => SECTIONS.find((s) => s.id === id))
      .filter(Boolean);
    return [headerSection, ...bodySections];
  }, [data.sectionOrder]);

  const currentSectionIndex = orderedSections.findIndex(
    (s) => s.id === activeSection
  );
  const currentSection = orderedSections[currentSectionIndex] || orderedSections[0];

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      onSelectSection(orderedSections[currentSectionIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < orderedSections.length - 1) {
      onSelectSection(orderedSections[currentSectionIndex + 1].id);
    }
  };

  const handleSectionTitleChange = (sectionId, value) => {
    onChange({
      ...data,
      sectionTitles: {
        ...(data.sectionTitles || {}),
        [sectionId]: value,
      },
    });
  };

  const getSectionTitle = (sectionId) => {
    return (
      data.sectionTitles?.[sectionId] ??
      DEFAULT_SECTION_TITLES[sectionId] ??
      ""
    );
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Header Form: Section Name & Custom Title Input */}
      <div className="flex justify-between items-start border-b border-[#e2e8f0] pb-3">
        <div className="flex-1 mr-4">
          <span className="text-xs font-mono-code font-bold text-[#af101a] uppercase tracking-wider block">
            Formulir Bagian
          </span>
          <h2 className="text-base font-bold text-[#0f172a] mt-0.5">
            {currentSection.label}
          </h2>

          {activeSection !== "header" && (
            <div className="mt-2 flex items-center gap-2 max-w-sm">
              <Label
                htmlFor="custom-section-title"
                className="text-[11px] text-[#5d5e61] font-mono-code whitespace-nowrap mb-0"
              >
                Judul di CV:
              </Label>
              <Input
                id="custom-section-title"
                type="text"
                value={getSectionTitle(activeSection)}
                onChange={(e) =>
                  handleSectionTitleChange(activeSection, e.target.value)
                }
                placeholder={DEFAULT_SECTION_TITLES[activeSection]}
                className="h-7 text-xs font-semibold uppercase tracking-wider border-[#cbd5e1] focus:border-[#af101a]"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[#5d5e61] hover:text-[#0f172a] p-1.5 cursor-pointer rounded-none hover:bg-[#f1f5f9] transition-colors"
          title="Tutup formulir"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Active Section Body */}
      {activeSection === "header" && (
        <HeaderSectionForm
          data={data}
          onChange={onChange}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {activeSection === "summary" && (
        <SummarySectionForm data={data} onChange={onChange} />
      )}

      {activeSection === "educations" && (
        <EducationsSectionForm
          data={data}
          onChange={onChange}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {activeSection === "experiences" && (
        <ExperiencesSectionForm
          data={data}
          onChange={onChange}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {activeSection === "organizations" && (
        <OrganizationsSectionForm
          data={data}
          onChange={onChange}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {activeSection === "certifications" && (
        <CertificationsSectionForm
          data={data}
          onChange={onChange}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {activeSection === "skills" && (
        <SkillsSectionForm
          data={data}
          onChange={onChange}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {/* Navigation Footer (Sebelumnya / Selanjutnya) */}
      <div className="pt-4 border-t border-[#e2e8f0] flex justify-between items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentSectionIndex === 0}
          className="flex items-center gap-1 text-xs rounded-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </Button>

        <span className="text-[11px] font-mono-code text-[#5d5e61]">
          {currentSectionIndex + 1} / {orderedSections.length}
        </span>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleNext}
          disabled={currentSectionIndex === orderedSections.length - 1}
          className="flex items-center gap-1 text-xs rounded-none"
        >
          <span>Selanjutnya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Universal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title}
        description={deleteTarget?.description}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (typeof deleteTarget?.onConfirm === "function") {
            deleteTarget.onConfirm();
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

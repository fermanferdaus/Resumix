import { CheckCircle2 } from "lucide-react";
import { SECTIONS } from "../../constants/editorSections.js";

export const EditorSidebar = ({
  activeSection,
  onSelectSection,
  formData,
  isFormOpen = true,
}) => {
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

  return (
    <aside className="w-full lg:w-60 bg-white border-r border-[#e2e8f0] flex flex-col justify-between p-3 sm:p-4 flex-shrink-0 print:hidden h-full overflow-y-auto">
      <div className="space-y-1">
        {/* Section Navigation Tabs */}
        <nav className="space-y-1">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id && isFormOpen;
            const isFilled = isSectionFilled(sec.id);

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-medium rounded-none transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#fef2f2] text-[#af101a] border border-[#fecaca] font-bold"
                    : "text-[#1a1b22] hover:bg-[#f8fafc] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
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
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

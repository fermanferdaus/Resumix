import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Button } from "../ui/button.jsx";
import { MonthYearPicker } from "../ui/MonthYearPicker.jsx";
import { YearPicker } from "../ui/YearPicker.jsx";
import { SECTIONS, DEFAULT_SECTION_TITLES } from "../../constants/editorSections.js";
import { Plus, Trash2, ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";

export const EditorSectionForm = ({
  activeSection,
  onSelectSection,
  data,
  onChange,
  onClose,
}) => {
  const currentSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSection = SECTIONS[currentSectionIndex] || SECTIONS[0];

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      onSelectSection(SECTIONS[currentSectionIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < SECTIONS.length - 1) {
      onSelectSection(SECTIONS[currentSectionIndex + 1].id);
    }
  };

  // Section Title Handlers
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

  // Header Handlers
  const handleHeaderChange = (field, value) => {
    onChange({
      ...data,
      header: {
        ...(data.header || {}),
        [field]: value,
      },
    });
  };

  const getHeaderLinks = () => {
    if (Array.isArray(data.header?.links) && data.header.links.length > 0) {
      return data.header.links;
    }
    if (data.header?.website) {
      return [data.header.website];
    }
    return [""];
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

  // Summary Handler
  const handleSummaryChange = (value) => {
    onChange({
      ...data,
      summary: value,
    });
  };

  // Education Handlers
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

  // Experience Handlers
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

  // Organization Handlers
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

  // Certification Handlers
  const handleAddCertification = () => {
    const newCertifications = [
      ...(data.certifications || []),
      { name: "", issuer: "", year: "" },
    ];
    onChange({ ...data, certifications: newCertifications });
  };

  const handleUpdateCertification = (index, field, value) => {
    const newCertifications = [...(data.certifications || [])];
    const current = newCertifications[index];
    const updated =
      typeof current === "object" && current !== null
        ? { ...current, [field]: value }
        : { name: typeof current === "string" ? current : "", [field]: value };
    newCertifications[index] = updated;
    onChange({ ...data, certifications: newCertifications });
  };

  const handleDeleteCertification = (index) => {
    const newCertifications = (data.certifications || []).filter((_, i) => i !== index);
    onChange({ ...data, certifications: newCertifications });
  };

  // Skills Handlers
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

  return (
    <div className="bg-white border border-[#e2e8f0] p-6 rounded-none space-y-6">
      {/* Section Header */}
      <div className="border-b border-[#e2e8f0] pb-4 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#fef2f2] border border-[#fecaca] text-[10px] font-mono-code uppercase font-semibold text-[#af101a] mb-1.5 rounded-none">
            <Sparkles className="w-3 h-3" />
            <span>Bagian #{currentSectionIndex + 1} dari {SECTIONS.length}</span>
          </div>
          <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
            {currentSection.label}
          </h2>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5d5e61] hover:text-[#0f172a] hover:bg-[#f1f5f9] border border-transparent hover:border-[#e2e8f0] transition-colors cursor-pointer rounded-none"
            title="Sembunyikan Form Editor"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Section Title Editor for ATS Output */}
      {activeSection !== "header" && (
        <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-none space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor={`section-title-${activeSection}`}
              className="text-[#af101a] font-bold mb-0 text-xs uppercase tracking-wide"
            >
              Nama Bagian
            </Label>
            {data.sectionTitles?.[activeSection] &&
              data.sectionTitles[activeSection] !==
                DEFAULT_SECTION_TITLES[activeSection] && (
                <button
                  type="button"
                  onClick={() =>
                    handleSectionTitleChange(
                      activeSection,
                      DEFAULT_SECTION_TITLES[activeSection]
                    )
                  }
                  className="text-[11px] text-[#5d5e61] hover:text-[#af101a] underline cursor-pointer"
                >
                  Reset Default
                </button>
              )}
          </div>
          <Input
            id={`section-title-${activeSection}`}
            type="text"
            value={getSectionTitle(activeSection)}
            onChange={(e) =>
              handleSectionTitleChange(activeSection, e.target.value.toUpperCase())
            }
            placeholder={`Contoh: ${DEFAULT_SECTION_TITLES[activeSection]}`}
            className="bg-white font-bold tracking-wider uppercase text-xs"
          />
        </div>
      )}

      {/* 1. INFORMASI PRIBADI */}
      {activeSection === "header" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="header-fullName">Nama Lengkap *</Label>
              <Input
                id="header-fullName"
                type="text"
                placeholder="Contoh: FERMAN FERDAUS"
                value={data.header?.fullName || ""}
                onChange={(e) => handleHeaderChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="header-targetRole">Profesi Target *</Label>
              <Input
                id="header-targetRole"
                type="text"
                placeholder="Contoh: Fullstack Developer"
                value={data.header?.targetRole || ""}
                onChange={(e) => handleHeaderChange("targetRole", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="header-phone">Nomor Telepon / WA</Label>
              <Input
                id="header-phone"
                type="text"
                placeholder="+62 85267216405"
                value={data.header?.phone || ""}
                onChange={(e) => handleHeaderChange("phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="header-email">Alamat Email *</Label>
              <Input
                id="header-email"
                type="email"
                placeholder="email@example.com"
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
              placeholder="Contoh: Bandar Lampung, Lampung, Indonesia"
              value={data.header?.location || ""}
              onChange={(e) => handleHeaderChange("location", e.target.value)}
            />
          </div>

          {/* Tautan Web / Portofolio / LinkedIn / GitHub */}
          <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
            <Label>Tautan Profil / Portfolio / LinkedIn / GitHub (Bisa Beberapa Tautan)</Label>
            {getHeaderLinks().map((link, lIdx) => (
              <div key={lIdx} className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Contoh: https://linkedin.com/in/ferman atau https://os-tech.online"
                  value={link}
                  onChange={(e) => handleUpdateLink(lIdx, e.target.value)}
                />
                {getHeaderLinks().length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteLink(lIdx)}
                    className="text-[#5d5e61] hover:text-[#ba1a1a] p-2 cursor-pointer transition-colors"
                    title="Hapus tautan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

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
      )}

      {/* 2. RINGKASAN PROFIL */}
      {activeSection === "summary" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div>
            <Label htmlFor="summary-text">Ringkasan</Label>
            <textarea
              id="summary-text"
              rows={6}
              placeholder="Tuliskan ringkasan pengalaman profesional, keahlian utama, dan pencapaian Anda secara terstruktur..."
              value={data.summary || ""}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] p-3 rounded-none outline-none focus:border-[#af101a] focus:bg-white transition-colors resize-y leading-relaxed font-sans"
            />
          </div>
        </div>
      )}

      {/* 3. PENDIDIKAN */}
      {activeSection === "educations" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {(data.educations || []).map((edu, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Pendidikan
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(idx)}
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
                    placeholder="Contoh: SMA IPA / SMK RPL / S1 Teknik Komputer"
                    value={edu.degree || ""}
                    onChange={(e) => handleUpdateEducation(idx, "degree", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Nilai Akhir / IPK</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: 88.5 atau 3.83/4.00"
                    value={edu.gpa || ""}
                    onChange={(e) => handleUpdateEducation(idx, "gpa", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Nama Sekolah / Kampus *</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: SMAN 1 Bandar Lampung / Universitas Teknokrat"
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
                    placeholder="Contoh: Bandar Lampung, Indonesia"
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
                      onChange={(val) => handleUpdateEducation(idx, "startDate", val)}
                    />
                  </div>
                  <div>
                    <Label>Periode Selesai</Label>
                    <MonthYearPicker
                      value={edu.endDate || ""}
                      onChange={(val) => handleUpdateEducation(idx, "endDate", val)}
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
                {(edu.bullets || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex gap-2 items-start">
                    <span className="text-xs font-bold text-[#af101a] mt-2">•</span>
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
                      onClick={() => handleDeleteEduBullet(idx, bIdx)}
                      className="text-[#5d5e61] hover:text-[#ba1a1a] p-1.5 mt-1 cursor-pointer"
                      title="Hapus poin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

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
          ))}

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
      )}

      {/* 4. PENGALAMAN KERJA */}
      {activeSection === "experiences" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {(data.experiences || []).map((exp, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Pengalaman Kerja
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(idx)}
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
                    placeholder="OWNER & FULLSTACK DEVELOPER"
                    value={exp.role || ""}
                    onChange={(e) => handleUpdateExperience(idx, "role", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Nama Perusahaan *</Label>
                  <Input
                    type="text"
                    placeholder="OEMAH SERVICE"
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
                  placeholder="Contoh: Bandar Lampung, Indonesia"
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
                      onChange={(val) => handleUpdateExperience(idx, "startDate", val)}
                    />
                  </div>
                  <div>
                    <Label>Periode Selesai</Label>
                    <MonthYearPicker
                      value={exp.endDate || ""}
                      onChange={(val) => handleUpdateExperience(idx, "endDate", val)}
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
                <Label>Poin Tanggung Jawab & Pencapaian (Action Verbs ATS)</Label>
                {(exp.bullets || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex gap-2 items-start">
                    <span className="text-xs font-bold text-[#af101a] mt-2">•</span>
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
                      onClick={() => handleDeleteBullet(idx, bIdx)}
                      className="text-[#5d5e61] hover:text-[#ba1a1a] p-1.5 mt-1 cursor-pointer"
                      title="Hapus poin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

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
          ))}

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
      )}

      {/* 5. PENGALAMAN ORGANISASI */}
      {activeSection === "organizations" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {(data.organizations || []).map((org, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-code font-bold text-[#af101a]">
                  #{idx + 1} Organisasi
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteOrganization(idx)}
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
                    placeholder="Ketua Divisi KRSBI-Humanoid"
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
                    placeholder="UKM Robotik, Universitas Teknokrat Indonesia"
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
          ))}

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
      )}

      {/* 6. SERTIFIKAT DAN PRESTASI */}
      {activeSection === "certifications" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {(data.certifications || []).map((cert, idx) => {
            const certObj =
              typeof cert === "object" && cert !== null
                ? cert
                : {
                    name: typeof cert === "string" ? cert : "",
                    issuer: "",
                    year: "",
                  };

            return (
              <div
                key={idx}
                className="p-4 bg-[#f8fafc] border border-[#e2e8f0] relative rounded-none space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono-code font-bold text-[#af101a]">
                    #{idx + 1} Sertifikat / Prestasi
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCertification(idx)}
                    className="text-[#ba1a1a] hover:text-[#93000a] text-xs flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <div>
                  <Label>Nama Sertifikat / Prestasi *</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: Juara 1 Kontes Robot Indonesia / AWS Certified Solutions Architect"
                    value={certObj.name || ""}
                    onChange={(e) =>
                      handleUpdateCertification(idx, "name", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Penyelenggara / Penerbit</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: Puspresnas Kemdikbudristek / Amazon Web Services"
                      value={certObj.issuer || ""}
                      onChange={(e) =>
                        handleUpdateCertification(idx, "issuer", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Tahun Perolehan</Label>
                    <YearPicker
                      value={certObj.year || certObj.date || ""}
                      onChange={(val) =>
                        handleUpdateCertification(idx, "year", val)
                      }
                      placeholder="Pilih Tahun"
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
            onClick={handleAddCertification}
            className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sertifikat / Prestasi</span>
          </Button>
        </div>
      )}

      {/* 7. KEAHLIAN */}
      {activeSection === "skills" && (
        <div className="space-y-5 animate-in fade-in-50 duration-150">
          {/* Hard Skills */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-mono-code uppercase font-bold text-[#0f172a] block">
                HARD SKILL / KEAHLIAN TEKNIS
              </span>
              <p className="text-[11px] text-[#5d5e61] mt-0.5">
                Bisa dikelompokkan dengan nama kategori atau langsung ditulis tanpa kategori.
              </p>
            </div>

            {(data.skills?.hardSkills || []).map((h, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-none space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono-code font-semibold text-[#af101a]">
                    Entri Keahlian #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteHardSkill(idx)}
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
            ))}

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
              <p className="text-[11px] text-[#5d5e61] mt-0.5">
                Keahlian interpersonal, komunikasi, atau manajerial.
              </p>
            </div>

            {(data.skills?.softSkills || []).map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-[#af101a]">•</span>
                <Input
                  type="text"
                  placeholder="Contoh: Problem Solving, Critical Thinking, Team Leadership"
                  value={typeof s === "string" ? s : s.name || ""}
                  onChange={(e) => handleUpdateSoftSkill(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSoftSkill(idx)}
                  className="text-[#5d5e61] hover:text-[#ba1a1a] p-1.5 cursor-pointer"
                  title="Hapus soft skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

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
      )}

      {/* Section Navigation Footer (Sebelumnya / Selanjutnya) */}
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
          {currentSectionIndex + 1} / {SECTIONS.length}
        </span>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleNext}
          disabled={currentSectionIndex === SECTIONS.length - 1}
          className="flex items-center gap-1 text-xs rounded-none"
        >
          <span>Selanjutnya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

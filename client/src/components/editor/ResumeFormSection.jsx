import { useState } from "react";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Button } from "../ui/button.jsx";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Wrench,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const ResumeFormSection = ({ data, onChange }) => {
  const [openSections, setOpenSections] = useState({
    header: true,
    summary: true,
    educations: true,
    experiences: true,
    organizations: false,
    certifications: false,
    skills: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
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
    const newCertifications = [...(data.certifications || []), ""];
    onChange({ ...data, certifications: newCertifications });
  };

  const handleUpdateCertification = (index, value) => {
    const newCertifications = [...(data.certifications || [])];
    newCertifications[index] = value;
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
    <div className="space-y-4 pb-12">
      {/* 1. INFORMASI KONTAK */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("header")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Informasi Pribadi & Kontak
            </h3>
          </div>
          {openSections.header ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.header && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] space-y-3 mt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="header-fullName">Nama Lengkap *</Label>
                <Input
                  id="header-fullName"
                  type="text"
                  placeholder="Contoh: Alex Pratama"
                  value={data.header?.fullName || ""}
                  onChange={(e) => handleHeaderChange("fullName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="header-targetRole">Profesi / Posisi Target *</Label>
                <Input
                  id="header-targetRole"
                  type="text"
                  placeholder="Contoh: Software Engineer"
                  value={data.header?.targetRole || ""}
                  onChange={(e) => handleHeaderChange("targetRole", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="header-phone">Nomor Telepon / WhatsApp</Label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="header-website">Website / Portfolio / LinkedIn</Label>
                <Input
                  id="header-website"
                  type="text"
                  placeholder="Contoh: https://linkedin.com/in/username"
                  value={data.header?.website || ""}
                  onChange={(e) => handleHeaderChange("website", e.target.value)}
                />
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
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFIL / RINGKASAN */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("summary")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Ringkasan Profil Profesional
            </h3>
          </div>
          {openSections.summary ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.summary && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] mt-1">
            <Label htmlFor="summary-text">Paragraf Ringkasan Kualifikasi ATS</Label>
            <textarea
              id="summary-text"
              rows={4}
              placeholder="Tuliskan ringkasan pengalaman profesional, keahlian utama, dan pencapaian Anda secara lugas..."
              value={data.summary || ""}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] p-3 rounded-none outline-none focus:border-[#af101a] focus:bg-white transition-colors resize-y leading-relaxed font-sans"
            />
          </div>
        )}
      </div>

      {/* 3. PENDIDIKAN */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("educations")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Riwayat Pendidikan ({data.educations?.length || 0})
            </h3>
          </div>
          {openSections.educations ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.educations && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] mt-1 space-y-4">
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
                    <Label>Gelar / Jurusan *</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: S1 Teknik Informatika"
                      value={edu.degree || ""}
                      onChange={(e) => handleUpdateEducation(idx, "degree", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>IPK / Nilai (Opsional)</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: 3.80 / 4.00"
                      value={edu.gpa || ""}
                      onChange={(e) => handleUpdateEducation(idx, "gpa", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Nama Institusi / Universitas *</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: Universitas Indonesia"
                      value={edu.institution || ""}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "institution", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Lokasi / Negara</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: Depok, Indonesia"
                      value={edu.location || ""}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "location", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Periode Mulai</Label>
                    <Input
                      type="text"
                      placeholder="September 2022"
                      value={edu.startDate || ""}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Periode Selesai</Label>
                    <Input
                      type="text"
                      placeholder="Oktober 2025 / Sekarang"
                      value={edu.endDate || ""}
                      onChange={(e) =>
                        handleUpdateEducation(idx, "endDate", e.target.value)
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
              onClick={handleAddEducation}
              className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Riwayat Pendidikan</span>
            </Button>
          </div>
        )}
      </div>

      {/* 4. PENGALAMAN KERJA */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("experiences")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Pengalaman Kerja ({data.experiences?.length || 0})
            </h3>
          </div>
          {openSections.experiences ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.experiences && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] mt-1 space-y-4">
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
                    <Label>Peran / Posisi Pekerjaan *</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: Senior Frontend Engineer"
                      value={exp.role || ""}
                      onChange={(e) => handleUpdateExperience(idx, "role", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Nama Perusahaan / Organisasi *</Label>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <div>
                    <Label>Periode Mulai</Label>
                    <Input
                      type="text"
                      placeholder="Juni 2025"
                      value={exp.startDate || ""}
                      onChange={(e) =>
                        handleUpdateExperience(idx, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Periode Selesai</Label>
                    <Input
                      type="text"
                      placeholder="Sekarang / Des 2025"
                      value={exp.endDate || ""}
                      onChange={(e) =>
                        handleUpdateExperience(idx, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Bullet Points Deskripsi Tanggung Jawab */}
                <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
                  <Label>Poin Tanggung Jawab & Pencapaian (Action Verbs ATS)</Label>
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-[#af101a] mt-2">•</span>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Merancang dan membangun arsitektur RESTful API teroptimasi..."
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
                    + Tambah Poin Deskripsi
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
              <span>+ Tambah Pengalaman Kerja</span>
            </Button>
          </div>
        )}
      </div>

      {/* 5. PENGALAMAN ORGANISASI */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("organizations")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Pengalaman Organisasi ({data.organizations?.length || 0})
            </h3>
          </div>
          {openSections.organizations ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.organizations && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] mt-1 space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Periode</Label>
                    <Input
                      type="text"
                      placeholder="April 2023 – April 2024"
                      value={org.period || ""}
                      onChange={(e) =>
                        handleUpdateOrganization(idx, "period", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Deskripsi / Keterangan Singkat (Opsional)</Label>
                    <Input
                      type="text"
                      placeholder="Memimpin riset robotika..."
                      value={org.description || ""}
                      onChange={(e) =>
                        handleUpdateOrganization(idx, "description", e.target.value)
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
              onClick={handleAddOrganization}
              className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Pengalaman Organisasi</span>
            </Button>
          </div>
        )}
      </div>

      {/* 6. SERTIFIKAT DAN PRESTASI */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("certifications")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Sertifikat dan Prestasi ({data.certifications?.length || 0})
            </h3>
          </div>
          {openSections.certifications ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.certifications && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] mt-1 space-y-3">
            {(data.certifications || []).map((cert, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-[#af101a]">•</span>
                <Input
                  type="text"
                  placeholder="Contoh: Sertifikat Penghargaan Mahasiswa Berprestasi Inovasi AI (2025)"
                  value={typeof cert === "string" ? cert : cert.name || ""}
                  onChange={(e) => handleUpdateCertification(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCertification(idx)}
                  className="text-[#5d5e61] hover:text-[#ba1a1a] p-1.5 cursor-pointer"
                  title="Hapus item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCertification}
              className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Sertifikat / Prestasi</span>
            </Button>
          </div>
        )}
      </div>

      {/* 7. KEAHLIAN (HARD & SOFT SKILLS) */}
      <div className="bg-white border border-[#e2e8f0] rounded-none">
        <button
          type="button"
          onClick={() => toggleSection("skills")}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-[#af101a]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
              Keahlian (Hard & Soft Skills)
            </h3>
          </div>
          {openSections.skills ? (
            <ChevronUp className="w-4 h-4 text-[#5d5e61]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5d5e61]" />
          )}
        </button>

        {openSections.skills && (
          <div className="p-5 pt-0 border-t border-[#e2e8f0] mt-1 space-y-5">
            {/* Hard Skills */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-code uppercase font-bold text-[#0f172a]">
                  HARD SKILL (Berdasarkan Kategori)
                </span>
              </div>

              {(data.skills?.hardSkills || []).map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-none space-y-2 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono-code font-semibold text-[#af101a]">
                      Kategori #{idx + 1}
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
                        placeholder="Bahasa & Framework"
                        value={h.category || ""}
                        onChange={(e) =>
                          handleUpdateHardSkill(idx, "category", e.target.value)
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Daftar Keahlian (Pisahkan dengan koma)</Label>
                      <Input
                        type="text"
                        placeholder="React, Next.js, Express.js, TypeScript, PostgreSQL"
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
                <span>+ Tambah Kategori Hard Skill</span>
              </Button>
            </div>

            {/* Soft Skills */}
            <div className="space-y-3 pt-3 border-t border-[#e2e8f0]">
              <span className="text-xs font-mono-code uppercase font-bold text-[#0f172a]">
                SOFT SKILL
              </span>

              {(data.skills?.softSkills || []).map((s, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-[#af101a]">•</span>
                  <Input
                    type="text"
                    placeholder="Contoh: Problem Solving & Analytical Thinking"
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
                className="w-full flex items-center justify-center gap-1.5 rounded-none font-mono-code text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Soft Skill</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

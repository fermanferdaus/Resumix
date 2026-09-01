import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Wrench,
} from "lucide-react";

export const SECTIONS = [
  { id: "header", label: "Informasi Pribadi", icon: User },
  { id: "summary", label: "Ringkasan Profil", icon: FileText },
  { id: "educations", label: "Pendidikan", icon: GraduationCap },
  { id: "experiences", label: "Pengalaman Kerja", icon: Briefcase },
  { id: "organizations", label: "Organisasi", icon: Users },
  { id: "certifications", label: "Sertifikat & Prestasi", icon: Award },
  { id: "skills", label: "Keahlian", icon: Wrench },
];

export const DEFAULT_BODY_SECTION_ORDER = [
  "summary",
  "educations",
  "experiences",
  "organizations",
  "certifications",
  "skills",
];

export const normalizeSectionOrder = (savedOrder) => {
  if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
    return [...DEFAULT_BODY_SECTION_ORDER];
  }
  const validSaved = savedOrder.filter((id) =>
    DEFAULT_BODY_SECTION_ORDER.includes(id)
  );
  DEFAULT_BODY_SECTION_ORDER.forEach((id) => {
    if (!validSaved.includes(id)) {
      validSaved.push(id);
    }
  });
  return validSaved;
};

export const DEFAULT_SECTION_TITLES = {
  summary: "PROFIL",
  educations: "PENDIDIKAN",
  experiences: "PENGALAMAN KERJA",
  organizations: "PENGALAMAN ORGANISASI",
  certifications: "SERTIFIKAT DAN PRESTASI",
  skills: "KEAHLIAN",
};

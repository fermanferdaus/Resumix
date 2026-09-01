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

export const DEFAULT_SECTION_TITLES = {
  summary: "PROFIL",
  educations: "PENDIDIKAN",
  experiences: "PENGALAMAN KERJA",
  organizations: "PENGALAMAN ORGANISASI",
  certifications: "SERTIFIKAT DAN PRESTASI",
  skills: "KEAHLIAN",
};

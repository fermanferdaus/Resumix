/**
 * Menghitung persentase skor kesiapan ATS berdasarkan data form resume (0 - 100%)
 */
export const calculateAtsProgress = (formData) => {
  if (!formData || typeof formData !== "object") return 0;
  let score = 0;
  const h = formData.header || {};
  if (h.fullName?.trim()) score += 10;
  if (h.targetRole?.trim()) score += 10;
  if (h.email?.trim()) score += 5;
  if (h.phone?.trim()) score += 5;
  if (h.location?.trim()) score += 5;
  if (formData.summary?.trim()) score += 15;
  if (formData.educations?.length > 0) score += 15;
  if (formData.experiences?.length > 0) score += 20;
  if (formData.projects?.length > 0) score += 5;
  if (formData.organizations?.length > 0) score += 5;
  if (formData.certifications?.length > 0) score += 5;
  if (
    formData.skills?.hardSkills?.length > 0 ||
    formData.skills?.softSkills?.length > 0
  )
    score += 10;
  return Math.min(100, score);
};

/**
 * Mengambil status checklist kriteria ATS untuk resume
 */
export const getAtsChecklist = (formData) => {
  const h = formData?.header || {};
  const hasHeader = !!(h.fullName?.trim() && h.email?.trim());
  const hasExperiences = (formData?.experiences || []).length > 0;
  const hasEducations = (formData?.educations || []).length > 0;
  const hasSkills =
    (formData?.skills?.hardSkills || []).length > 0 ||
    (formData?.skills?.softSkills || []).length > 0;

  return [
    {
      id: "header",
      label: "Struktur Heading & Kontak Terstandarisasi",
      passed: hasHeader,
    },
    {
      id: "experience",
      label: "Kronologi Riwayat Pengalaman Kerja",
      passed: hasExperiences,
    },
    {
      id: "education-skills",
      label: "Latar Belakang Pendidikan & Keahlian",
      passed: hasEducations || hasSkills,
    },
  ];
};

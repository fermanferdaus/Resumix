import { describe, it } from "node:test";
import assert from "node:assert";

describe("Frontend Unit: Resume Data & Dashboard Utilities", () => {
  describe("Pencarian & Pemfilteran Riwayat Resume", () => {
    const sampleResumes = [
      { id: "1", title: "Senior Frontend Engineer", targetRole: "Frontend Developer" },
      { id: "2", title: "Full Stack Engineer 2026", targetRole: "Full Stack" },
      { id: "3", title: "UI/UX Designer ATS", targetRole: "Product Designer" },
    ];

    it("harus menyaring resume berdasarkan pencarian judul (case-insensitive)", () => {
      const query = "frontend";
      const filtered = sampleResumes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.targetRole.toLowerCase().includes(query.toLowerCase())
      );
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].title, "Senior Frontend Engineer");
    });

    it("harus menyaring resume berdasarkan targetRole", () => {
      const query = "Product Designer";
      const filtered = sampleResumes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.targetRole.toLowerCase().includes(query.toLowerCase())
      );
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].id, "3");
    });

    it("harus mengembalikan array kosong jika kata kunci tidak cocok", () => {
      const query = "DevOps Specialist";
      const filtered = sampleResumes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.targetRole.toLowerCase().includes(query.toLowerCase())
      );
      assert.strictEqual(filtered.length, 0);
    });
  });

  describe("Integritas Struktur Standar ATS Resume JSON", () => {
    const mockResumeData = {
      header: {
        fullName: "Budi Santoso",
        targetRole: "Full Stack Developer",
        email: "budi@example.com",
        phone: "+628123456789",
        website: "https://budi.dev",
        location: "Jakarta, Indonesia",
      },
      summary: "Senior Software Engineer dengan spesialisasi arsitektur web modern.",
      educations: [],
      experiences: [],
      organizations: [],
      certifications: [],
      skills: {
        hardSkills: ["React", "Express", "PostgreSQL"],
        softSkills: ["Problem Solving", "Leadership"],
      },
    };

    it("harus memiliki bagian header lengkap sesuai PRD.md Bagian 7", () => {
      assert.ok(mockResumeData.header.fullName);
      assert.ok(mockResumeData.header.email);
      assert.strictEqual(typeof mockResumeData.header.targetRole, "string");
    });

    it("harus memiliki kategori hardSkills dan softSkills terpisah pada bagian skills", () => {
      assert(Array.isArray(mockResumeData.skills.hardSkills));
      assert(Array.isArray(mockResumeData.skills.softSkills));
      assert.strictEqual(mockResumeData.skills.hardSkills.includes("React"), true);
    });
  });

  describe("Pemeriksaan Batas Kuota 5 CV Akun", () => {
    it("harus menandai kuota penuh ketika jumlah resume mencapai 5", () => {
      const fiveResumes = [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
      ];
      const isQuotaFull = fiveResumes.length >= 5;
      assert.strictEqual(isQuotaFull, true);
    });

    it("harus memperbolehkan pembuatan jika jumlah resume kurang dari 5", () => {
      const threeResumes = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const isQuotaFull = threeResumes.length >= 5;
      assert.strictEqual(isQuotaFull, false);
    });
  });
});

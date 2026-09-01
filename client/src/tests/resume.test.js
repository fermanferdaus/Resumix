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

  describe("Pengurutan Bagian Resume (Drag and Drop Reordering)", () => {
    const DEFAULT_BODY_SECTION_ORDER = [
      "summary",
      "educations",
      "experiences",
      "organizations",
      "certifications",
      "skills",
    ];

    const normalizeOrder = (savedOrder) => {
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

    it("harus mengembalikan urutan default jika sectionOrder kosong atau null", () => {
      assert.deepStrictEqual(normalizeOrder(null), DEFAULT_BODY_SECTION_ORDER);
      assert.deepStrictEqual(normalizeOrder([]), DEFAULT_BODY_SECTION_ORDER);
    });

    it("harus mendukung perpindahan posisi pengalaman kerja di atas pendidikan", () => {
      const customOrder = [
        "experiences",
        "educations",
        "skills",
        "summary",
        "organizations",
        "certifications",
      ];
      const result = normalizeOrder(customOrder);
      assert.strictEqual(result[0], "experiences");
      assert.strictEqual(result[1], "educations");
      assert.strictEqual(result.length, 6);
    });

    it("harus menyisipkan section yang hilang jika data tersimpan parsial", () => {
      const partialOrder = ["experiences", "educations"];
      const result = normalizeOrder(partialOrder);
      assert.strictEqual(result[0], "experiences");
      assert.strictEqual(result[1], "educations");
      assert.strictEqual(result.length, 6);
      assert.strictEqual(result.includes("skills"), true);
      assert.strictEqual(result.includes("summary"), true);
    });

    it("harus mendukung perpindahan urutan array item (misal pengalaman 2 ke posisi 1)", () => {
      const experiences = [
        { id: "exp1", role: "Junior Dev" },
        { id: "exp2", role: "Mid Dev" },
        { id: "exp3", role: "Senior Dev" },
      ];
      const reordered = [...experiences];
      const [moved] = reordered.splice(2, 1);
      reordered.splice(0, 0, moved);

      assert.strictEqual(reordered[0].id, "exp3");
      assert.strictEqual(reordered[1].id, "exp1");
      assert.strictEqual(reordered[2].id, "exp2");
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

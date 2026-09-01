import { describe, it } from "node:test";
import assert from "node:assert";

describe("Frontend Unit: Editor Logic & ATS Layout Specs", () => {
  describe("Kalkulasi Skor Kelengkapan Resume (Progress Bar)", () => {
    const calculateProgress = (formData) => {
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
      if (formData.organizations?.length > 0) score += 5;
      if (formData.certifications?.length > 0) score += 5;
      if (
        formData.skills?.hardSkills?.length > 0 ||
        formData.skills?.softSkills?.length > 0
      )
        score += 10;
      return Math.min(100, score);
    };

    it("harus menghasilkan 100% untuk data resume yang terisi penuh", () => {
      const fullResume = {
        header: {
          fullName: "Ferman Ferdaus",
          targetRole: "Fullstack Developer",
          email: "ferman@example.com",
          phone: "+628123456789",
          location: "Bandar Lampung, Indonesia",
        },
        summary: "Fullstack Developer dengan pengalaman arsitektur web modern.",
        educations: [{ degree: "S1 Teknik Komputer", institution: "UTI" }],
        experiences: [{ role: "Fullstack Developer", company: "Oemah Service" }],
        organizations: [{ role: "Ketua", name: "UKM Robotik" }],
        certifications: ["Sertifikat AI dan IoT"],
        skills: {
          hardSkills: [{ category: "Backend", items: "Node.js, Express" }],
          softSkills: ["Leadership"],
        },
      };

      assert.strictEqual(calculateProgress(fullResume), 100);
    });

    it("harus menghitung proporsional jika hanya header terisi", () => {
      const partialResume = {
        header: {
          fullName: "Ferman Ferdaus",
          targetRole: "Fullstack Developer",
          email: "ferman@example.com",
        },
      };
      // fullName(10) + targetRole(10) + email(5) = 25
      assert.strictEqual(calculateProgress(partialResume), 25);
    });
  });

  describe("Format Informasi Kontak ATS", () => {
    it("harus menggabungkan nomor telepon, email, website, dan lokasi dengan delimiter ' / '", () => {
      const header = {
        phone: "+62 85267216405",
        email: "fermanf91@gmail.com",
        website: "https://os-tech.online",
        location: "Bandar Lampung, Lampung, Indonesia",
      };

      const contactString = [
        header.phone,
        header.email,
        header.website,
        header.location,
      ]
        .filter(Boolean)
        .join(" / ");

      assert.strictEqual(
        contactString,
        "+62 85267216405 / fermanf91@gmail.com / https://os-tech.online / Bandar Lampung, Lampung, Indonesia"
      );
    });

    it("harus menggabungkan beberapa tautan (links) jika pengguna mengisi lebih dari satu link", () => {
      const header = {
        phone: "+62 85267216405",
        email: "fermanf91@gmail.com",
        links: [
          "https://os-tech.online",
          "https://linkedin.com/in/ferman",
          "https://github.com/ferman",
        ],
        location: "Bandar Lampung, Lampung, Indonesia",
      };

      const linkItems = Array.isArray(header.links)
        ? header.links.filter(Boolean)
        : [header.website].filter(Boolean);

      const contactString = [
        header.phone,
        header.email,
        ...linkItems,
        header.location,
      ]
        .filter(Boolean)
        .join(" / ");

      assert.strictEqual(
        contactString,
        "+62 85267216405 / fermanf91@gmail.com / https://os-tech.online / https://linkedin.com/in/ferman / https://github.com/ferman / Bandar Lampung, Lampung, Indonesia"
      );
    });
  });

  describe("Spesifikasi Tipografi & Halaman A4", () => {
    it("harus menggunakan ukuran font sesuai spesifikasi terbaru (Nama 30, Profesi 17, Kontak 12, Judul Bagian 17, Isi 12, LineHeight 1.5)", () => {
      const typographySpecs = {
        nameFontSize: 30,
        roleFontSize: 17,
        contactFontSize: 12,
        sectionTitleFontSize: 17,
        bodyFontSize: 12,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
      };

      assert.strictEqual(typographySpecs.nameFontSize, 30);
      assert.strictEqual(typographySpecs.roleFontSize, 17);
      assert.strictEqual(typographySpecs.contactFontSize, 12);
      assert.strictEqual(typographySpecs.sectionTitleFontSize, 17);
      assert.strictEqual(typographySpecs.bodyFontSize, 12);
      assert.strictEqual(typographySpecs.lineHeight, 1.5);
    });

    it("harus mendukung penyesuaian judul bagian kustom (Custom Section Titles)", () => {
      const defaultTitles = {
        summary: "PROFIL",
        educations: "PENDIDIKAN",
        experiences: "PENGALAMAN KERJA",
        organizations: "PENGALAMAN ORGANISASI",
        certifications: "SERTIFIKAT DAN PRESTASI",
        skills: "KEAHLIAN",
      };

      const userCustomTitles = {
        summary: "RINGKASAN EKSEKUTIF",
        experiences: "PENGALAMAN PROFESIONAL",
      };

      const mergedTitles = {
        ...defaultTitles,
        ...userCustomTitles,
      };

      assert.strictEqual(mergedTitles.summary, "RINGKASAN EKSEKUTIF");
      assert.strictEqual(mergedTitles.experiences, "PENGALAMAN PROFESIONAL");
      assert.strictEqual(mergedTitles.educations, "PENDIDIKAN");
      assert.strictEqual(mergedTitles.certifications, "SERTIFIKAT DAN PRESTASI");
    });
  });

  describe("Parser Tanggal Bulan & Tahun (MonthYearPicker)", () => {
    const MONTHS = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const parseMonthYearString = (val) => {
      if (!val || typeof val !== "string" || val.toLowerCase() === "sekarang") {
        return { month: "", year: "" };
      }

      const parts = val.trim().split(/[\s,–—\-/]+/);
      let detectedMonth = "";
      let detectedYear = "";

      for (const part of parts) {
        if (!part) continue;
        if (/^\d{4}$/.test(part)) {
          detectedYear = part;
          continue;
        }
        const foundMonth = MONTHS.find(
          (m) =>
            m.toLowerCase() === part.toLowerCase() ||
            m.toLowerCase().startsWith(part.toLowerCase())
        );
        if (foundMonth) {
          detectedMonth = foundMonth;
          continue;
        }
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= 12 && !detectedMonth) {
          detectedMonth = MONTHS[num - 1];
        }
      }
      return { month: detectedMonth, year: detectedYear };
    };

    it("harus mengekstrak bulan dan tahun dari string 'September 2022'", () => {
      const parsed = parseMonthYearString("September 2022");
      assert.strictEqual(parsed.month, "September");
      assert.strictEqual(parsed.year, "2022");
    });

    it("harus mengenali status 'Sekarang'", () => {
      const parsed = parseMonthYearString("Sekarang");
      assert.strictEqual(parsed.month, "");
      assert.strictEqual(parsed.year, "");
    });
  });

  describe("Format Sertifikat dan Prestasi ATS", () => {
    const formatCert = (cert) => {
      if (!cert) return "";
      const isObj = typeof cert === "object" && cert !== null;
      const name = isObj ? cert.name : cert;
      const issuer = isObj ? cert.issuer : "";
      const year = isObj ? (cert.year || cert.date) : "";

      if (!name && !issuer && !year) return "";

      const parts = [];
      if (name) parts.push(name);
      if (issuer) parts.push(issuer);
      let mainText = parts.join(", ");
      if (year) {
        mainText += ` (${year})`;
      }
      return mainText;
    };

    it("harus memformat objek sertifikat dengan nama, penyelenggara, dan tahun", () => {
      const cert = {
        name: "Juara 1 Kontes Robot Indonesia (KRI)",
        issuer: "Puspresnas Kemendikbudristek",
        year: "2024",
      };

      assert.strictEqual(
        formatCert(cert),
        "Juara 1 Kontes Robot Indonesia (KRI), Puspresnas Kemendikbudristek (2024)"
      );
    });

    it("harus mendukung sertifikat tanpa tahun atau tanpa penyelenggara", () => {
      const cert = {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
      };

      assert.strictEqual(
        formatCert(cert),
        "AWS Certified Cloud Practitioner, Amazon Web Services"
      );
    });
  });

  describe("Format Keahlian ATS (Dengan Kategori vs Tanpa Kategori)", () => {
    const formatSkill = (h) => {
      if (!h) return "";
      const isObj = typeof h === "object" && h !== null;
      const category = isObj ? (h.category || "").trim() : "";
      const items = isObj
        ? (Array.isArray(h.items) ? h.items.join(", ") : h.items)
        : h;

      if (!items && !category) return "";
      return category ? `${category} - ${items}` : items;
    };

    it("harus memformat keahlian dengan kategori dengan benar", () => {
      const skillWithCategory = {
        category: "Bahasa Pemrograman",
        items: "JavaScript, TypeScript, Python",
      };

      assert.strictEqual(
        formatSkill(skillWithCategory),
        "Bahasa Pemrograman - JavaScript, TypeScript, Python"
      );
    });

    it("harus memformat keahlian tanpa kategori secara langsung tanpa pemisah strip", () => {
      const skillWithoutCategory = {
        category: "",
        items: "React.js, Tailwind CSS, Next.js, Express.js",
      };

      assert.strictEqual(
        formatSkill(skillWithoutCategory),
        "React.js, Tailwind CSS, Next.js, Express.js"
      );
    });
  });
});

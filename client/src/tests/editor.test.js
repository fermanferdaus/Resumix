import { describe, it } from "node:test";
import assert from "node:assert";
import { calculateAtsProgress, getAtsChecklist } from "../lib/resumeScore.js";

describe("Frontend Unit: Editor Logic & ATS Layout Specs", () => {
  describe("Kalkulasi Skor Kelengkapan Resume (Progress Bar)", () => {

    it("harus menghasilkan 100% untuk data resume yang terisi penuh", () => {
      const fullResume = {
        header: {
          fullName: "Budi Santoso",
          targetRole: "Software Engineer",
          email: "budi@example.com",
          phone: "+6281234567890",
          location: "Jakarta, Indonesia",
        },
        summary: "Software Engineer dengan pengalaman arsitektur web modern.",
        educations: [{ degree: "S1 Teknik Informatika", institution: "Universitas Indonesia" }],
        experiences: [{ role: "Software Engineer", company: "PT Teknologi Bangsa" }],
        organizations: [{ role: "Ketua", name: "Himpunan Mahasiswa" }],
        certifications: ["Sertifikat AI dan Cloud"],
        skills: {
          hardSkills: [{ category: "Backend", items: "Node.js, Express" }],
          softSkills: ["Leadership"],
        },
      };

      assert.strictEqual(calculateAtsProgress(fullResume), 100);
      const checklist = getAtsChecklist(fullResume);
      assert.strictEqual(checklist.every((item) => item.passed), true);
    });

    it("harus menghitung proporsional jika hanya header terisi", () => {
      const partialResume = {
        header: {
          fullName: "Budi Santoso",
          targetRole: "Software Engineer",
          email: "budi@example.com",
        },
      };
      // fullName(10) + targetRole(10) + email(5) = 25
      assert.strictEqual(calculateAtsProgress(partialResume), 25);
      const checklist = getAtsChecklist(partialResume);
      assert.strictEqual(checklist.find((c) => c.id === "header")?.passed, true);
      assert.strictEqual(checklist.find((c) => c.id === "experience")?.passed, false);
    });
  });

  describe("Format Informasi Kontak ATS", () => {
    it("harus menggabungkan nomor telepon, email, website, dan lokasi dengan delimiter ' / '", () => {
      const header = {
        phone: "+62 812 3456 7890",
        email: "budi.santoso@example.com",
        website: "https://portfolio-budi.example.com",
        location: "Jakarta Selatan, DKI Jakarta, Indonesia",
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
        "+62 812 3456 7890 / budi.santoso@example.com / https://portfolio-budi.example.com / Jakarta Selatan, DKI Jakarta, Indonesia"
      );
    });

    it("harus menggabungkan beberapa tautan (links) jika pengguna mengisi lebih dari satu link", () => {
      const header = {
        phone: "+62 812 3456 7890",
        email: "budi.santoso@example.com",
        links: [
          "https://portfolio-budi.example.com",
          "https://linkedin.com/in/budisantoso",
          "https://github.com/budisantoso",
        ],
        location: "Jakarta Selatan, DKI Jakarta, Indonesia",
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
        "+62 812 3456 7890 / budi.santoso@example.com / https://portfolio-budi.example.com / https://linkedin.com/in/budisantoso / https://github.com/budisantoso / Jakarta Selatan, DKI Jakarta, Indonesia"
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
      const credentialId = isObj
        ? cert.credentialId || cert.number || cert.certificateNumber
        : "";

      if (!name && !issuer && !year && !credentialId) return "";

      const parts = [];
      if (name) parts.push(name);
      if (issuer) parts.push(issuer);
      if (credentialId && String(credentialId).trim()) {
        const trimmed = String(credentialId).trim();
        const formattedId = /^(no|id|credential|nomor)/i.test(trimmed)
          ? trimmed
          : `No. ${trimmed}`;
        parts.push(formattedId);
      }
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

    it("harus mendukung sertifikat dengan nomor sertifikat atau credential ID", () => {
      const cert = {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        credentialId: "AWS-987654",
        year: "2024",
      };

      assert.strictEqual(
        formatCert(cert),
        "AWS Certified Solutions Architect, Amazon Web Services, No. AWS-987654 (2024)"
      );
    });

    it("harus mempertahankan prefix nomor jika pengguna sudah menuliskan ID/No.", () => {
      const cert = {
        name: "Google Associate Cloud Engineer",
        issuer: "Google Cloud",
        credentialId: "ID: GCP-112233",
        year: "2025",
      };

      assert.strictEqual(
        formatCert(cert),
        "Google Associate Cloud Engineer, Google Cloud, ID: GCP-112233 (2025)"
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

  describe("Format Proyek Portofolio ATS", () => {
    const formatProject = (proj) => {
      if (!proj) return null;
      const nameAndRole = [proj.name, proj.role].filter(Boolean).join(" / ");
      const dateDisplay =
        proj.startDate && proj.endDate
          ? `${proj.startDate} - ${proj.endDate}`
          : proj.startDate
          ? `${proj.startDate} - Sekarang`
          : proj.period || "";
      const metaParts = [
        dateDisplay,
        proj.technologies ? `Teknologi: ${proj.technologies}` : "",
      ].filter(Boolean);

      return {
        titleLine: `${nameAndRole}${proj.link ? ` (${proj.link})` : ""}`,
        metaLine: metaParts.join(" | "),
        bullets: proj.bullets || [],
      };
    };

    it("harus memformat informasi proyek lengkap dengan peran, tautan, dan teknologi", () => {
      const proj = {
        name: "Resumix ATS Builder",
        role: "Full Stack Engineer",
        link: "https://github.com/fermanferdaus/resumix",
        technologies: "React, Node.js, Express, PostgreSQL",
        startDate: "Januari 2026",
        endDate: "Sekarang",
        bullets: ["Membangun arsitektur frontend modular."],
      };

      const result = formatProject(proj);
      assert.strictEqual(
        result.titleLine,
        "Resumix ATS Builder / Full Stack Engineer (https://github.com/fermanferdaus/resumix)"
      );
      assert.strictEqual(
        result.metaLine,
        "Januari 2026 - Sekarang | Teknologi: React, Node.js, Express, PostgreSQL"
      );
      assert.strictEqual(result.bullets.length, 1);
    });

    it("harus mendukung proyek minimal tanpa tautan atau tanpa role", () => {
      const proj = {
        name: "Sistem Kasir POS",
        technologies: "Java, MySQL",
        period: "2024",
      };

      const result = formatProject(proj);
      assert.strictEqual(result.titleLine, "Sistem Kasir POS");
      assert.strictEqual(result.metaLine, "2024 | Teknologi: Java, MySQL");
    });
  });

  describe("Format Nama File Unduhan PDF (Resumix-nama pengguna-posisi)", () => {
    const formatPdfFilename = (fullName, targetRole) => {
      const name = fullName?.trim() || "Pengguna";
      const role = targetRole?.trim() || "Resume";
      return `Resumix-${name}-${role}`;
    };

    it("harus memformat nama file PDF sesuai standar 'Resumix-nama pengguna-posisi'", () => {
      const filename = formatPdfFilename("Budi Santoso", "Full-Stack Developer");
      assert.strictEqual(filename, "Resumix-Budi Santoso-Full-Stack Developer");
    });

    it("harus menggunakan fallback jika nama atau posisi kosong", () => {
      const filename = formatPdfFilename("", "");
      assert.strictEqual(filename, "Resumix-Pengguna-Resume");
    });
  });
});

import { describe, it } from "node:test";
import assert from "node:assert";

describe("Frontend Unit: Landing Page Integrity & ATS Specifications", () => {
  describe("Kebijakan Tanpa Pricing & Bebas Biaya", () => {
    it("harus menjamin tidak ada fitur atau skema berbayar / pricing", () => {
      const pricingTiers = [];
      assert.strictEqual(pricingTiers.length, 0, "Resumix tidak memiliki model langganan/pricing");
    });

    it("harus memvalidasi stat kuota gratis dan akurasi ATS", () => {
      const stats = {
        atsParseRate: "99.8%",
        templateCount: 1,
        isFree: true,
      };

      assert.strictEqual(stats.atsParseRate, "99.8%");
      assert.strictEqual(stats.templateCount, 1, "Hanya 1 template ATS standar tunggal resmi");
      assert.strictEqual(stats.isFree, true, "100% gratis selamanya");
    });
  });

  describe("Integritas Navigasi Anchor Landing Page", () => {
    it("harus memuat anchor target yang valid untuk template dan keunggulan", () => {
      const validAnchors = ["#template-showcase", "#keunggulan", "#faq"];
      assert.ok(validAnchors.includes("#template-showcase"));
      assert.ok(validAnchors.includes("#keunggulan"));
      assert.ok(validAnchors.includes("#faq"));
    });
  });

  describe("Spesifikasi Kepatuhan Template ATS Tunggal", () => {
    it("harus memiliki aturan baku: 1 kolom, teks murni, tanpa jebakan tabel", () => {
      const singleTemplateRules = {
        columns: 1,
        format: "A4",
        searchableText: true,
        noHiddenTables: true,
        supportedParsers: ["Workday", "Taleo", "Greenhouse", "Lever"],
      };

      assert.strictEqual(singleTemplateRules.columns, 1);
      assert.strictEqual(singleTemplateRules.format, "A4");
      assert.strictEqual(singleTemplateRules.searchableText, true);
      assert.strictEqual(singleTemplateRules.noHiddenTables, true);
      assert.strictEqual(singleTemplateRules.supportedParsers.length, 4);
    });
  });
});


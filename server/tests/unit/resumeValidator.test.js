import { describe, it } from "node:test";
import assert from "node:assert";
import {
  createResumeSchema,
  updateResumeSchema,
  queryResumeSchema,
} from "../../validators/resumeValidator.js";
import { MAX_RESUMES_PER_USER } from "../../services/resumeService.js";

describe("Unit: Zod Resume Validators", () => {
  describe("createResumeSchema", () => {
    it("harus meloloskan payload dengan title yang valid", () => {
      const result = createResumeSchema.safeParse({
        title: "Software Engineer ATS CV",
        targetRole: "Frontend Developer",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.title, "Software Engineer ATS CV");
    });

    it("harus menolak jika title kosong", () => {
      const result = createResumeSchema.safeParse({
        title: "",
      });
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.issues[0].message, "Judul resume tidak boleh kosong.");
    });
  });

  describe("updateResumeSchema", () => {
    it("harus meloloskan pembaruan judul atau data", () => {
      const result = updateResumeSchema.safeParse({
        title: "Updated CV Title",
        data: { summary: "Senior Full Stack Dev" },
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.title, "Updated CV Title");
    });
  });

  describe("queryResumeSchema", () => {
    it("harus mengonversi query page dan limit ke number dengan default", () => {
      const result = queryResumeSchema.safeParse({});
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.page, 1);
      assert.strictEqual(result.data.limit, 10);
    });

    it("harus mem-parsing string angka pada page dan limit", () => {
      const result = queryResumeSchema.safeParse({
        page: "2",
        limit: "15",
        search: "developer",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.page, 2);
      assert.strictEqual(result.data.limit, 15);
      assert.strictEqual(result.data.search, "developer");
    });
  });

  describe("Kebijakan Kuota Resume Pengguna", () => {
    it("harus menetapkan batas maksimal 5 resume per akun", () => {
      assert.strictEqual(MAX_RESUMES_PER_USER, 5);
    });
  });
});

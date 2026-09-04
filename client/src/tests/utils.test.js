import { describe, it } from "node:test";
import assert from "node:assert";
import { cn } from "../lib/utils.js";

describe("Frontend Unit: Utils (cn Tailwind Merge)", () => {
  it("harus menggabungkan classNames bersyarat dengan benar", () => {
    const isActive = true;
    const isHidden = false;
    const result = cn("base-class", isActive && "active-class", isHidden && "hidden-class");
    assert.strictEqual(result, "base-class active-class");
  });

  it("harus menyelesaikan konflik Tailwind class dengan mendahulukan class terakhir", () => {
    const result = cn("p-4 bg-red-500", "p-6 bg-blue-500");
    assert.strictEqual(result, "p-6 bg-blue-500");
  });
});

describe("Frontend Unit: Date Utilities (formatDateTimeWIB)", () => {
  it("harus memformat ISO string ke standar WIB dengan format 'DD Mon YY, HH.MM.SS WIB'", async () => {
    const { formatDateTimeWIB } = await import("../lib/date.js");
    // Waktu UTC: 2026-09-12T04:08:17.000Z -> WIB (+7): 11.08.17
    const result = formatDateTimeWIB("2026-09-12T04:08:17.000Z");
    assert.ok(result.includes("12 Sep 26"));
    assert.ok(result.includes("WIB"));
    assert.ok(result.includes("11.08.17"));
  });

  it("harus mengembalikan '-' jika tanggal tidak valid atau kosong", async () => {
    const { formatDateTimeWIB } = await import("../lib/date.js");
    assert.strictEqual(formatDateTimeWIB(null), "-");
    assert.strictEqual(formatDateTimeWIB(""), "-");
    assert.strictEqual(formatDateTimeWIB("invalid-date"), "-");
  });
});


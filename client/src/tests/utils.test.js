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

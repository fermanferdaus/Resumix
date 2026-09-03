import { describe, it } from "node:test";
import assert from "node:assert";
import { generatePublicId } from "../../utils/id.js";

describe("Unit: Utility ID Generator (UUIDv7)", () => {
  it("harus menghasilkan string UUIDv7 36 karakter yang valid", () => {
    const id = generatePublicId();
    assert.strictEqual(typeof id, "string");
    assert.strictEqual(id.length, 36);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    assert.match(id, uuidRegex, "ID harus sesuai spesifikasi UUIDv7");
  });

  it("harus menghasilkan ID unik di setiap pemanggilan", () => {
    const id1 = generatePublicId();
    const id2 = generatePublicId();
    assert.notStrictEqual(id1, id2, "Dua pemanggilan berurutan tidak boleh menghasilkan ID yang sama");
  });
});

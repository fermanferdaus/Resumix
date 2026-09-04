import { describe, it } from "node:test";
import assert from "node:assert";
import { isAdmin, requireRole } from "../../middlewares/roleMiddleware.js";
import { resolveIpLocation, parseUserAgent } from "../../services/geoService.js";

describe("Unit: Admin RBAC & Geo Location Services", () => {
  describe("roleMiddleware (RBAC Guard)", () => {
    it("harus menolak request dengan status 403 jika req.user bukan ADMIN", () => {
      let statusCode = null;
      let jsonPayload = null;
      let nextCalled = false;

      const req = {
        user: { id: "user-1", email: "user@test.com", role: "USER" },
      };
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(payload) {
          jsonPayload = payload;
          return this;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      isAdmin(req, res, next);

      assert.strictEqual(nextCalled, false, "next() tidak boleh dipanggil");
      assert.strictEqual(statusCode, 403, "Harus mengembalikan HTTP 403 Forbidden");
      assert.strictEqual(jsonPayload.success, false);
      assert(jsonPayload.message.includes("Akses ditolak"));
    });

    it("harus mengizinkan request jika req.user memiliki role ADMIN", () => {
      let nextCalled = false;

      const req = {
        user: { id: "admin-1", email: "admin@test.com", role: "ADMIN" },
      };
      const res = {};
      const next = () => {
        nextCalled = true;
      };

      isAdmin(req, res, next);

      assert.strictEqual(nextCalled, true, "next() harus dipanggil untuk role ADMIN");
    });

    it("harus mendukung multiple roles dengan requireRole", () => {
      const middleware = requireRole("ADMIN", "SUPERADMIN");
      let nextCalled = false;

      middleware({ user: { role: "SUPERADMIN" } }, {}, () => {
        nextCalled = true;
      });

      assert.strictEqual(nextCalled, true);
    });
  });

  describe("geoService (IP Geolocation & UA Parser)", () => {
    it("harus mengenali IP localhost / internal network", () => {
      const local1 = resolveIpLocation("127.0.0.1");
      assert.strictEqual(local1.country, "Local");
      assert(local1.location.includes("Localhost"));

      const local2 = resolveIpLocation("::1");
      assert.strictEqual(local2.country, "Local");

      const local3 = resolveIpLocation("192.168.1.100");
      assert.strictEqual(local3.country, "Local");
    });

    it("harus mem-parsing User-Agent Desktop dan Mobile dengan tepat", () => {
      const desktopUa =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const desktop = parseUserAgent(desktopUa);
      assert.strictEqual(desktop.device, "Desktop");
      assert.strictEqual(desktop.os, "Windows");
      assert.strictEqual(desktop.browser, "Chrome");

      const mobileUa =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
      const mobile = parseUserAgent(mobileUa);
      assert.strictEqual(mobile.device, "Mobile");
      assert.strictEqual(mobile.os, "iOS");
      assert.strictEqual(mobile.browser, "Safari");
    });
  });
});

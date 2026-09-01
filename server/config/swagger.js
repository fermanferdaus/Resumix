/**
 * OpenAPI 3.0 Specification for Resumix API
 */
export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Resumix API Documentation",
    version: "1.0.0",
    description:
      "Dokumentasi API interaktif untuk backend Resumix API. Menyediakan modul autentikasi (Dual JWT, OTP email, password hashing bcrypt, Google OAuth 2.0 SSO).",
    contact: {
      name: "Resumix Engineering",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1 Endpoint",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Masukkan Access Token JWT (Bearer)",
      },
    },
    schemas: {
      StandardSuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operasi berhasil" },
          data: { type: "object", nullable: true },
          errors: { type: "null", example: null },
        },
      },
      StandardErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Terjadi kesalahan validasi" },
          data: { type: "null", example: null },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Format email tidak valid" },
              },
            },
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "01a0586e-e733-7345-8fc1-6c50cbdfb931" },
          email: { type: "string", format: "email", example: "alex.davis@example.com" },
          fullName: { type: "string", example: "Alex Davis" },
          isVerified: { type: "boolean", example: true },
          avatarUrl: { type: "string", nullable: true, example: null },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      SendOtpRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "alex.davis@example.com" },
        },
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["email", "code"],
        properties: {
          email: { type: "string", format: "email", example: "alex.davis@example.com" },
          code: { type: "string", example: "123456", description: "6 digit numeric OTP" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["email", "fullName", "password", "retypePassword"],
        properties: {
          email: { type: "string", format: "email", example: "alex.davis@example.com" },
          fullName: { type: "string", example: "Alex Davis" },
          password: { type: "string", format: "password", example: "Password123!" },
          retypePassword: { type: "string", format: "password", example: "Password123!" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "alex.davis@example.com" },
          password: { type: "string", format: "password", example: "Password123!" },
        },
      },
      GoogleAuthRequest: {
        type: "object",
        required: ["idToken"],
        properties: {
          idToken: { type: "string", example: "eyJhbGciOiJSUzI1NiIsImtpZCI6..." },
        },
      },
      RefreshTokenRequest: {
        type: "object",
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health Check Server & Database",
        tags: ["System"],
        responses: {
          200: {
            description: "Server dan PostgreSQL sehat",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          503: {
            description: "Koneksi database bermasalah",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/send-otp": {
      post: {
        summary: "Kirim 6-digit kode OTP ke email",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SendOtpRequest" } } },
        },
        responses: {
          200: {
            description: "OTP berhasil dibuat dan dikirim",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          422: {
            description: "Validasi gagal",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/verify-otp": {
      post: {
        summary: "Verifikasi kode OTP",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VerifyOtpRequest" } } },
        },
        responses: {
          200: {
            description: "OTP valid. Mengembalikan status registrasi atau session login jika user sudah lengkap",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          400: {
            description: "OTP salah atau kadaluarsa",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Lengkapi profil pengguna & registrasi password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } },
        },
        responses: {
          201: {
            description: "Registrasi berhasil, mengembalikan token akses & user",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          422: {
            description: "Validasi gagal (misal: password tidak cocok)",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login menggunakan Email dan Password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
        },
        responses: {
          200: {
            description: "Login berhasil, mengembalikan Access Token dan set Refresh Token Cookie",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          401: {
            description: "Email atau password tidak sesuai",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/google": {
      post: {
        summary: "Login / Registrasi via Google OAuth 2.0 SSO",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GoogleAuthRequest" } } },
        },
        responses: {
          200: {
            description: "Autentikasi Google berhasil",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          400: {
            description: "Token Google tidak valid",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        summary: "Perbarui Access Token menggunakan Refresh Token",
        tags: ["Authentication"],
        requestBody: {
          required: false,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenRequest" } } },
        },
        responses: {
          200: {
            description: "Access token baru berhasil dibuat",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          401: {
            description: "Refresh token tidak valid atau kadaluarsa",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        summary: "Logout dan cabut status aktif Refresh Token",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "Logout berhasil dan cookie dibersihkan",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Ambil data profil pengguna yang sedang login",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Data profil berhasil diambil",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccessResponse" } } },
          },
          401: {
            description: "Token tidak valid atau belum login",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardErrorResponse" } } },
          },
        },
      },
    },
    "/resumes": {
      get: {
        summary: "Daftar resume milik pengguna",
        tags: ["Resumes"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Pencarian judul atau posisi" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Daftar resume berhasil diambil" },
          401: { description: "Belum terautentikasi" },
        },
      },
      post: {
        summary: "Buat resume baru",
        tags: ["Resumes"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Senior Frontend Engineer 2026" },
                  targetRole: { type: "string", example: "Full Stack Developer" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Resume berhasil dibuat" },
          422: { description: "Validasi gagal" },
        },
      },
    },
    "/resumes/{id}": {
      get: {
        summary: "Detail resume berdasarkan Public UUIDv7",
        tags: ["Resumes"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Detail resume" },
          404: { description: "Resume tidak ditemukan" },
        },
      },
      put: {
        summary: "Perbarui resume",
        tags: ["Resumes"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Resume berhasil diperbarui" },
        },
      },
      delete: {
        summary: "Hapus resume",
        tags: ["Resumes"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Resume berhasil dihapus" },
        },
      },
    },
    "/resumes/{id}/duplicate": {
      post: {
        summary: "Duplikasi resume",
        tags: ["Resumes"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          201: { description: "Resume berhasil diduplikasi" },
        },
      },
    },
  },
};

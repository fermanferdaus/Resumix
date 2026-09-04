/**
 * Helper to mock backend API requests for Playwright E2E tests
 */

export const mockDefaultUser = {
  id: "user-123",
  fullName: "Ferman Ferdaus",
  name: "Ferman Ferdaus",
  email: "fermanf91@gmail.com",
  phone: "+62 812 3456 7890",
  bio: "Senior Full Stack Developer",
  avatarUrl: null,
};

export const mockDefaultResumeData = {
  header: {
    fullName: "Raditya Pratama",
    targetRole: "Senior Full Stack Developer",
    email: "raditya.pratama@email.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    links: ["linkedin.com/in/radityapratama", "github.com/radityapratama"],
  },
  summary:
    "Software Engineer berpengalaman 6+ tahun dalam membangun sistem web performa tinggi berskala besar.",
  experiences: [
    {
      id: "exp-1",
      jobTitle: "Lead Software Engineer",
      company: "PT Inovasi Digital Nusantara",
      city: "Jakarta",
      startDate: "Januari 2022",
      endDate: "Sekarang",
      current: true,
      bullets: [
        "Memimpin tim 8 orang mengembangkan sistem web berskala besar.",
        "Memangkas waktu deployment dari 4 jam menjadi 15 menit menggunakan CI/CD.",
      ],
    },
  ],
  educations: [
    {
      id: "edu-1",
      degree: "Sarjana Komputer (S.Kom.)",
      institution: "Universitas Indonesia",
      city: "Depok",
      startDate: "2015",
      endDate: "2019",
      current: false,
      gpa: "3.82",
    },
  ],
  skills: {
    hardSkills: [
      { category: "Bahasa", items: "JavaScript, TypeScript, Go, SQL" },
      { category: "Framework", items: "React, Node.js, Express, Next.js" },
    ],
    softSkills: ["Kepemimpinan Tim", "Komunikasi Teknis", "Pemecahan Masalah"],
  },
  organizations: [
    {
      id: "org-1",
      role: "Koordinator Riset & Teknologi",
      organization: "Himpunan Mahasiswa Ilmu Komputer",
      startDate: "2018",
      endDate: "2019",
      current: false,
      bullets: [
        "Menginisiasi workshop teknologi pemrograman diikuti 200+ peserta.",
        "Mengelola portal web internal organisasi.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023",
      credentialId: "AWS-12345",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Resumix ATS Builder",
      role: "Lead Developer",
      techStack: "React, Node.js, PostgreSQL",
      link: "https://resumix.id",
      bullets: [
        "Platform CV ATS online dengan live parsing preview dan export PDF.",
      ],
    },
  ],
  sectionOrder: [
    "header",
    "summary",
    "experiences",
    "educations",
    "skills",
    "organizations",
    "certifications",
    "projects",
  ],
};

export const mockDefaultResume = {
  id: "res-test-1",
  userId: "user-123",
  title: "CV Software Engineer ATS",
  targetRole: "Senior Full Stack Developer",
  templateId: "ats-classic-1",
  data: mockDefaultResumeData,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Setup default mock API routes for a page
 */
export async function setupApiMocks(page, options = {}) {
  const {
    resumes = [mockDefaultResume],
    user = mockDefaultUser,
  } = options;

  // Intercept all API calls under /api/v1/
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();
    const origin = request.headers()["origin"] || "http://localhost:5173";

    const corsHeaders = {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization, X-Requested-With",
      "access-control-allow-credentials": "true",
    };

    if (method === "OPTIONS") {
      return route.fulfill({
        status: 204,
        headers: corsHeaders,
      });
    }

    const respond = (status, payload) =>
      route.fulfill({
        status,
        headers: corsHeaders,
        contentType: "application/json",
        body: JSON.stringify(payload),
      });

    // 1. Auth check: /api/v1/auth/me
    if (path.endsWith("/auth/me")) {
      return respond(200, {
        success: true,
        data: user,
      });
    }

    // 2. Auth Login: /api/v1/auth/login
    if (path.endsWith("/auth/login") && method === "POST") {
      const body = route.request().postDataJSON() || {};
      if (body.email === "salah@example.com") {
        return respond(401, {
          success: false,
          message: "Email atau kata sandi tidak cocok",
        });
      }
      return respond(200, {
        success: true,
        message: "Login berhasil",
        data: {
          user,
          accessToken: "mock-valid-jwt-token",
        },
      });
    }

    // 3. Auth Check Email
    if (path.endsWith("/auth/check-email") && method === "POST") {
      return respond(200, {
        success: true,
        available: true,
      });
    }

    // 4. Auth Send OTP
    if (path.endsWith("/auth/send-otp") && method === "POST") {
      return respond(200, {
        success: true,
        message: "Kode OTP telah dikirim ke email Anda",
      });
    }

    // 5. Auth Register: /api/v1/auth/register
    if (path.endsWith("/auth/register") && method === "POST") {
      return respond(200, {
        success: true,
        message: "Pendaftaran berhasil",
        data: {
          user,
          accessToken: "mock-valid-jwt-token",
        },
      });
    }

    // 6. Auth Verify OTP: /api/v1/auth/verify-otp
    if (path.endsWith("/auth/verify-otp") && method === "POST") {
      return respond(200, {
        success: true,
        message: "Verifikasi email berhasil",
        data: {
          user,
          accessToken: "mock-valid-jwt-token",
        },
      });
    }

    // 7. Auth Forgot Password: /api/v1/auth/forgot-password
    if (path.endsWith("/auth/forgot-password") && method === "POST") {
      return respond(200, {
        success: true,
        message: "Tautan reset kata sandi telah dikirim ke email Anda",
      });
    }

    // 8. Auth Reset Password: /api/v1/auth/reset-password
    if (path.includes("/auth/reset-password") && method === "POST") {
      return respond(200, {
        success: true,
        message: "Kata sandi berhasil diperbarui. Silakan login kembali.",
      });
    }

    // 9. Resumes List: GET /api/v1/resumes
    if (path.endsWith("/resumes") && method === "GET") {
      const search = url.searchParams.get("search");
      let filtered = resumes;
      if (search) {
        const s = search.toLowerCase();
        filtered = resumes.filter(
          (r) =>
            (r.title && r.title.toLowerCase().includes(s)) ||
            (r.targetRole && r.targetRole.toLowerCase().includes(s))
        );
      }
      return respond(200, {
        success: true,
        data: filtered,
      });
    }

    // 10. Create Resume: POST /api/v1/resumes
    if (path.endsWith("/resumes") && method === "POST") {
      const body = route.request().postDataJSON() || {};
      const newResume = {
        ...mockDefaultResume,
        id: "res-new-" + Date.now(),
        title: body.title || "CV Baru Tanpa Judul",
        targetRole: body.targetRole || "Software Engineer",
      };
      return respond(201, {
        success: true,
        message: "Resume berhasil dibuat",
        data: newResume,
      });
    }

    // 11. Single Resume: GET /api/v1/resumes/:id
    if (path.match(/\/resumes\/[^/]+$/) && method === "GET") {
      const id = path.split("/").pop();
      const target = resumes.find((r) => r.id === id) || {
        ...mockDefaultResume,
        id,
      };
      return respond(200, {
        success: true,
        data: target,
      });
    }

    // 12. Update Resume: PUT /api/v1/resumes/:id
    if (path.match(/\/resumes\/[^/]+$/) && method === "PUT") {
      const body = route.request().postDataJSON() || {};
      return respond(200, {
        success: true,
        message: "Resume berhasil disimpan",
        data: { ...mockDefaultResume, ...body },
      });
    }

    // 13. Delete Resume: DELETE /api/v1/resumes/:id
    if (path.match(/\/resumes\/[^/]+$/) && method === "DELETE") {
      return respond(200, {
        success: true,
        message: "Resume berhasil dihapus",
      });
    }

    // 14. Profile: GET /api/v1/users/profile
    if (path.endsWith("/users/profile") && method === "GET") {
      return respond(200, {
        success: true,
        data: user,
      });
    }

    // 15. Update Profile: PUT /api/v1/users/profile
    if (path.endsWith("/users/profile") && method === "PUT") {
      const body = route.request().postDataJSON() || {};
      return respond(200, {
        success: true,
        message: "Profil berhasil diperbarui",
        data: { ...user, ...body },
      });
    }

    // 16. Change Password: PUT /api/v1/users/change-password
    if (path.endsWith("/users/change-password") && method === "PUT") {
      return respond(200, {
        success: true,
        message: "Kata sandi berhasil diubah",
      });
    }

    // Fallback: Default 200 OK
    return respond(200, { success: true, message: "OK" });
  });
}

/**
 * Helper to simulate an authenticated user session
 */
export async function authenticateSession(page, user = mockDefaultUser) {
  await page.addInitScript(() => {
    localStorage.setItem("resumix_access_token", "mock-e2e-access-token");
  });
  await setupApiMocks(page, { user });
}

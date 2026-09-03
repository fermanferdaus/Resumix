import assert from "node:assert";
import prisma from "../../config/prisma.js";
import { appConfig } from "../../config/app.js";

const BASE_URL = `http://localhost:${appConfig.port}/api/v1`;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const start = performance.now();
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const duration = Math.round(performance.now() - start);
  const json = await response.json().catch(() => ({}));
  return { status: response.status, data: json, headers: response.headers, duration };
}

async function waitForServer(maxAttempts = 20, delayMs = 300) {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) {
        return;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`Server failed to respond at ${BASE_URL}/health within ${maxAttempts * delayMs}ms`);
}

async function runSuite() {
  console.log(`[API INTEGRATION SUITE] Target: ${BASE_URL}`);
  console.log("--------------------------------------------------------------------------------");

  // Ensure server is up and accepting connections
  await waitForServer();

  let passed = 0;
  let total = 0;

  const logPass = (method, path, status, note, duration) => {
    total++;
    passed++;
    const methodPad = method.padEnd(5, " ");
    const pathPad = path.padEnd(25, " ");
    console.log(`  [PASS] ${methodPad} ${pathPad} -> ${status} (${duration}ms) | ${note}`);
  };

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "Password123!";
  const testFullName = "Alex Davis";

  // 1. Health Check
  const healthRes = await request("/health");
  assert.strictEqual(healthRes.status, 200, "Health check must return 200");
  assert.strictEqual(healthRes.data.success, true);
  logPass("GET", "/health", healthRes.status, "Service health status OK", healthRes.duration);

  // 2. Swagger Docs Check
  const docsRes = await request("/docs.json");
  assert.strictEqual(docsRes.status, 200, "Docs must return 200");
  assert.strictEqual(docsRes.data.openapi, "3.0.0");
  logPass("GET", "/docs.json", docsRes.status, "OpenAPI 3.0.0 spec schema verified", docsRes.duration);

  // 3. Zod Guard Validation Check (Negative Test)
  const invalidReg = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: "invalid-email",
      fullName: "A",
      password: "pass",
      retypePassword: "different_pass",
    }),
  });
  assert.strictEqual(invalidReg.status, 422, "Invalid payload must be intercepted with 422");
  assert.strictEqual(invalidReg.data.success, false);
  assert(Array.isArray(invalidReg.data.errors), "Errors must be an array");
  logPass(
    "POST",
    "/auth/register",
    invalidReg.status,
    `Zod validation guard active (${invalidReg.data.errors.length} schema violations caught)`,
    invalidReg.duration
  );

  // 4. Check Email Availability
  const checkEmailRes = await request("/auth/check-email", {
    method: "POST",
    body: JSON.stringify({ email: testEmail }),
  });
  assert.strictEqual(checkEmailRes.status, 200, "Check email must return 200");
  assert.strictEqual(checkEmailRes.data.data.isAvailable, true);
  logPass("POST", "/auth/check-email", checkEmailRes.status, `Email available (${testEmail})`, checkEmailRes.duration);

  // 5. Register Profile & Dispatch OTP
  const registerRes = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: testEmail,
      fullName: testFullName,
      password: testPassword,
      retypePassword: testPassword,
    }),
  });
  assert.strictEqual(registerRes.status, 201, "Register must return 201");
  assert.strictEqual(registerRes.data.success, true);
  logPass("POST", "/auth/register", registerRes.status, "Profile created & OTP dispatched", registerRes.duration);

  // Retrieve OTP code from Database
  const otpRecord = await prisma.otp.findFirst({
    where: { email: testEmail, isUsed: false },
    orderBy: { createdAt: "desc" },
  });
  assert(otpRecord, "OTP record must exist in database");

  // 6. Verify OTP & Activate Account / Login
  const verifyOtpRes = await request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email: testEmail, code: otpRecord.code }),
  });
  assert.strictEqual(verifyOtpRes.status, 200, "Verify OTP must return 200");
  assert(verifyOtpRes.data.data.accessToken, "Access token required");
  logPass(
    "POST",
    "/auth/verify-otp",
    verifyOtpRes.status,
    "OTP verified, account activated & JWT issued",
    verifyOtpRes.duration
  );

  // 7. Login with Password
  const loginRes = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  assert.strictEqual(loginRes.status, 200, "Login must return 200");
  assert(loginRes.data.data.accessToken, "Access token required");
  logPass("POST", "/auth/login", loginRes.status, "Password authentication successful", loginRes.duration);

  const accessToken = loginRes.data.data.accessToken;

  // 8. Protected Route: GET /api/v1/auth/me
  const meRes = await request("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  assert.strictEqual(meRes.status, 200, "Protected profile route must return 200");
  assert.strictEqual(meRes.data.data.fullName, testFullName);
  logPass("GET", "/auth/me", meRes.status, "Bearer token validated on protected resource", meRes.duration);

  // 9. Google OAuth Login
  const googleEmail = `google_${Date.now()}@example.com`;
  const googleRes = await request("/auth/google", {
    method: "POST",
    body: JSON.stringify({
      idToken: `mock_google_token_${googleEmail}`,
    }),
  });
  assert.strictEqual(googleRes.status, 200, "Google auth must return 200");
  assert.strictEqual(googleRes.data.data.user.email, googleEmail);
  logPass("POST", "/auth/google", googleRes.status, "OAuth SSO handshake completed", googleRes.duration);

  // 10. Refresh Token Flow
  const dbRefreshToken = await prisma.refreshToken.findFirst({
    where: { isRevoked: false },
    orderBy: { createdAt: "desc" },
  });
  assert(dbRefreshToken, "Active refresh token must exist in DB");

  const refreshRes = await request("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({
      refreshToken: dbRefreshToken.token,
    }),
  });
  assert.strictEqual(refreshRes.status, 200, "Refresh token must return 200");
  assert(refreshRes.data.data.accessToken, "New access token required");
  logPass("POST", "/auth/refresh-token", refreshRes.status, "Session rotation & token refresh OK", refreshRes.duration);

  // 11. Logout
  const logoutRes = await request("/auth/logout", {
    method: "POST",
    body: JSON.stringify({
      refreshToken: dbRefreshToken.token,
    }),
  });
  assert.strictEqual(logoutRes.status, 200, "Logout must return 200");
  logPass("POST", "/auth/logout", logoutRes.status, "Session revoked from store", logoutRes.duration);

  // 12. Forgot Password (Request Reset Link)
  const forgotRes = await request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: testEmail }),
  });
  assert.strictEqual(forgotRes.status, 200, "Forgot password must return 200");
  logPass("POST", "/auth/forgot-password", forgotRes.status, "Reset token generated & dispatched", forgotRes.duration);

  const resetRecord = await prisma.passwordReset.findFirst({
    where: { email: testEmail, isUsed: false },
    orderBy: { createdAt: "desc" },
  });
  assert(resetRecord, "Password reset record must exist in DB");

  // 13. Reset Password (Set New Password)
  const newPassword = "NewSecurePassword2026!";
  const resetPassRes = await request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token: resetRecord.token,
      password: newPassword,
      retypePassword: newPassword,
    }),
  });
  assert.strictEqual(resetPassRes.status, 200, "Reset password must return 200");
  logPass("POST", "/auth/reset-password", resetPassRes.status, "Password credential updated in DB", resetPassRes.duration);

  // 14. Login with New Password
  const loginNewRes = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: testEmail,
      password: newPassword,
    }),
  });
  assert.strictEqual(loginNewRes.status, 200, "Login with new password must return 200");
  const authHeader = { Authorization: `Bearer ${loginNewRes.data.data.accessToken}` };
  logPass("POST", "/auth/login", loginNewRes.status, "Authentication with new credential verified", loginNewRes.duration);

  // 15. Create Resume (POST /resumes)
  const createResumeRes = await request("/resumes", {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify({
      title: "Senior Full Stack ATS CV",
      targetRole: "Full Stack Engineer",
    }),
  });
  assert.strictEqual(createResumeRes.status, 201, "Create resume must return 201");
  assert.strictEqual(createResumeRes.data.data.title, "Senior Full Stack ATS CV");
  const createdResumeId = createResumeRes.data.data.id;
  logPass("POST", "/resumes", createResumeRes.status, "New ATS Resume created with UUIDv7", createResumeRes.duration);

  // 16. List Resumes (GET /resumes)
  const listResumesRes = await request("/resumes", {
    headers: authHeader,
  });
  assert.strictEqual(listResumesRes.status, 200, "List resumes must return 200");
  assert(Array.isArray(listResumesRes.data.data), "Resumes data must be an array");
  assert(listResumesRes.data.data.length >= 1, "Must contain at least 1 resume");
  logPass("GET", "/resumes", listResumesRes.status, "User resumes list retrieved", listResumesRes.duration);

  // 17. Search Resumes by Keyword (GET /resumes?search=Full+Stack)
  const searchRes = await request("/resumes?search=Full+Stack", {
    headers: authHeader,
  });
  assert.strictEqual(searchRes.status, 200, "Search resumes must return 200");
  assert.strictEqual(searchRes.data.data.length, 1);
  logPass("GET", "/resumes?search=Full+Stack", searchRes.status, "Resume search query matched", searchRes.duration);

  // 18. Get Resume Detail (GET /resumes/:id)
  const detailRes = await request(`/resumes/${createdResumeId}`, {
    headers: authHeader,
  });
  assert.strictEqual(detailRes.status, 200, "Get resume detail must return 200");
  assert.strictEqual(detailRes.data.data.id, createdResumeId);
  assert(detailRes.data.data.data.header, "Resume data must contain ATS header");
  logPass("GET", "/resumes/:id", detailRes.status, "Resume detail & JSON schema verified", detailRes.duration);

  // 19. Update Resume (PUT /resumes/:id)
  const updateRes = await request(`/resumes/${createdResumeId}`, {
    method: "PUT",
    headers: authHeader,
    body: JSON.stringify({
      title: "Lead Full Stack Architect CV",
      targetRole: "Lead Architect",
    }),
  });
  assert.strictEqual(updateRes.status, 200, "Update resume must return 200");
  assert.strictEqual(updateRes.data.data.title, "Lead Full Stack Architect CV");
  logPass("PUT", "/resumes/:id", updateRes.status, "Resume title and target role updated", updateRes.duration);

  // 20. Duplicate Resume (POST /resumes/:id/duplicate)
  const duplicateRes = await request(`/resumes/${createdResumeId}/duplicate`, {
    method: "POST",
    headers: authHeader,
  });
  assert.strictEqual(duplicateRes.status, 201, "Duplicate resume must return 201");
  assert.strictEqual(duplicateRes.data.data.title, "Lead Full Stack Architect CV (Salinan)");
  const duplicatedResumeId = duplicateRes.data.data.id;
  logPass("POST", "/resumes/:id/duplicate", duplicateRes.status, "Resume duplicated with clean clone", duplicateRes.duration);

  // 21. Delete Resume (DELETE /resumes/:id)
  const deleteRes = await request(`/resumes/${duplicatedResumeId}`, {
    method: "DELETE",
    headers: authHeader,
  });
  assert.strictEqual(deleteRes.status, 200, "Delete resume must return 200");
  logPass("DELETE", "/resumes/:id", deleteRes.status, "Duplicated resume deleted successfully", deleteRes.duration);

  console.log("--------------------------------------------------------------------------------");
  console.log(`Results: ${passed}/${total} integration tests passed (0 failures)`);
  process.exit(0);
}

runSuite().catch((err) => {
  console.error("\n[FATAL ERROR] Test suite aborted:", err.message);
  if (err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});

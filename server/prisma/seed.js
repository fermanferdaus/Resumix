import prisma from "../config/prisma.js";
import { appConfig } from "../config/app.js";
import { hashPassword } from "../utils/hash.js";
import { generatePublicId } from "../utils/id.js";

/**
 * Seeder untuk inisialisasi akun Administrator Resumix
 * Kredensial dibaca dari config abstraction (tanpa hardcode)
 */
async function main() {
  const { name, email, password } = appConfig.adminSeed;

  if (!email || !password) {
    console.error("[SEED ERROR] ADMIN_SEED_EMAIL dan ADMIN_SEED_PASSWORD wajib dikonfigurasi.");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const hashedPassword = await hashPassword(password);

  console.log(`[SEED START] Menginisialisasi akun administrator: ${normalizedEmail}`);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      fullName: name,
      role: "ADMIN",
      password: hashedPassword,
      isVerified: true,
    },
    create: {
      publicId: generatePublicId(),
      email: normalizedEmail,
      fullName: name,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log(`[SEED SUCCESS] Akun Administrator siap: ${user.email} (Role: ${user.role}, ID: ${user.publicId})`);
}

main()
  .catch((e) => {
    console.error("[SEED FATAL]", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

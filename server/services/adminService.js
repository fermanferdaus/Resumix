import prisma from "../config/prisma.js";

/**
 * Service: Admin Dashboard & Monitoring Analytics
 */

/**
 * Mengambil ringkasan statistik komprehensif untuk Dashboard Admin
 */
export const getDashboardStats = async () => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    verifiedUsers,
    activeRefreshTokens,
    totalResumes,
    recentLogins,
    recentFailedLogins,
    otpLockouts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.refreshToken.findMany({
      where: {
        isRevoked: false,
        expiresAt: { gt: now },
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.resume.count(),
    prisma.loginLog.count({
      where: { createdAt: { gte: last24h }, status: "SUCCESS" },
    }),
    prisma.loginLog.count({
      where: { createdAt: { gte: last24h }, status: "FAILED" },
    }),
    prisma.otp.count({
      where: { createdAt: { gte: last24h }, attempts: { gte: 5 } },
    }),
  ]);

  const activeUsers = activeRefreshTokens.length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const totalAnomalies = recentFailedLogins + otpLockouts;

  // Agregasi Tren 7 Hari Terakhir
  const rawLogs7Days = await prisma.loginLog.findMany({
    where: { createdAt: { gte: last7Days } },
    select: { createdAt: true, status: true, device: true },
  });

  const rawUsers7Days = await prisma.user.findMany({
    where: { createdAt: { gte: last7Days } },
    select: { createdAt: true },
  });

  // Susun data harian 7 hari terakhir
  const trendDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });

    const registeredCount = rawUsers7Days.filter(
      (u) => u.createdAt.toISOString().split("T")[0] === dateStr
    ).length;

    const successLogins = rawLogs7Days.filter(
      (l) => l.createdAt.toISOString().split("T")[0] === dateStr && l.status === "SUCCESS"
    ).length;

    const failedLogins = rawLogs7Days.filter(
      (l) => l.createdAt.toISOString().split("T")[0] === dateStr && l.status === "FAILED"
    ).length;

    trendDays.push({
      date: dateStr,
      label: dayLabel,
      registrations: registeredCount,
      logins: successLogins,
      failed: failedLogins,
    });
  }

  // Distribusi Perangkat (Desktop vs Mobile vs Tablet)
  let desktopCount = 0;
  let mobileCount = 0;
  let tabletCount = 0;

  for (const log of rawLogs7Days) {
    if (log.device === "Mobile") mobileCount++;
    else if (log.device === "Tablet") tabletCount++;
    else desktopCount++;
  }

  return {
    overview: {
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      activeUsers,
      totalResumes,
      avgResumesPerUser: totalUsers > 0 ? (totalResumes / totalUsers).toFixed(1) : "0",
      totalAnomalies,
      recentLogins24h: recentLogins,
      recentFailed24h: recentFailedLogins,
    },
    trends: trendDays,
    devices: {
      desktop: desktopCount,
      mobile: mobileCount,
      tablet: tabletCount,
    },
  };
};

/**
 * Mengambil daftar pengguna berpaginasi beserta kalkulasi jumlah CV tiap akun
 */
export const getUsersWithCvStats = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  startDate = "",
  endDate = "",
}) => {
  const skip = (page - 1) * limit;

  const dateFilter = {};
  if (startDate) {
    const start = new Date(`${startDate}T00:00:00+07:00`);
    if (!isNaN(start.getTime())) dateFilter.gte = start;
  }
  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999+07:00`);
    if (!isNaN(end.getTime())) dateFilter.lte = end;
  }

  const where = {
    ...(role ? { role } : {}),
    ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
            { domicile: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        publicId: true,
        email: true,
        fullName: true,
        phone: true,
        domicile: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            resumes: true,
            refreshTokens: {
              where: {
                isRevoked: false,
                expiresAt: { gt: new Date() },
              },
            },
          },
        },
        loginLogs: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            createdAt: true,
            ipAddress: true,
            location: true,
            city: true,
            country: true,
            device: true,
            browser: true,
            status: true,
          },
        },
      },
    }),
  ]);

  const items = users.map((u) => {
    const lastLogin = u.loginLogs[0] || null;
    return {
      id: u.publicId,
      email: u.email,
      fullName: u.fullName || "Pengguna Tanpa Nama",
      phone: u.phone || "-",
      domicile: u.domicile || "-",
      role: u.role,
      isVerified: u.isVerified,
      avatarUrl: u.avatarUrl,
      resumesCount: u._count.resumes,
      activeSessionsCount: u._count.refreshTokens,
      createdAt: u.createdAt,
      lastLogin: lastLogin
        ? {
            timestamp: lastLogin.createdAt,
            ip: lastLogin.ipAddress,
            location: lastLogin.location || "Local / Unknown",
            device: lastLogin.device,
            browser: lastLogin.browser,
            status: lastLogin.status,
          }
        : null,
    };
  });

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Mengambil log login & geolokasi secara berpaginasi
 */
export const getLoginLogs = async ({
  page = 1,
  limit = 15,
  status = "",
  search = "",
  startDate = "",
  endDate = "",
}) => {
  const skip = (page - 1) * limit;

  const dateFilter = {};
  if (startDate) {
    const start = new Date(`${startDate}T00:00:00+07:00`);
    if (!isNaN(start.getTime())) dateFilter.gte = start;
  }
  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999+07:00`);
    if (!isNaN(end.getTime())) dateFilter.lte = end;
  }

  const where = {
    ...(status ? { status } : {}),
    ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { ipAddress: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { country: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, logs] = await Promise.all([
    prisma.loginLog.count({ where }),
    prisma.loginLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            publicId: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    }),
  ]);

  return {
    items: logs.map((log) => ({
      id: log.publicId,
      email: log.email,
      userName: log.user?.fullName || "Pengguna Tanpa Nama",
      userAvatar: log.user?.avatarUrl || null,
      ipAddress: log.ipAddress,
      location: log.location || "Tidak Diketahui",
      city: log.city,
      country: log.country,
      device: log.device,
      browser: log.browser,
      status: log.status,
      loginMethod: log.loginMethod,
      reason: log.reason,
      createdAt: log.createdAt,
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Pemindaian real-time Anomali Keamanan
 */
export const getSecurityAnomalies = async () => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 1. Ambil percobaan login gagal berturut-turut dalam 24 jam terakhir
  const failedLogs = await prisma.loginLog.findMany({
    where: {
      createdAt: { gte: last24h },
      status: "FAILED",
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Kelompokkan kegagalan per email dan IP
  const failuresByEmail = {};
  const failuresByIp = {};

  for (const log of failedLogs) {
    failuresByEmail[log.email] = (failuresByEmail[log.email] || 0) + 1;
    failuresByIp[log.ipAddress] = (failuresByIp[log.ipAddress] || 0) + 1;
  }

  const anomalies = [];

  // Anomali: Brute force target email (>3 gagal)
  for (const [email, count] of Object.entries(failuresByEmail)) {
    if (count >= 3) {
      const sample = failedLogs.find((l) => l.email === email);
      anomalies.push({
        id: `bf-email-${email}`,
        type: "BRUTE_FORCE_EMAIL",
        severity: count >= 5 ? "CRITICAL" : "WARNING",
        title: "Percobaan Login Gagal Berulang",
        description: `Terdeteksi ${count} kali percobaan kata sandi salah pada akun ${email}.`,
        target: email,
        ipAddress: sample?.ipAddress || "-",
        location: sample?.location || "Local / Unknown",
        count,
        timestamp: sample?.createdAt || now,
      });
    }
  }

  // Anomali: Brute force dari IP penyerang (>5 gagal)
  for (const [ip, count] of Object.entries(failuresByIp)) {
    if (count >= 5) {
      const sample = failedLogs.find((l) => l.ipAddress === ip);
      anomalies.push({
        id: `bf-ip-${ip}`,
        type: "SUSPICIOUS_IP_BURST",
        severity: "CRITICAL",
        title: "Serangan IP Mencurigakan",
        description: `Alamat IP ${ip} melakukan ${count} kali percobaan login gagal ke berbagai akun.`,
        target: sample?.email || "-",
        ipAddress: ip,
        location: sample?.location || "Local / Unknown",
        count,
        timestamp: sample?.createdAt || now,
      });
    }
  }

  // 2. Anomali: OTP Lockout (attempts >= 5)
  const lockedOtps = await prisma.otp.findMany({
    where: {
      createdAt: { gte: last24h },
      attempts: { gte: 5 },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  for (const otp of lockedOtps) {
    anomalies.push({
      id: `otp-lock-${otp.id}`,
      type: "OTP_BRUTE_FORCE_LOCKOUT",
      severity: "WARNING",
      title: "Akun Terkunci (OTP Lockout)",
      description: `Batas percobaan 5 kali kode OTP tercapai pada akun ${otp.email}. OTP telah dinonaktifkan otomatis.`,
      target: otp.email,
      ipAddress: "-",
      location: "Sistem Keamanan Resumix",
      count: otp.attempts,
      timestamp: otp.createdAt,
    });
  }

  // 3. Anomali: Deteksi Token Reuse (Breach attempts)
  const revokedTokens = await prisma.refreshToken.findMany({
    where: {
      isRevoked: true,
      createdAt: { gte: last24h },
    },
    include: {
      user: {
        select: { email: true, fullName: true },
      },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  if (revokedTokens.length > 5) {
    anomalies.push({
      id: `token-invalidation-burst`,
      type: "TOKEN_REVOCATION_SPIKE",
      severity: "INFO",
      title: "Aktivitas Rotasi / Pembatalan Sesi",
      description: `Terdapat ${revokedTokens.length} sesi token di-revoke dalam 24 jam terakhir (rotasi sesi rutin atau logout).`,
      target: "Beragam Pengguna",
      ipAddress: "-",
      location: "Database Sesi",
      count: revokedTokens.length,
      timestamp: now,
    });
  }

  return anomalies;
};

/**
 * Aksi Admin: Putuskan dan cabut seluruh sesi aktif milik akun pengguna (Force Logout)
 */
export const revokeUserSessions = async (userPublicId) => {
  const user = await prisma.user.findUnique({
    where: { publicId: userPublicId },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  const result = await prisma.refreshToken.updateMany({
    where: {
      userId: user.id,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
    },
  });

  return {
    success: true,
    revokedCount: result.count,
    email: user.email,
  };
};

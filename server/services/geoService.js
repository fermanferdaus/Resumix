import geoip from "geoip-lite";

/**
 * Normalisasi IP address (menghapus prefix IPv6-mapped IPv4 ::ffff:)
 */
export const cleanIpAddress = (ip) => {
  if (!ip) return "127.0.0.1";
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
};

/**
 * Resolusi geolokasi IP address (offline via geoip-lite)
 */
export const resolveIpLocation = (ipAddress) => {
  const ip = cleanIpAddress(ipAddress);

  // Periksa apakah IP bersifat lokal / loopback / private network
  const isLocal =
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.3");

  if (isLocal) {
    return {
      country: "Local",
      city: "Jaringan Lokal / Dev",
      region: "Internal",
      location: "Localhost (Jaringan Internal)",
      timezone: "Local",
    };
  }

  try {
    const geo = geoip.lookup(ip);
    if (!geo) {
      return {
        country: "Unknown",
        city: "Unknown",
        region: "Unknown",
        location: "Lokasi Tidak Dikenal",
        timezone: "UTC",
      };
    }

    const city = geo.city || "Unknown";
    const country = geo.country || "Unknown";
    const location = city !== "Unknown" ? `${city}, ${country}` : country;

    return {
      country,
      city,
      region: geo.region || "Unknown",
      location,
      timezone: geo.timezone || "UTC",
    };
  } catch (error) {
    console.warn("[GEO RESOLVE ERROR]", error.message);
    return {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
      location: "Lokasi Tidak Dikenal",
      timezone: "UTC",
    };
  }
};

/**
 * Parser User-Agent native tanpa dependensi eksternal
 */
export const parseUserAgent = (ua = "") => {
  if (!ua || typeof ua !== "string") {
    return {
      device: "Desktop",
      browser: "Unknown",
      os: "Unknown",
    };
  }

  // Deteksi Perangkat
  let device = "Desktop";
  if (/iPad|Tablet|PlayBook/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = "Mobile";
  }

  // Deteksi OS
  let os = "Unknown";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Deteksi Browser
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  else if (/Opera|OPR\//i.test(ua)) browser = "Opera";

  return { device, browser, os };
};

/**
 * Mencatat log aktivitas login secara aman ke database
 */
export const recordLoginLog = async ({
  req,
  email,
  userId = null,
  status = "SUCCESS",
  loginMethod = "PASSWORD",
  reason = null,
}) => {
  try {
    const rawIp = req?.ip || req?.headers?.["x-forwarded-for"] || "127.0.0.1";
    const ip = cleanIpAddress(typeof rawIp === "string" ? rawIp.split(",")[0].trim() : "127.0.0.1");
    const ua = req?.headers?.["user-agent"] || "";

    const geo = resolveIpLocation(ip);
    const { device, browser } = parseUserAgent(ua);

    // Import prisma dinamis untuk menghindari circular dependencies
    const prismaModule = await import("../config/prisma.js");
    const prisma = prismaModule.default || prismaModule;
    const { generatePublicId } = await import("../utils/id.js");

    await prisma.loginLog.create({
      data: {
        publicId: generatePublicId(),
        userId,
        email: email ? email.toLowerCase().trim() : "unknown",
        ipAddress: ip,
        userAgent: ua ? ua.slice(0, 500) : null,
        device,
        browser,
        location: geo.location,
        country: geo.country,
        city: geo.city,
        status,
        loginMethod,
        reason: reason ? String(reason).slice(0, 255) : null,
      },
    });
  } catch (err) {
    console.warn("[LOGIN LOG ERROR]", err.message);
  }
};

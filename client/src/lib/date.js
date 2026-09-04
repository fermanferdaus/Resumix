export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: 60 }, (_, i) => String(currentYear + 5 - i));

const MONTH_MAP = {
  "01": "Januari",
  "02": "Februari",
  "03": "Maret",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Agustus",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember",
};

const REVERSE_MONTH_MAP = {
  januari: "01",
  jan: "01",
  februari: "02",
  feb: "02",
  maret: "03",
  mar: "03",
  april: "04",
  apr: "04",
  mei: "05",
  may: "05",
  juni: "06",
  jun: "06",
  juli: "07",
  jul: "07",
  agustus: "08",
  agu: "08",
  aug: "08",
  september: "09",
  sep: "09",
  oktober: "10",
  okt: "10",
  oct: "10",
  november: "11",
  nov: "11",
  desember: "12",
  des: "12",
  dec: "12",
};

/**
 * Konversi display string "Juni 2024" atau "2024-06" ke format input month "2024-06"
 */
export const toMonthInputValue = (val) => {
  if (!val || typeof val !== "string" || val.toLowerCase() === "sekarang") {
    return "";
  }

  const trimmed = val.trim();
  // Jika sudah format YYYY-MM
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Jika format "Bulan Tahun" misal "September 2022"
  const parts = trimmed.split(/[\s,–—\-/]+/);
  let year = "";
  let month = "";

  for (const part of parts) {
    if (/^\d{4}$/.test(part)) {
      year = part;
    } else if (REVERSE_MONTH_MAP[part.toLowerCase()]) {
      month = REVERSE_MONTH_MAP[part.toLowerCase()];
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= 12) {
        month = String(num).padStart(2, "0");
      }
    }
  }

  if (year && month) {
    return `${year}-${month}`;
  }

  return "";
};

/**
 * Konversi format input month "2024-06" ke display string ATS "Juni 2024"
 */
export const toDisplayMonthYear = (val) => {
  if (!val || typeof val !== "string") return "";
  if (val.toLowerCase() === "sekarang") return "Sekarang";

  const trimmed = val.trim();
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const [year, month] = trimmed.split("-");
    const monthName = MONTH_MAP[month] || month;
    return `${monthName} ${year}`;
  }

  return trimmed;
};

/**
 * Parsing string tanggal seperti "September 2022", "Sep 2022", "2022-09", dsb
 */
export const parseMonthYearString = (val) => {
  if (!val || typeof val !== "string" || val.toLowerCase() === "sekarang") {
    return { month: "", year: "" };
  }

  const parts = val.trim().split(/[\s,–—\-/]+/);
  let detectedMonth = "";
  let detectedYear = "";

  for (const part of parts) {
    if (!part) continue;

    if (/^\d{4}$/.test(part)) {
      detectedYear = part;
      continue;
    }

    const foundMonth = MONTHS.find(
      (m) =>
        m.toLowerCase() === part.toLowerCase() ||
        m.toLowerCase().startsWith(part.toLowerCase())
    );
    if (foundMonth) {
      detectedMonth = foundMonth;
      continue;
    }

    const num = parseInt(part, 10);
    if (!isNaN(num) && num >= 1 && num <= 12 && !detectedMonth) {
      detectedMonth = MONTHS[num - 1];
    }
  }

  return { month: detectedMonth, year: detectedYear };
};

/**
 * Format tanggal dan waktu ke standar WIB: "12 Sep 26, 04.08.17 WIB"
 * @param {string|Date|number} dateInput
 * @returns {string}
 */
export const formatDateTimeWIB = (dateInput) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "-";

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date).replace(/\./g, "");

  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date).replace(/:/g, ".");

  return `${dateStr}, ${timeStr} WIB`;
};


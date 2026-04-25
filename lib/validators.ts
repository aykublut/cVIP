/**
 * ATS & HR uyumlu veri doğrulama + normalizasyon yardımcıları
 * ------------------------------------------------------------------
 * Bu dosya, CV formunda toplanan tüm veriyi hem ATS parser'ları hem de
 * insan kaynakları standartlarına uygun şekilde normalize eder ve doğrular.
 * ------------------------------------------------------------------
 */

/* ══════════════════════════════════════════════
   E-POSTA
   ══════════════════════════════════════════════ */
export const isValidEmail = (v: string): boolean => {
  if (!v) return false;
  // RFC 5322'nin pratik alt kümesi — ATS'lerin kabul ettiği güvenli aralık
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v.trim());
};

/* ══════════════════════════════════════════════
   TELEFON
   ══════════════════════════════════════════════ */

/**
 * Türkiye öncelikli, uluslararası destekli telefon formatı.
 * +90 5XX XXX XX XX şeklinde otomatik biçimlendirir.
 * Türkiye dışı numaralar için + işaretini korur, grup ayırmaz (kullanıcı manuel yazar).
 */
export const formatPhone = (v: string): string => {
  if (!v) return "";
  const digitsOnly = v.replace(/[^\d+]/g, "");

  // Türkiye formatı (+90 ile başlıyor)
  if (digitsOnly.startsWith("+90") || digitsOnly.startsWith("90")) {
    const core = digitsOnly.replace(/^(\+?90)/, "");
    if (core.length === 0) return "+90 ";
    if (core.length <= 3) return `+90 ${core}`;
    if (core.length <= 6) return `+90 ${core.slice(0, 3)} ${core.slice(3)}`;
    if (core.length <= 8)
      return `+90 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6)}`;
    return `+90 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6, 8)} ${core.slice(8, 10)}`;
  }

  // 0 ile başlıyorsa Türkiye kabul et
  if (digitsOnly.startsWith("0") && digitsOnly.length >= 10) {
    const core = digitsOnly.slice(1);
    return `+90 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6, 8)} ${core.slice(8, 10)}`;
  }

  // Uluslararası: sadece + işaretini koru, dokunma
  return v.trim();
};

export const isValidPhone = (v: string): boolean => {
  if (!v) return false;
  const digits = v.replace(/\D/g, "");
  // En az 10 (TR yerel), en fazla 15 (E.164 standart)
  return digits.length >= 10 && digits.length <= 15;
};

/* ══════════════════════════════════════════════
   LINKEDIN URL
   ══════════════════════════════════════════════ */
export const normalizeLinkedIn = (v: string): string => {
  if (!v) return "";
  let cleaned = v.trim();

  // Protokol ve www'yi temizle
  cleaned = cleaned.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  // Sonundaki / karakterlerini temizle
  cleaned = cleaned.replace(/\/+$/, "");

  // Zaten linkedin.com/in/ ile başlıyorsa
  if (/^linkedin\.com\/in\//i.test(cleaned)) return cleaned.toLowerCase();

  // linkedin.com/ ile başlıyor ama /in/ yoksa
  if (/^linkedin\.com\//i.test(cleaned)) {
    return cleaned
      .replace(/^linkedin\.com\//i, "linkedin.com/in/")
      .toLowerCase();
  }

  // Sadece kullanıcı adı girilmişse
  if (/^[a-zA-Z0-9\-_.]+$/.test(cleaned)) {
    return `linkedin.com/in/${cleaned.toLowerCase()}`;
  }

  return cleaned.toLowerCase();
};

export const isValidLinkedIn = (v: string): boolean => {
  if (!v) return true; // opsiyonel
  const normalized = normalizeLinkedIn(v);
  return /^linkedin\.com\/in\/[a-zA-Z0-9\-_.]+$/i.test(normalized);
};

/* ══════════════════════════════════════════════
   GITHUB URL
   ══════════════════════════════════════════════ */
export const normalizeGithub = (v: string): string => {
  if (!v) return "";
  let cleaned = v.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  cleaned = cleaned.replace(/\/+$/, "");

  if (/^github\.com\//i.test(cleaned)) return cleaned.toLowerCase();

  if (/^[a-zA-Z0-9\-_.]+$/.test(cleaned)) {
    return `github.com/${cleaned.toLowerCase()}`;
  }

  return cleaned.toLowerCase();
};

export const isValidGithub = (v: string): boolean => {
  if (!v) return true;
  const normalized = normalizeGithub(v);
  return /^github\.com\/[a-zA-Z0-9\-_.]+$/i.test(normalized);
};

/* ══════════════════════════════════════════════
   AD SOYAD
   ══════════════════════════════════════════════ */
export const isValidFullName = (v: string): boolean => {
  if (!v) return false;
  const parts = v.trim().split(/\s+/);
  // En az 2 kelime, her kelime en az 2 karakter
  return parts.length >= 2 && parts.every((p) => p.length >= 2);
};

/* ══════════════════════════════════════════════
   LOKASYON — "Şehir, Ülke" formatı tercih edilir
   ══════════════════════════════════════════════ */
export const isValidLocation = (v: string): boolean => {
  if (!v) return true;
  // Virgül var mı ve iki parça arasında metin var mı?
  return v.trim().length >= 2;
};

export const hasLocationCommaFormat = (v: string): boolean => {
  if (!v) return false;
  const parts = v
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 2;
};

/* ══════════════════════════════════════════════
   TARİH
   ══════════════════════════════════════════════ */

export type DateFormat =
  | "month-year-tr" // "Ocak 2023"
  | "month-year-en" // "January 2023" or "Jan 2023"
  | "numeric" // "01/2023"
  | "year-only" // "2023"
  | "present" // "Günümüz" / "Present"
  | "unknown";

const TR_MONTHS = [
  "ocak",
  "şubat",
  "mart",
  "nisan",
  "mayıs",
  "haziran",
  "temmuz",
  "ağustos",
  "eylül",
  "ekim",
  "kasım",
  "aralık",
];
const EN_MONTHS_FULL = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const EN_MONTHS_SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const detectDateFormat = (v: string): DateFormat => {
  if (!v) return "unknown";
  const trimmed = v.trim().toLowerCase();

  // "Günümüz" / "Present" / "Current"
  if (/^(günümüz|present|current|halen|devam ediyor)$/.test(trimmed)) {
    return "present";
  }

  // MM/YYYY veya M/YYYY
  if (/^\d{1,2}\/\d{4}$/.test(trimmed)) return "numeric";

  // YYYY
  if (/^\d{4}$/.test(trimmed)) return "year-only";

  // "Ocak 2023" gibi
  const firstWord = trimmed.split(/\s+/)[0];
  if (TR_MONTHS.includes(firstWord)) return "month-year-tr";
  if (
    EN_MONTHS_FULL.includes(firstWord) ||
    EN_MONTHS_SHORT.includes(firstWord)
  ) {
    return "month-year-en";
  }

  return "unknown";
};

export const isValidDateString = (v: string): boolean => {
  if (!v) return false;
  const format = detectDateFormat(v);
  if (format === "unknown") return false;

  if (format === "numeric") {
    const [mm, yyyy] = v.split("/");
    const m = parseInt(mm, 10);
    const y = parseInt(yyyy, 10);
    return m >= 1 && m <= 12 && y >= 1950 && y <= new Date().getFullYear() + 10;
  }

  if (format === "year-only") {
    const y = parseInt(v, 10);
    return y >= 1950 && y <= new Date().getFullYear() + 10;
  }

  if (format === "month-year-tr" || format === "month-year-en") {
    const parts = v.trim().split(/\s+/);
    if (parts.length !== 2) return false;
    const yearPart = parseInt(parts[1], 10);
    return (
      !isNaN(yearPart) &&
      yearPart >= 1950 &&
      yearPart <= new Date().getFullYear() + 10
    );
  }

  return true;
};

/**
 * Birden fazla tarihin hepsi aynı formatta mı?
 * "present" (Günümüz) bu kontrolden muaf — her formatla uyumlu sayılır.
 */
export const areDatesConsistent = (dates: string[]): boolean => {
  const filtered = dates
    .filter((d) => d && d.trim())
    .map(detectDateFormat)
    .filter((f) => f !== "present" && f !== "unknown");

  if (filtered.length <= 1) return true;
  const unique = new Set(filtered);
  return unique.size === 1;
};

/* ══════════════════════════════════════════════
   AÇIKLAMA / DESCRIPTION ANALİZİ
   ══════════════════════════════════════════════ */

/** Sayısal metrik (%, sayı, +N) var mı? */
export const hasMetric = (v: string): boolean => {
  if (!v) return false;
  return /\d/.test(v);
};

/** Yüzde veya somut miktar ifadesi var mı? */
export const hasStrongMetric = (v: string): boolean => {
  if (!v) return false;
  return /(%|\$|₺|€|£|x\d|\d+\s*(kişi|ürün|müşteri|client|user|customer|projekt|project|adet))/i.test(
    v,
  );
};

/** Cümle başı aksiyon fiili gibi görünüyor mu? (Gevşek kontrol) */
const PASSIVE_STARTS_TR = [
  "ben",
  "bu",
  "şu",
  "o",
  "görevim",
  "sorumluluğum",
  "firma",
  "şirket",
  "burada",
  "orada",
  "takım",
  "ekip",
];
const PASSIVE_STARTS_EN = [
  "i",
  "my",
  "the",
  "a",
  "an",
  "this",
  "that",
  "there",
  "here",
];

export const looksLikeActionVerb = (v: string): boolean => {
  if (!v) return true; // boşsa uyarı yok
  const firstWord = v
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase()
    .replace(/[^\wığüşöçİĞÜŞÖÇ]/g, "");
  if (!firstWord) return true;
  return (
    !PASSIVE_STARTS_TR.includes(firstWord) &&
    !PASSIVE_STARTS_EN.includes(firstWord)
  );
};

/* ══════════════════════════════════════════════
   BECERİLER / SKILLS
   ══════════════════════════════════════════════ */

/** Kısaltmadır ve açık karşılığı verilmemiştir — ATS için risk */
const COMMON_ACRONYMS: Record<string, string> = {
  seo: "Arama Motoru Optimizasyonu (SEO)",
  sem: "Arama Motoru Pazarlaması (SEM)",
  crm: "Müşteri İlişkileri Yönetimi (CRM)",
  erp: "Kurumsal Kaynak Planlaması (ERP)",
  ui: "Kullanıcı Arayüzü (UI)",
  ux: "Kullanıcı Deneyimi (UX)",
  ai: "Yapay Zeka (AI)",
  ml: "Makine Öğrenmesi (ML)",
  api: "API",
  qa: "Kalite Güvence (QA)",
  kpi: "Anahtar Performans Göstergesi (KPI)",
  b2b: "B2B (İşletmeden İşletmeye)",
  b2c: "B2C (İşletmeden Tüketiciye)",
  saas: "SaaS",
  roi: "Yatırım Getirisi (ROI)",
};

/** Verilen kısa skill için genişletilmiş öneri var mı? */
export const getAcronymExpansion = (skill: string): string | null => {
  const key = skill.trim().toLowerCase();
  return COMMON_ACRONYMS[key] ?? null;
};

/** Skill çok kısa / anlamlı mı? */
export const isValidSkill = (skill: string): boolean => {
  const s = skill.trim();
  return s.length >= 2 && s.length <= 50;
};

/* ══════════════════════════════════════════════
   DOSYA ADI (PDF indirme için)
   ══════════════════════════════════════════════ */
export const slugifyForFilename = (v: string): string => {
  if (!v) return "CV";
  return v
    .trim()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "");
};

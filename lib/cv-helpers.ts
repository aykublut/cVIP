/**
 * CV yardımcıları — formatlama, normalizasyon, ATS analizi, sabitler.
 *
 * Tüm tarihler "YYYY-MM" ISO formatında saklanır.
 * Bu dosya hem wizard adımlarında hem temalarda kullanılır.
 */

import { format, parse } from "date-fns";
import { tr, enUS } from "date-fns/locale";

/* ══════════════════════════════════════════════
   TARİH FORMATLAMA
   ══════════════════════════════════════════════ */

/**
 * Saklı tarihi ("YYYY-MM" | "present" | "") kullanıcı dostu biçime çevirir.
 *
 * @param iso     "2023-01" | "present" | ""
 * @param locale  "tr" (varsayılan) veya "en"
 * @param style   "long" → "Ocak 2023" | "short" → "Oca 2023" | "numeric" → "01/2023"
 */
export const formatStoredDate = (
  iso: string,
  locale: "tr" | "en" = "tr",
  style: "long" | "short" | "numeric" = "long",
): string => {
  if (!iso) return "";
  if (iso === "present") return locale === "tr" ? "Günümüz" : "Present";

  try {
    const date = parse(iso, "yyyy-MM", new Date());
    const loc = locale === "tr" ? tr : enUS;
    const fmt =
      style === "long"
        ? "MMMM yyyy"
        : style === "short"
          ? "MMM yyyy"
          : "MM/yyyy";
    return format(date, fmt, { locale: loc });
  } catch {
    return iso;
  }
};

/** Tarih aralığını tek string olarak formatlar: "Ocak 2023 – Günümüz" */
export const formatDateRange = (
  start: string,
  end: string,
  locale: "tr" | "en" = "tr",
  style: "long" | "short" | "numeric" = "long",
): string => {
  const s = formatStoredDate(start, locale, style);
  const e = formatStoredDate(end, locale, style);
  if (!s && !e) return "";
  if (!e) return s;
  if (!s) return e;
  return `${s} – ${e}`;
};

/* ══════════════════════════════════════════════
   NORMALİZASYON (input blur'unda çalışır)
   ══════════════════════════════════════════════ */

/** Telefonu +90 XXX XXX XX XX formatına dönüştürür (TR); diğer ülkeler için dokunmaz */
export const formatPhone = (v: string): string => {
  if (!v) return "";
  const digitsOnly = v.replace(/[^\d+]/g, "");

  if (digitsOnly.startsWith("+90") || digitsOnly.startsWith("90")) {
    const core = digitsOnly.replace(/^(\+?90)/, "");
    if (core.length === 0) return "+90 ";
    if (core.length <= 3) return `+90 ${core}`;
    if (core.length <= 6) return `+90 ${core.slice(0, 3)} ${core.slice(3)}`;
    if (core.length <= 8)
      return `+90 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6)}`;
    return `+90 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6, 8)} ${core.slice(8, 10)}`;
  }

  if (digitsOnly.startsWith("0") && digitsOnly.length >= 10) {
    const core = digitsOnly.slice(1);
    return `+90 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6, 8)} ${core.slice(8, 10)}`;
  }

  return v.trim();
};

/** LinkedIn URL/kullanıcı adını linkedin.com/in/xxx biçimine çevirir */
export const normalizeLinkedIn = (v: string): string => {
  if (!v) return "";
  let cleaned = v.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  cleaned = cleaned.replace(/\/+$/, "");

  if (/^linkedin\.com\/in\//i.test(cleaned)) return cleaned.toLowerCase();
  if (/^linkedin\.com\//i.test(cleaned))
    return cleaned
      .replace(/^linkedin\.com\//i, "linkedin.com/in/")
      .toLowerCase();
  if (/^[a-zA-Z0-9\-_.]+$/.test(cleaned))
    return `linkedin.com/in/${cleaned.toLowerCase()}`;
  return cleaned.toLowerCase();
};

/** GitHub URL/kullanıcı adını github.com/xxx biçimine çevirir */
export const normalizeGithub = (v: string): string => {
  if (!v) return "";
  let cleaned = v.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  cleaned = cleaned.replace(/\/+$/, "");

  if (/^github\.com\//i.test(cleaned)) return cleaned.toLowerCase();
  if (/^[a-zA-Z0-9\-_.]+$/.test(cleaned))
    return `github.com/${cleaned.toLowerCase()}`;
  return cleaned.toLowerCase();
};

/** Genel URL normalize — protokol ve trailing slash temizler */
export const normalizeUrl = (v: string): string => {
  if (!v) return "";
  return v
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?/i, "")
    .replace(/\/+$/, "");
};

/* ══════════════════════════════════════════════
   ATS AÇIKLAMA ANALİZİ
   ══════════════════════════════════════════════ */

export const hasMetric = (v: string): boolean => /\d/.test(v);

export const hasStrongMetric = (v: string): boolean =>
  /(%|\$|₺|€|£|x\d|\d+\s*(kişi|ürün|müşteri|client|user|customer|proje|project))/i.test(
    v,
  );

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

/** İlk kelime aksiyon fiili benzeri mi? */
export const looksLikeActionVerb = (v: string): boolean => {
  if (!v) return true;
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
   SERTİFİKA SÜRESİ KONTROLÜ
   ══════════════════════════════════════════════ */

export const isCertificateExpired = (expiryIso: string): boolean => {
  if (!expiryIso || expiryIso === "present") return false;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(expiryIso)) return false;

  const now = new Date();
  const currentMonthIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return expiryIso < currentMonthIso;
};

/* ══════════════════════════════════════════════
   KISALTMA GENİŞLETME (skills)
   ══════════════════════════════════════════════ */

const COMMON_ACRONYMS: Record<string, string> = {
  seo: "Arama Motoru Optimizasyonu (SEO)",
  sem: "Arama Motoru Pazarlaması (SEM)",
  crm: "Müşteri İlişkileri Yönetimi (CRM)",
  erp: "Kurumsal Kaynak Planlaması (ERP)",
  ui: "Kullanıcı Arayüzü (UI)",
  ux: "Kullanıcı Deneyimi (UX)",
  ai: "Yapay Zeka (AI)",
  ml: "Makine Öğrenmesi (ML)",
  qa: "Kalite Güvence (QA)",
  kpi: "Anahtar Performans Göstergesi (KPI)",
  b2b: "B2B (İşletmeden İşletmeye)",
  b2c: "B2C (İşletmeden Tüketiciye)",
  saas: "SaaS",
  roi: "Yatırım Getirisi (ROI)",
};

export const getAcronymExpansion = (skill: string): string | null => {
  const key = skill.trim().toLowerCase();
  return COMMON_ACRONYMS[key] ?? null;
};

/* ══════════════════════════════════════════════
   DİL & CEFR
   ══════════════════════════════════════════════ */

export const LANGUAGE_LEVELS = [
  { code: "A1", label: "A1 - Başlangıç", description: "Temel ifadeler" },
  { code: "A2", label: "A2 - Temel", description: "Basit iletişim" },
  { code: "B1", label: "B1 - Orta", description: "Bağımsız kullanıcı" },
  { code: "B2", label: "B2 - İyi", description: "Akıcı iletişim" },
  { code: "C1", label: "C1 - İleri", description: "Yetkin kullanıcı" },
  { code: "C2", label: "C2 - Üst Düzey", description: "Uzman seviyesi" },
  { code: "Native", label: "Native - Anadil", description: "Anadil" },
] as const;

export const COMMON_LANGUAGES = [
  "Türkçe",
  "İngilizce",
  "Almanca",
  "Fransızca",
  "İspanyolca",
  "İtalyanca",
  "Rusça",
  "Arapça",
  "Çince (Mandarin)",
  "Japonca",
  "Korece",
  "Portekizce",
  "Hollandaca",
  "Farsça",
];

/* ══════════════════════════════════════════════
   DERECE ÖNERİLERİ
   ══════════════════════════════════════════════ */

export const DEGREE_SUGGESTIONS = [
  "Lisans",
  "Yüksek Lisans",
  "Doktora",
  "Ön Lisans",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
];

/* ══════════════════════════════════════════════
   DOSYA ADI (PDF)
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

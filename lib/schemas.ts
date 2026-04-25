/**
 * Zod şemaları — Tek doğruluk kaynağı.
 *
 * Hem validasyon hem TypeScript tiplerini burada üretiyoruz.
 * Her wizard adımı kendi schema'sını import eder ve `zodResolver` ile bağlar.
 */

import { z } from "zod";

/* ══════════════════════════════════════════════
   PRIMITIF ŞEMALAR
   ══════════════════════════════════════════════ */

/** ISO tarih: "YYYY-MM" veya "present" veya boş */
export const dateSchema = z
  .string()
  .refine(
    (v) => v === "" || v === "present" || /^\d{4}-(0[1-9]|1[0-2])$/.test(v),
    { message: "Geçersiz tarih." },
  );

/** Zorunlu ISO tarih (boş olamaz) */
export const requiredDateSchema = z
  .string()
  .refine((v) => v === "present" || /^\d{4}-(0[1-9]|1[0-2])$/.test(v), {
    message: "Tarih zorunludur.",
  });

/** E-posta — RFC pratik alt küme */
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Geçerli bir e-posta girin (ör: ad@domain.com)." });

/** Telefon — 10-15 rakam (uluslararası format) */
export const phoneSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 15,
    {
      message: "Geçerli bir telefon numarası girin (10–15 rakam).",
    },
  );

/** Ad Soyad — en az iki kelime, her biri 2+ karakter */
export const fullNameSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      const parts = v.split(/\s+/).filter(Boolean);
      return parts.length >= 2 && parts.every((p) => p.length >= 2);
    },
    { message: "En az iki kelime (ad + soyad) girin." },
  );

/** URL — opsiyonel, geçerli domain formatı */
export const urlSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      v === "" ||
      /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(v),
    { message: "Geçerli bir URL girin." },
  );

/** LinkedIn — opsiyonel, kullanıcı adı veya tam URL */
export const linkedinSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      const cleaned = v
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .replace(/\/+$/, "");
      return (
        /^linkedin\.com\/in\/[a-zA-Z0-9\-_.]+$/i.test(cleaned) ||
        /^[a-zA-Z0-9\-_.]+$/.test(cleaned)
      );
    },
    { message: "Geçerli bir LinkedIn URL'si veya kullanıcı adı girin." },
  );

/** GitHub — opsiyonel, kullanıcı adı veya tam URL */
export const githubSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      const cleaned = v
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .replace(/\/+$/, "");
      return (
        /^github\.com\/[a-zA-Z0-9\-_.]+$/i.test(cleaned) ||
        /^[a-zA-Z0-9\-_.]+$/.test(cleaned)
      );
    },
    { message: "Geçerli bir GitHub URL'si veya kullanıcı adı girin." },
  );

/* ══════════════════════════════════════════════
   ADIM ŞEMALARI
   ══════════════════════════════════════════════ */

/** STEP 1 — Kişisel Bilgiler */
export const personalInfoSchema = z.object({
  fullName: fullNameSchema,
  jobTitle: z.string().trim().min(2, "Hedef pozisyon girin.").max(80),
  email: emailSchema,
  phone: phoneSchema,
  location: z.string().trim().max(60).optional().or(z.literal("")),
  linkedin: linkedinSchema.optional().or(z.literal("")),
  github: githubSchema.optional().or(z.literal("")),
  summary: z
    .string()
    .max(600, "Özet 600 karakteri aşmamalı.")
    .optional()
    .or(z.literal("")),
  photo: z.string().optional().or(z.literal("")),
});
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

/** STEP 2 — İş Deneyimi (tek kayıt) */
export const experienceSchema = z
  .object({
    id: z.string(),
    position: z.string().trim().min(2, "Pozisyon girin.").max(80),
    company: z.string().trim().min(2, "Şirket adı girin.").max(80),
    startDate: requiredDateSchema,
    endDate: requiredDateSchema,
    description: z
      .string()
      .max(600, "Açıklama 600 karakteri aşmamalı.")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // Bitiş present ise veya boşsa kontrol yok
      if (data.endDate === "present" || !data.endDate) return true;
      if (!data.startDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "Bitiş tarihi başlangıçtan sonra olmalı.",
      path: ["endDate"],
    },
  );
export type ExperienceInput = z.infer<typeof experienceSchema>;

/** STEP 3 — Eğitim (tek kayıt) */
export const educationSchema = z
  .object({
    id: z.string(),
    school: z.string().trim().min(3, "Kurum adı girin.").max(120),
    degree: z.string().trim().max(60).optional().or(z.literal("")),
    fieldOfStudy: z.string().trim().max(80).optional().or(z.literal("")),
    startDate: dateSchema,
    endDate: dateSchema,
  })
  .refine(
    (data) => {
      if (data.endDate === "present" || !data.endDate) return true;
      if (!data.startDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "Mezuniyet tarihi başlangıçtan sonra olmalı.",
      path: ["endDate"],
    },
  );
export type EducationInput = z.infer<typeof educationSchema>;

/** STEP 4 — Beceriler */
export const skillSchema = z
  .string()
  .trim()
  .min(2, "Beceri en az 2 karakter olmalı.")
  .max(50, "Beceri 50 karakteri aşmamalı.");

/** STEP 5 — Sertifika (tek kayıt) */
export const certificateSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Sertifika adı girin.").max(120),
  issuer: z.string().trim().min(2, "Veren kurum girin.").max(80),
  issueDate: dateSchema,
  expiryDate: dateSchema,
  credentialId: z.string().trim().max(60).optional().or(z.literal("")),
  credentialUrl: urlSchema.optional().or(z.literal("")),
});
export type CertificateInput = z.infer<typeof certificateSchema>;

/** STEP 6 — Proje (tek kayıt) */
export const projectSchema = z
  .object({
    id: z.string(),
    name: z.string().trim().min(3, "Proje adı girin.").max(100),
    role: z.string().trim().max(60).optional().or(z.literal("")),
    startDate: dateSchema,
    endDate: dateSchema,
    url: urlSchema.optional().or(z.literal("")),
    technologies: z.string().trim().max(200).optional().or(z.literal("")),
    description: z.string().max(500).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.endDate === "present" || !data.endDate) return true;
      if (!data.startDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "Bitiş tarihi başlangıçtan sonra olmalı.",
      path: ["endDate"],
    },
  );
export type ProjectInput = z.infer<typeof projectSchema>;

/** STEP 7 — Dil (tek kayıt) */
export const languageLevelEnum = z.enum([
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
]);

export const languageSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, "Dil adı girin.").max(40),
  level: languageLevelEnum,
});
export type LanguageInput = z.infer<typeof languageSchema>;

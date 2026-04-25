/**
 * CV veri modeli.
 *
 * TARİH FORMATI (ÖNEMLİ):
 * Tüm tarih alanları "YYYY-MM" ISO formatında saklanır (ör: "2023-01").
 * Özel değerler:
 *   - ""         → Tarih girilmemiş
 *   - "present"  → "Günümüz" / "Present"
 *
 * Bu format sayesinde:
 *   - Tarihler her zaman tutarlı (kullanıcı karışık format giremez)
 *   - Sıralama, karşılaştırma doğal string karşılaştırmasıyla çalışır
 *   - Render anında locale'e göre formatlanır (formatStoredDate helper)
 */

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  photo?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string; // "YYYY-MM" | ""
  endDate: string; // "YYYY-MM" | "present" | ""
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // "YYYY-MM" | ""
  endDate: string; // "YYYY-MM" | "present" | ""
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string; // "YYYY-MM" | ""
  expiryDate: string; // "YYYY-MM" | "" (boş = süresiz)
  credentialId: string;
  credentialUrl: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string; // "YYYY-MM" | ""
  endDate: string; // "YYYY-MM" | "present" | ""
  url: string;
  technologies: string;
  description: string;
}

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  certificates: Certificate[];
  projects: Project[];
  languages: Language[];
  theme: {
    color: string;
    font: string;
  };
}

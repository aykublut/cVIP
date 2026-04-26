import type { CVData } from "@/types/cv";
import type { ATSScoreResult, ATSSuggestion } from "@/types/ai";
import {
  hasStrongMetric,
  looksLikeActionVerb,
  getAcronymExpansion,
  isCertificateExpired,
} from "@/lib/cv-helpers";

const ISO_DATE_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function isValidIso(v: string): boolean {
  return v === "present" || ISO_DATE_RE.test(v);
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function jobTitleWords(jobTitle: string): string[] {
  return jobTitle
    .toLowerCase()
    .split(/[\s,/|]+/)
    .filter((w) => w.length >= 3);
}

export function calculateATSScore(cvData: CVData): ATSScoreResult {
  const { personalInfo, experiences, educations, skills, certificates, projects } = cvData;
  const suggestions: ATSSuggestion[] = [];
  let idCounter = 0;
  const id = () => `s-${++idCounter}`;

  /* ── KATMAN 1: ATS Yapısı (max 25) ── */
  let ats = 0;

  const nameOk =
    personalInfo.fullName.trim().split(/\s+/).filter(Boolean).length >= 2 &&
    personalInfo.fullName.trim().split(/\s+/).every((p) => p.length >= 2);
  if (nameOk) {
    ats += 4;
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "error",
      title: "Ad Soyad eksik",
      message: "En az iki kelimeli (ad + soyad) tam isim girilmeli.",
      fix: "Ad ve soyadınızı ayrı kelimeler olarak yazın.",
    });
  }

  if (isValidEmail(personalInfo.email)) {
    ats += 4;
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "error",
      title: "Geçersiz e-posta",
      message: "ATS sistemleri e-posta alanını tarar; geçersiz format eşleşme sağlamaz.",
      fix: "Geçerli bir e-posta adresi girin (ör: ad@domain.com).",
    });
  }

  if (isValidPhone(personalInfo.phone)) {
    ats += 4;
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "error",
      title: "Geçersiz telefon",
      message: "Uluslararası formatta (10-15 rakam) telefon numarası girilmeli.",
      fix: "+90 ile başlayan 10 haneli telefon numaranızı girin.",
    });
  }

  if (personalInfo.jobTitle.trim().length >= 2) {
    ats += 4;
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "error",
      title: "Hedef pozisyon eksik",
      message: "ATS sistemi iş unvanını iş ilanıyla eşleştirmek için kullanır.",
      fix: "Hedef pozisyon alanını doldurun.",
    });
  }

  if (personalInfo.location.trim().length > 0) {
    ats += 3;
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "warning",
      title: "Konum eksik",
      message: "Birçok ATS sistemi lokasyon filtresi uygular.",
      fix: "Şehir, Ülke formatında konumunuzu girin.",
    });
  }

  const hasLinkedIn = personalInfo.linkedin.trim().length > 0;
  const hasGithub = personalInfo.github.trim().length > 0;
  if (hasLinkedIn || hasGithub) {
    ats += 3;
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "tip",
      title: "Sosyal profil yok",
      message: "LinkedIn veya GitHub profili profesyonellik sinyali verir.",
      fix: "LinkedIn profilinizi ekleyin.",
    });
  }

  const allDates = [
    ...experiences.flatMap((e) => [e.startDate, e.endDate]),
    ...educations.flatMap((e) => [e.startDate, e.endDate]),
    ...certificates.map((c) => c.issueDate),
    ...projects.flatMap((p) => [p.startDate, p.endDate]),
  ].filter(Boolean);

  const datesOk = allDates.every((d) => isValidIso(d));
  if (datesOk) {
    ats += 3;
  } else {
    suggestions.push({
      id: id(),
      section: "experience",
      severity: "warning",
      title: "Tarih formatı hatalı",
      message: "Bazı tarihler ISO formatında değil. ATS'ler tutarsız tarihleri okuyamaz.",
      fix: "Tarih seçicisini kullanarak tüm tarihleri tekrar seçin.",
    });
  }

  /* ── KATMAN 2: İçerik Kalitesi (max 35) ── */
  let content = 0;

  const summaryLen = personalInfo.summary.trim().length;
  if (summaryLen > 0) {
    content += 5;
    if (summaryLen >= 250 && summaryLen <= 600) {
      content += 5;
    } else if (summaryLen < 250) {
      suggestions.push({
        id: id(),
        section: "personalInfo",
        severity: "warning",
        title: "Özet çok kısa",
        message: `Özet ${summaryLen} karakter. ATS için ideal uzunluk 250-600 karakter.`,
        fix: "Özetinizi genişletin; becerilerinizi, deneyiminizi ve hedeflerinizi ekleyin.",
      });
    } else {
      suggestions.push({
        id: id(),
        section: "personalInfo",
        severity: "warning",
        title: "Özet çok uzun",
        message: "600 karakteri aşan özetler ATS'de kesilebilir.",
        fix: "Özetinizi 600 karakterin altına indirin.",
      });
    }
  } else {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "warning",
      title: "Profesyonel özet eksik",
      message: "Özet bölümü ATS'in anahtar kelime taradığı ilk alandır.",
      fix: "2-4 cümlelik profesyonel bir özet yazın.",
    });
  }

  const expToScore = experiences.slice(0, 5);
  expToScore.forEach((exp) => {
    if (exp.description.trim().length > 0) {
      if (hasStrongMetric(exp.description)) {
        content += 3;
      } else {
        suggestions.push({
          id: id(),
          section: "experience",
          severity: "warning",
          title: "Sayısal metrik eksik",
          message: `"${exp.position}" pozisyonunun açıklamasında ölçülebilir sonuç yok.`,
          fix: "%, rakam veya ölçek ekleyin (ör: '%40 maliyet azalttım', '10 kişilik ekip yönettim').",
          entryId: exp.id,
        });
      }

      if (looksLikeActionVerb(exp.description)) {
        content += 2;
      } else {
        suggestions.push({
          id: id(),
          section: "experience",
          severity: "warning",
          title: "Pasif dil kullanımı",
          message: `"${exp.position}" açıklaması aksiyon fiiliyle başlamıyor.`,
          fix: "Geliştirdim, Yönettim, Tasarladım gibi güçlü fiillerle başlayın.",
          entryId: exp.id,
        });
      }
    } else {
      suggestions.push({
        id: id(),
        section: "experience",
        severity: "warning",
        title: "Deneyim açıklaması boş",
        message: `"${exp.position}" için açıklama girilmemiş.`,
        fix: "Aksiyon fiilleri ve sayısal metriklerle 3-5 madde ekleyin.",
        entryId: exp.id,
      });
    }
  });

  /* ── KATMAN 3: Bütünlük (max 20) ── */
  let completeness = 0;

  if (experiences.length >= 1) {
    completeness += 5;
  } else {
    suggestions.push({
      id: id(),
      section: "experience",
      severity: "error",
      title: "İş deneyimi yok",
      message: "ATS sistemlerinde en fazla puanlanan bölüm iş deneyimidir.",
      fix: "En az bir iş deneyimi ekleyin.",
    });
  }

  if (educations.length >= 1) {
    completeness += 5;
  } else {
    suggestions.push({
      id: id(),
      section: "education",
      severity: "warning",
      title: "Eğitim bilgisi yok",
      message: "Eğitim bölümü çoğu ATS filtresinde kullanılır.",
      fix: "En az bir eğitim kaydı ekleyin.",
    });
  }

  const skillCount = skills.length;
  if (skillCount >= 5 && skillCount <= 15) {
    completeness += 5;
  } else if (skillCount < 5) {
    suggestions.push({
      id: id(),
      section: "skills",
      severity: "warning",
      title: "Yeterli beceri yok",
      message: `${skillCount} beceri var; ATS için en az 5 önerilir.`,
      fix: "İş ilanıyla örtüşen becerilerinizi ekleyin.",
    });
  } else {
    suggestions.push({
      id: id(),
      section: "skills",
      severity: "warning",
      title: "Keyword stuffing riski",
      message: `${skillCount} beceri var; 15'ten fazlası ATS tarafından şüpheli işaretlenebilir.`,
      fix: "En alakalı 10-15 beceriyle sınırlayın.",
    });
  }

  const hasCertsOrProjects = certificates.length > 0 || projects.length > 0;
  if (hasCertsOrProjects) {
    completeness += 5;
  } else {
    suggestions.push({
      id: id(),
      section: "projects",
      severity: "tip",
      title: "Sertifika veya proje yok",
      message: "Sertifikalar ve projeler yetkinliğinizi somutlaştırır.",
      fix: "En az bir sertifika veya proje ekleyin.",
    });
  }

  /* ── KATMAN 4: Profesyonellik (max 20) ── */
  let professionalism = 0;

  const hasAcronymExpansion = skills.some((s) => getAcronymExpansion(s) !== null);
  if (hasAcronymExpansion) {
    professionalism += 5;
  } else if (skills.length > 0) {
    suggestions.push({
      id: id(),
      section: "skills",
      severity: "tip",
      title: "Kısaltma açılımı yok",
      message: "SEO, CRM, AI gibi kısaltmalar her ATS'de tanınmaz.",
      fix: "Kısaltmaları açık haliyle yazın (ör: 'SEO (Arama Motoru Optimizasyonu)').",
    });
  }

  if (skillCount <= 15) {
    professionalism += 5;
  }

  const jWords = jobTitleWords(personalInfo.jobTitle);
  const summaryLower = personalInfo.summary.toLowerCase();
  const summaryMentionsTitle =
    jWords.length > 0 && jWords.some((w) => summaryLower.includes(w));
  if (summaryMentionsTitle) {
    professionalism += 5;
  } else if (personalInfo.summary.trim().length > 0 && jWords.length > 0) {
    suggestions.push({
      id: id(),
      section: "personalInfo",
      severity: "tip",
      title: "Özet unvan anahtar kelimesini içermiyor",
      message: "ATS, özette hedef pozisyon kelimelerini arar.",
      fix: `Özetinize "${personalInfo.jobTitle}" ile ilgili anahtar kelimeler ekleyin.`,
    });
  }

  const skillsLower = skills.map((s) => s.toLowerCase().trim());
  const uniqueSkills = new Set(skillsLower);
  const hasDuplicates = uniqueSkills.size < skillsLower.length;
  if (!hasDuplicates) {
    professionalism += 5;
  } else {
    suggestions.push({
      id: id(),
      section: "skills",
      severity: "warning",
      title: "Tekrar eden beceriler",
      message: "Aynı beceri birden fazla kez girilmiş.",
      fix: "Tekrar eden becerileri kaldırın.",
    });
  }

  // Süresi dolmuş sertifika uyarısı
  certificates.forEach((cert) => {
    if (isCertificateExpired(cert.expiryDate)) {
      suggestions.push({
        id: id(),
        section: "certificates",
        severity: "warning",
        title: "Sertifika süresi dolmuş",
        message: `"${cert.name}" sertifikasının süresi dolmuş.`,
        fix: "Süresi dolmuş sertifikaları CV'nizden kaldırmanızı öneririz.",
        entryId: cert.id,
      });
    }
  });

  const total = Math.min(100, ats + content + completeness + professionalism);

  return {
    total,
    layers: {
      ats: { label: "ATS Yapısı", score: ats, maxScore: 25, color: "#3b82f6" },
      content: { label: "İçerik Kalitesi", score: content, maxScore: 35, color: "#8b5cf6" },
      completeness: { label: "Bütünlük", score: completeness, maxScore: 20, color: "#10b981" },
      professionalism: { label: "Profesyonellik", score: professionalism, maxScore: 20, color: "#f59e0b" },
    },
    suggestions,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#3b82f6";
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Mükemmel";
  if (score >= 70) return "İyi";
  if (score >= 40) return "Orta";
  return "Zayıf";
}

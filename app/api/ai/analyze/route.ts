import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { CVData } from "@/types/cv";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Sen bir ATS (Applicant Tracking System) uzmanısın. CV'leri analiz edip Türkçe öneriler sunarsın.

ATS kuralları:
- İletişim bilgileri (ad, e-posta, telefon, konum) dolu olmalı
- İş deneyimi açıklamaları aksiyon fiilleriyle başlamalı
- Açıklamalarda sayısal metrikler olmalı (%, rakam, büyüklük)
- Özet 250-600 karakter arası olmalı
- Beceriler 5-15 aralığında olmalı
- Tarihler tutarlı formatta olmalı
- Sertifikalar güncel olmalı

Yanıtını YALNIZCA şu JSON formatında ver (başka hiçbir şey ekleme):
{
  "suggestions": [
    {
      "id": "benzersiz-id",
      "section": "personalInfo|experience|education|skills|certificates|projects|languages",
      "severity": "error|warning|tip",
      "title": "Kısa başlık",
      "message": "Detaylı açıklama",
      "fix": "Somut düzeltme önerisi"
    }
  ],
  "overallFeedback": "1-2 cümle genel değerlendirme"
}`;

export async function POST(req: NextRequest) {
  try {
    const { cvData } = (await req.json()) as { cvData: CVData };

    const cvSummary = buildCVSummary(cvData);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Aşağıdaki CV'yi analiz et ve Türkçe öneriler sun:\n\n${cvSummary}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Geçersiz JSON yanıtı");

    const result = JSON.parse(jsonMatch[0]);

    if (result.suggestions) {
      result.suggestions = result.suggestions.map(
        (s: Record<string, unknown>, i: number) => ({ ...s, id: `ai-${i}` })
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: "Analiz başarısız. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

function buildCVSummary(cv: CVData): string {
  const { personalInfo, experiences, educations, skills, certificates, projects, languages } = cv;
  const lines: string[] = [];

  lines.push(`AD SOYAD: ${personalInfo.fullName}`);
  lines.push(`HEDEF POZİSYON: ${personalInfo.jobTitle}`);
  lines.push(`E-POSTA: ${personalInfo.email}`);
  lines.push(`TELEFON: ${personalInfo.phone}`);
  lines.push(`KONUM: ${personalInfo.location}`);
  lines.push(`LİNKEDİN: ${personalInfo.linkedin}`);
  lines.push(`GİTHUB: ${personalInfo.github}`);
  lines.push(`ÖZET (${personalInfo.summary.length} karakter): ${personalInfo.summary}`);

  lines.push(`\nDENEYİM SAYISI: ${experiences.length}`);
  experiences.forEach((e, i) => {
    lines.push(`  Deneyim ${i + 1}: ${e.position} @ ${e.company} (${e.startDate} - ${e.endDate})`);
    lines.push(`  Açıklama: ${e.description || "(boş)"}`);
  });

  lines.push(`\nEĞİTİM SAYISI: ${educations.length}`);
  educations.forEach((e, i) => {
    lines.push(`  Eğitim ${i + 1}: ${e.degree} - ${e.school}`);
  });

  lines.push(`\nBECERİLER (${skills.length}): ${skills.join(", ") || "(boş)"}`);

  lines.push(`\nSERTİFİKA SAYISI: ${certificates.length}`);
  certificates.forEach((c, i) => {
    lines.push(`  Sertifika ${i + 1}: ${c.name} (${c.issuer}, ${c.issueDate}${c.expiryDate ? ` - ${c.expiryDate}` : ""})`);
  });

  lines.push(`\nPROJE SAYISI: ${projects.length}`);
  projects.forEach((p, i) => {
    lines.push(`  Proje ${i + 1}: ${p.name} - Teknolojiler: ${p.technologies || "(boş)"}`);
    lines.push(`  Açıklama: ${p.description || "(boş)"}`);
  });

  lines.push(`\nDİL SAYISI: ${languages.length}`);
  languages.forEach((l) => {
    lines.push(`  ${l.name}: ${l.level}`);
  });

  return lines.join("\n");
}

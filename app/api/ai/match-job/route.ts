import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { CVData } from "@/types/cv";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Sen bir iş ilanı eşleştirme uzmanısın. CV'yi iş ilanıyla karşılaştırıp Türkçe analiz yaparsın.

Yanıtını YALNIZCA şu JSON formatında ver (başka hiçbir şey ekleme):
{
  "matchScore": 0-100 arası sayı,
  "missingKeywords": ["eksik anahtar kelime 1", "eksik anahtar kelime 2"],
  "presentKeywords": ["mevcut anahtar kelime 1", "mevcut anahtar kelime 2"],
  "recommendations": [
    {
      "type": "add-skill|rephrase|emphasize",
      "message": "Kısa Türkçe açıklama",
      "suggestion": "Somut öneri"
    }
  ]
}

matchScore: İlan gereksinimlerine ne kadar uyduğunun yüzdesi (0-100).
missingKeywords: İlanda var ama CV'de olmayan önemli beceri/teknoloji/nitelik (max 10).
presentKeywords: İlanda da CV'de de geçen önemli kelimeler (max 10).
recommendations: En önemli 3-5 öneri.`;

export async function POST(req: NextRequest) {
  try {
    const { cvData, jobDescription } = (await req.json()) as {
      cvData: CVData;
      jobDescription: string;
    };

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: "İş ilanı boş." }, { status: 400 });
    }

    const cvText = buildCVText(cvData);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `CV:\n${cvText}\n\n---\n\nİŞ İLANI:\n${jobDescription}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Geçersiz JSON yanıtı");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("Match-job API error:", err);
    return NextResponse.json(
      { error: "Eşleştirme başarısız. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

function buildCVText(cv: CVData): string {
  const parts: string[] = [];
  const { personalInfo, experiences, skills, certificates, projects } = cv;

  parts.push(`Hedef Pozisyon: ${personalInfo.jobTitle}`);
  parts.push(`Özet: ${personalInfo.summary}`);
  parts.push(`Beceriler: ${skills.join(", ")}`);

  if (experiences.length > 0) {
    parts.push("Deneyimler:");
    experiences.forEach((e) => {
      parts.push(`  ${e.position} @ ${e.company}: ${e.description}`);
    });
  }

  if (certificates.length > 0) {
    parts.push(`Sertifikalar: ${certificates.map((c) => c.name).join(", ")}`);
  }

  if (projects.length > 0) {
    parts.push("Projeler:");
    projects.forEach((p) => {
      parts.push(`  ${p.name}: ${p.technologies} - ${p.description}`);
    });
  }

  return parts.join("\n");
}

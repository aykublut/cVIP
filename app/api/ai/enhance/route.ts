import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import type { FieldType } from "@/types/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FIELD_PROMPTS: Record<FieldType, string> = {
  summary: `Profesyonel özeti geliştir. Kurallar:
- 250-450 karakter arası olmalı
- İş unvanıyla ilgili anahtar kelimeler içermeli
- Güçlü, aktif bir dille yazılmalı
- Deneyim, beceri ve hedefi özetlemeli
- Türkçe yaz (teknik terimler İngilizce kalabilir)
- SADECE geliştirilmiş metni yaz, başka hiçbir şey ekleme`,

  experience: `İş deneyimi açıklamasını geliştir. Kurallar:
- Her madde MUTLAKA aksiyon fiiliyle başlamalı (Geliştirdim, Yönettim, Tasarladım, Artırdım vb.)
- Her maddede sayısal metrik olmalı (%, rakam, ölçek)
- 3-5 madde, her madde 1-2 cümle
- Türkçe yaz (teknik terimler İngilizce kalabilir)
- SADECE geliştirilmiş metni yaz, açıklama ekleme`,

  project: `Proje açıklamasını geliştir. Kurallar:
- Projenin amacı ve sonucunu belirt
- Kullanılan teknolojileri doğal dille ekle
- Varsa etkiyi sayısal ifadeyle belirt
- 2-4 cümle, net ve öz
- Türkçe yaz (teknik terimler İngilizce kalabilir)
- SADECE geliştirilmiş metni yaz, başka hiçbir şey ekleme`,
};

export async function POST(req: NextRequest) {
  try {
    const { fieldType, currentContent, jobTitle } = (await req.json()) as {
      fieldType: FieldType;
      currentContent: string;
      jobTitle: string;
    };

    if (!currentContent?.trim()) {
      return new Response("İçerik boş.", { status: 400 });
    }

    const systemPrompt = FIELD_PROMPTS[fieldType] ?? FIELD_PROMPTS.summary;

    const groqStream = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 400,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Hedef pozisyon: ${jobTitle || "Belirtilmemiş"}\n\nMevcut metin:\n${currentContent}`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          console.error("Enhance stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Enhance API error:", err);
    return new Response("Geliştirme başarısız.", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

/**
 * Ortama göre Chromium başlatır:
 * - Development: yerel `puppeteer` (tam Chromium indirir)
 * - Production (Vercel): `puppeteer-core` + `@sparticuz/chromium` (küçük, serverless-uyumlu)
 */
async function launchBrowser() {
  if (isDev) {
    const puppeteer = (await import("puppeteer")).default;
    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        // ✅ OPTİMİZASYON: Tırtıklı fontları engeller, grayscale zorlar
        "--disable-font-subpixel-aliasing",
      ],
    });
  }

  // Vercel / Production
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteer = (await import("puppeteer-core")).default;

  return puppeteer.launch({
    args: [
      ...chromium.args,
      "--disable-dev-shm-usage",
      // ✅ OPTİMİZASYON: Vercel ortamında da pürüzsüzleştirme
      "--disable-font-subpixel-aliasing",
    ],
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

export async function POST(req: NextRequest) {
  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null;

  try {
    const { html, css } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "HTML gerekli" }, { status: 400 });
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    // A4 yüksek çözünürlük
    await page.setViewport({
      width: 794, // 210mm @ 96dpi
      height: 1123, // 297mm @ 96dpi
      deviceScaleFactor: 2, // Retina kalitesi
    });

    const fullHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap&subset=latin,latin-ext" rel="stylesheet">
  <style>
    /* ✅ KUSURSUZ PDF TİPOGRAFİSİ İÇİN HAYATİ KURALLAR */
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      
      /* 1. LİGATÜR İPTALİ: l, ı, i, f harflerinin yapışmasını ve bozulmasını engeller */
      font-variant-ligatures: none !important;
      
      /* 2. GEOMETRİK KESİNLİK: Chromium'un harf aralığı (kerning) hatasını çözer */
      text-rendering: geometricPrecision !important;
      
      /* 3. SOFT GÖRÜNÜM: PDF'e basılırken piksellenmeyi engeller */
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }
    
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm;
      height: 297mm;
      background: #ffffff;
    }
    @page {
      size: A4;
      margin: 0;
    }
    [data-pdf-root] {
      box-shadow: none !important;
      --tw-ring-shadow: 0 0 #0000 !important;
    }
  </style>
  <style>${css || ""}</style>
</head>
<body>${html}</body>
</html>`;

    await page.setContent(fullHtml, {
      waitUntil: ["load", "networkidle0"],
      timeout: 30000,
    });

    // Fontların tam yüklenmesini bekle
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="CV_cVIP.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PDF oluşturma hatası" },
      { status: 500 },
    );
  }
}

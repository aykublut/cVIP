import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

async function launchBrowser() {
  if (isDev) {
    const puppeteer = (await import("puppeteer")).default;
    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
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

    // 🚀 NÜKLEER ÇÖZÜM 1: deviceScaleFactor 4'e çıkarıldı.
    // Bu, dikey çizgilerdeki (l ve ı) piksel yuvarlama hatasını (bold görünümü) yok eder.
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 4, // 2'den 4'e yükseltildi (Ultra-High Precision)
    });

    const fullHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap&subset=latin,latin-ext" rel="stylesheet">
  <style>
    /* 🚀 NÜKLEER ÇÖZÜM 2 & 3: CSS ZORLAMALARI */
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      
      /* PDF motorunun fontları manipüle etmesini kesin olarak yasakla */
      font-synthesis: none !important; /* Tarayıcının sahte bold yapmasını engeller */
      font-optical-sizing: none !important; /* Variable font bozulmalarını engeller */
      
      /* Mikro-Nudge: Harfleri piksel gridinden hafifçe kaydırarak yuvarlama hatasını kırar */
      letter-spacing: 0.02px !important;
      
      /* Önceki kalkanlarımızı tutuyoruz */
      font-variant-ligatures: none !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      
      /* Stroke hack'i görünmez bir renge çektik ki leke yapmasın */
      -webkit-text-stroke: 0.05px rgba(255,255,255,0.01) !important;
    }
    
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm;
      height: 297mm;
      background: #ffffff;
      /* Rendering motorunu donanımsal hizalamaya zorlar */
      transform: translateZ(0); 
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

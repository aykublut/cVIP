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

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    const fullHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;

      /* letter-spacing: 0 zorunlu — herhangi bir değer Chromium PDF text doubling bug'ını tetikler */
      letter-spacing: 0 !important;

      /* Tarayıcının sahte bold/italic üretmesini engelle */
      font-synthesis: none !important;
      font-optical-sizing: none !important;
      font-variant-ligatures: none !important;

      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm;
      background: #ffffff;
    }

    @page {
      size: A4;
      margin: 0;
    }

    /* PDF kök elementi — önizleme stillerini temizle */
    [data-pdf-root] {
      box-shadow: none !important;
      --tw-ring-shadow: 0 0 #0000 !important;
      overflow: visible !important;
      height: auto !important;
      min-height: 297mm !important;
    }

    /* sr-only öğeleri PDF metin katmanından çıkar — çift okuma önlenir */
    .sr-only {
      display: none !important;
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
        "Content-Disposition": 'attachment; filename="CV.pdf"',
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

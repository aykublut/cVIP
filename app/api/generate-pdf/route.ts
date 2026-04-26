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

  // Production / Vercel
  // @sparticuz/chromium binary'yi kendi paketi içinde (.br) taşır,
  // executablePath() onu /tmp'ye açar — harici URL gerekmez.
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteer = (await import("puppeteer-core")).default;

  const executablePath =
    process.env.CHROMIUM_EXECUTABLE_PATH ||
    (await chromium.executablePath());

  return puppeteer.launch({
    args: [
      ...chromium.args,
      "--disable-dev-shm-usage",
      "--disable-font-subpixel-aliasing",
      "--single-process",
      "--no-zygote",
    ],
    executablePath,
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
      letter-spacing: 0 !important;
      font-synthesis: none !important;
      font-optical-sizing: none !important;
      font-variant-ligatures: none !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      box-sizing: border-box;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      min-width: 210mm !important;
      max-width: 210mm !important;
      background: #ffffff;
      overflow: hidden;
    }

    @page {
      size: A4;
      margin: 0;
    }

    [data-pdf-root] {
      box-shadow: none !important;
      --tw-ring-shadow: 0 0 #0000 !important;
      --tw-shadow: 0 0 #0000 !important;
      overflow: hidden !important;
      width: 210mm !important;
      min-width: 210mm !important;
      max-width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      max-height: 297mm !important;
      position: relative !important;
      transform: none !important;
    }

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

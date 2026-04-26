import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium",
    "puppeteer",
  ],
  // Vercel output file tracing doesn't pick up binary assets automatically.
  // Explicitly include the Chromium .br bundle so it lands in /var/task.
  outputFileTracingIncludes: {
    "/api/generate-pdf": [
      "./node_modules/@sparticuz/chromium/**/*",
      "./node_modules/.pnpm/@sparticuz+chromium*/node_modules/@sparticuz/chromium/**/*",
    ],
  },
};

export default nextConfig;

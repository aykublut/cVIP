"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstaller() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Service Worker kayıt
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Zaten standalone modda mı (yüklenmiş PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as Navigator & { standalone: boolean }).standalone);

    if (isStandalone) return;

    // Daha önce kapatıldıysa gösterme
    if (sessionStorage.getItem("pwa-dismissed")) return;

    // Android/Chrome: install prompt olayını yakala
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari: manuel yönlendirme göster
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIOS && isSafari) {
      // 3 saniye sonra göster (ilk yükleme gecikmesi)
      const timer = setTimeout(() => setShowIOSHint(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setInstallPrompt(null);
    setShowIOSHint(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  };

  if (dismissed) return null;

  // Android / Chrome install prompt
  if (installPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[500] lg:hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#0A1930] border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052CC] to-[#00A3FF] flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-black">Ana Ekrana Ekle</p>
            <p className="text-white/50 text-xs">
              cVIP&apos;i uygulama gibi kullan
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="bg-[#0052CC] text-white text-xs font-black px-4 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform"
          >
            Yükle
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/30 hover:text-white/60 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari yönlendirmesi
  if (showIOSHint) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[500] lg:hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#0A1930] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052CC] to-[#00A3FF] flex items-center justify-center shrink-0">
              <Share className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-black">Ana Ekrana Ekle</p>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">
                Alt menüdeki{" "}
                <span className="text-white font-bold">Paylaş</span> →{" "}
                <span className="text-white font-bold">
                  Ana Ekrana Ekle
                </span>{" "}
                ile uygulama olarak yükle
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/30 hover:text-white/60 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

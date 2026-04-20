"use client";

import { useCVStore } from "@/store/useCVStore";
import { THEMES } from "@/lib/themes";
import { CheckCircle2, Palette, Sparkles, FileBadge } from "lucide-react";

export default function StepResult() {
  const { activeThemeId, setTheme } = useCVStore();

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      {/* BAŞLIK */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A1930] to-[#0052CC] flex items-center justify-center shadow-[0_8px_20px_rgba(0,82,204,0.3)]">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] tracking-tight leading-none mb-2">
            Görsel Kimlik
          </h2>
          <span className="text-[11px] font-bold text-[#8A9EBD] uppercase tracking-[0.2em]">
            Stüdyo Kalitesinde Şablonlar
          </span>
        </div>
      </div>

      {/* ŞABLON LİSTESİ */}
      <div className="space-y-5 mb-10">
        {THEMES.map((theme) => {
          const isActive = activeThemeId === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all duration-300 group ${
                isActive
                  ? "border-[#0052CC] bg-gradient-to-r from-[#0052CC]/5 to-transparent shadow-[0_8px_30px_rgba(0,82,204,0.12)] scale-[1.02]"
                  : "border-[#E6F0FA] bg-white hover:border-[#0052CC]/30 hover:shadow-[0_8px_25px_rgba(0,20,50,0.05)]"
              }`}
            >
              <div className="flex flex-col items-start gap-1.5 text-left">
                <span
                  className={`text-lg font-black tracking-wide transition-colors ${
                    isActive
                      ? "text-[#0052CC]"
                      : "text-[#0A1930] group-hover:text-[#0052CC]"
                  }`}
                >
                  {theme.name}
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${isActive ? "text-[#0A1930]" : "text-[#8A9EBD]"}`}
                >
                  {theme.description}
                </span>
              </div>

              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isActive ? "border-[#0052CC] bg-[#0052CC] shadow-[0_0_15px_rgba(0,82,204,0.4)]" : "border-[#CBD6E2] group-hover:border-[#0052CC]/50"}`}
              >
                {isActive && <CheckCircle2 className="w-5 h-5 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* FİNAL BİLGİLENDİRME KARTI */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1930] to-[#0B132B] p-8 rounded-[2rem] shadow-2xl border border-white/10 text-center">
        {/* Dekoratif Işıltı */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#0052CC]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00A3FF]/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/10">
            <FileBadge className="w-6 h-6 text-[#00A3FF]" />
          </div>
          <h3 className="text-white text-lg font-black mb-2 tracking-wide">
            CV'niz Hazır, Yönetici.
          </h3>
          <p className="text-[#8A9EBD] text-sm font-medium leading-relaxed max-w-[280px]">
            Sağ taraftaki stüdyodan son kontrollerinizi yapın ve sol üst
            köşedeki <strong className="text-white">PDF İNDİR</strong> butonuna
            tıklayarak yüksek çözünürlüklü kopyanızı alın.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#00A3FF] uppercase tracking-[0.3em]">
            <Sparkles className="w-3 h-3" /> cVIP Executive Standartı
          </div>
        </div>
      </div>
    </div>
  );
}

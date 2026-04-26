"use client";

import { useState, useRef, useEffect } from "react";
import { useCVStore } from "@/store/useCVStore";
import { useAIStore } from "@/store/useAIStore";
import { THEMES } from "@/lib/themes";
import { slugifyForFilename } from "@/lib/cv-helpers";
import {
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  Palette,
  LayoutTemplate,
  CheckCircle2,
  Eye,
  X,
  ChevronUp,
  Camera,
  CameraOff,
} from "lucide-react";

import StepPersonalInfo from "./wizard/StepPersonalInfo";
import StepExperience from "./wizard/StepExperience";
import StepEducation from "./wizard/StepEducation";
import StepSkills from "./wizard/StepSkills";
import StepCertificates from "./wizard/StepCertificates";
import StepProjects from "./wizard/StepProjects";
import StepLanguages from "./wizard/StepLanguages";
import StepAIPanel from "./wizard/StepAIPanel";

import ModernSplitTheme from "./themes/ModernSplitTheme";
import MinimalistTheme from "./themes/MinimalistTheme";
import DefaultTheme from "./themes/DefaultTheme";
import Image from "next/image";

const themeComponents: Record<string, React.FC> = {
  "modern-split": ModernSplitTheme,
  "minimalist-center": MinimalistTheme,
  "default-theme": DefaultTheme,
};

const STEPS = [
  { id: 0, title: "Kimlik" },
  { id: 1, title: "Kariyer" },
  { id: 2, title: "Akademi" },
  { id: 3, title: "Yetenek" },
  { id: 4, title: "Sertifika" },
  { id: 5, title: "Proje" },
  { id: 6, title: "Dil" },
  { id: 7, title: "Analiz" },
];

export default function InlineCV() {
  const [currentStep, setCurrentStep] = useState(0);
  const { activeThemeId, setTheme, cvData, updatePersonalInfo } = useCVStore();
  const calculateScore = useAIStore((s) => s.calculateScore);
  const hasPhoto = !!cvData.personalInfo.photo;

  // Debounced real-time score hesaplama
  useEffect(() => {
    const timer = setTimeout(() => calculateScore(cvData), 300);
    return () => clearTimeout(timer);
  }, [cvData, calculateScore]);
  const showPhoto = !!cvData.personalInfo.showPhoto;
  const togglePhoto = () => {
    if (!hasPhoto) return;
    updatePersonalInfo({ showPhoto: !showPhoto });
  };
  const [isGenerating, setIsGenerating] = useState(false);

  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [isMobileThemeMenuOpen, setIsMobileThemeMenuOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!contentRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      await document.fonts.ready;

      const clone = contentRef.current.cloneNode(true) as HTMLDivElement;
      clone.setAttribute("data-pdf-root", "true");
      const html = clone.outerHTML;

      const css = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules || [])
              .map((rule) => rule.cssText)
              .join("\n");
          } catch {
            return "";
          }
        })
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, css }),
      });

      if (!response.ok) throw new Error(`Sunucu hatası: ${response.status}`);

      const safeName = slugifyForFilename(cvData.personalInfo.fullName);
      const filename = safeName ? `${safeName}_CV.pdf` : "CV.pdf";

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF oluşturma hatası:", err);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsGenerating(false);
    }
  };

  const studioContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (!studioContainerRef.current) return;

      const width = studioContainerRef.current.clientWidth;
      const height = studioContainerRef.current.clientHeight;
      const isMobile = window.innerWidth < 1024;

      const A4_WIDTH = 794;
      const A4_HEIGHT = 1123;

      const PADDING_X = isMobile ? 32 : 120;
      const PADDING_Y = isMobile ? 180 : 40;

      const scaleX = (width - PADDING_X) / A4_WIDTH;
      const scaleY = (height - PADDING_Y) / A4_HEIGHT;

      setScale(Math.max(0.15, Math.min(scaleX, scaleY)));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    const observer = new ResizeObserver(updateScale);
    if (studioContainerRef.current)
      observer.observe(studioContainerRef.current);

    return () => {
      window.removeEventListener("resize", updateScale);
      observer.disconnect();
    };
  }, [isMobilePreviewOpen]);

  const ActiveThemeComponent =
    themeComponents[activeThemeId] || ModernSplitTheme;

  const nextStep = () =>
    setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

  const activeThemeName =
    THEMES.find((t) => t.id === activeThemeId)?.name || "Şablon";

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepPersonalInfo />;
      case 1:
        return <StepExperience />;
      case 2:
        return <StepEducation />;
      case 3:
        return <StepSkills />;
      case 4:
        return <StepCertificates />;
      case 5:
        return <StepProjects />;
      case 6:
        return <StepLanguages />;
      case 7:
        return <StepAIPanel />;
      default:
        return <StepPersonalInfo />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0A1930] font-sans overflow-hidden">
      <div className="w-full lg:w-[45%] xl:w-[40%] h-full bg-white flex flex-col z-30 shadow-[30px_0_60px_-15px_rgba(0,0,0,0.3)] border-r border-[#E6F0FA] relative">
        <header className="h-20 lg:h-24 px-6 lg:px-10 flex items-center justify-between border-b border-[#F0F4F8] shrink-0 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#0A1930] to-[#0052CC] flex items-center justify-center shadow-lg shadow-[#0052CC]/20 rotate-3 hover:rotate-0 transition-transform duration-500 relative overflow-hidden">
              <Image fill sizes="48px" alt="logo" src="/logo2.png" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tighter text-[#0A1930] leading-none">
                c<span className="text-[#0052CC]">VIP</span>
              </h1>
              <span className="text-[8px] lg:text-[10px] font-bold text-[#8A9EBD] uppercase tracking-[0.4em]">
                Executive
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={togglePhoto}
              title={
                !hasPhoto
                  ? "Önce fotoğraf yükleyin (Kimlik adımı)"
                  : showPhoto
                  ? "Fotoğrafı CV'den kaldır"
                  : "Fotoğrafı CV'ye ekle"
              }
              disabled={!hasPhoto}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                showPhoto
                  ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  : "bg-[#F4F7FA] text-[#8A9EBD] hover:bg-[#E6F0FA] hover:text-[#0A1930]"
              }`}
            >
              {showPhoto ? (
                <Camera className="w-4 h-4" />
              ) : (
                <CameraOff className="w-4 h-4" />
              )}
              <span className="hidden xl:block">Fotoğraf</span>
            </button>

          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="flex group relative items-center gap-2 bg-[#F4F7FA] text-[#0A1930] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#0052CC] hover:text-white transition-all duration-500 shadow-sm active:scale-95 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Hazırlanıyor...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> PDF İNDİR
              </>
            )}
          </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 bg-gradient-to-b from-white to-[#F9FBFF]">
          <div className="max-w-xl mx-auto pb-20 lg:pb-0">{renderStep()}</div>
        </main>

        <footer className="h-20 lg:h-28 px-6 lg:px-10 border-t border-[#F0F4F8] bg-white flex items-center justify-between shrink-0 relative z-20">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 lg:gap-2 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs transition-all duration-300 ${
              currentStep === 0
                ? "text-[#CBD6E2] cursor-not-allowed"
                : "text-[#0A1930] hover:bg-[#F4F7FA] hover:text-[#0052CC]"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:block">GERİ</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 lg:gap-1.5">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                aria-label={`${step.title} adımına git`}
                className={`transition-all duration-500 rounded-full h-1.5 cursor-pointer ${
                  currentStep === step.id
                    ? "w-5 lg:w-8 bg-[#0052CC] shadow-[0_0_15px_rgba(0,82,204,0.4)]"
                    : "w-1.5 bg-[#E6F0FA] hover:bg-[#0052CC]/30"
                }`}
              />
            ))}
          </div>

          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="flex items-center gap-2 lg:gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 bg-[#0052CC] text-white hover:bg-[#0A1930] hover:shadow-xl hover:shadow-[#0052CC]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:block">PDF</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 lg:gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 bg-[#0A1930] text-white hover:bg-[#0052CC] hover:shadow-xl hover:shadow-[#0052CC]/20 active:scale-95"
            >
              <span className="hidden sm:block">İLERİ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </footer>

        <button
          onClick={() => setIsMobilePreviewOpen(true)}
          className="lg:hidden absolute bottom-28 right-6 z-40 bg-gradient-to-r from-[#0052CC] to-[#00A3FF] text-white px-5 py-3.5 rounded-full shadow-[0_10px_25px_rgba(0,82,204,0.4)] flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
        >
          <Eye className="w-4 h-4" /> ÖNİZLEME
        </button>
      </div>

      <div
        ref={studioContainerRef}
        className={`
          ${
            isMobilePreviewOpen
              ? "fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-bottom-full duration-500 bg-[#0A1930]"
              : "hidden"
          }
          lg:flex lg:flex-col lg:relative lg:flex-1 overflow-hidden bg-[#0A1930]
        `}
      >
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] bg-[#0052CC] opacity-[0.1] blur-[100px] lg:blur-[150px] rounded-full pointer-events-none" />

        <div className="lg:hidden w-full flex items-center justify-between p-5 relative z-[110] bg-[#0A1930]/80 backdrop-blur-md border-b border-white/5 shrink-0">
          <button
            onClick={() => {
              setIsMobilePreviewOpen(false);
              setIsMobileThemeMenuOpen(false);
            }}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {hasPhoto && (
              <button
                onClick={togglePhoto}
                className={`w-9 h-9 rounded-full flex items-center justify-center border active:scale-95 transition-all ${
                  showPhoto
                    ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                    : "bg-white/10 border-white/10 text-white/50"
                }`}
              >
                {showPhoto ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-[#0052CC] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_4px_15px_rgba(0,82,204,0.4)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGenerating ? "Hazırlanıyor..." : "İNDİR"}
            </button>
          </div>
        </div>

        <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-[120] flex-col gap-2 bg-[#0B1A3A]/80 backdrop-blur-2xl border border-white/5 p-2.5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center justify-center pb-3 pt-2 border-b border-white/5 mb-1 shrink-0">
            <Palette className="w-5 h-5 text-[#00A3FF] mb-2" />
            <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase">
              Şablon
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {THEMES.map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 w-48 shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#0052CC] to-[#00A3FF] text-white shadow-[0_4px_15px_rgba(0,82,204,0.4)]"
                      : "bg-white/5 text-[#8A9EBD] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <LayoutTemplate
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#8A9EBD] group-hover:text-[#00A3FF]"
                    }`}
                  />
                  <span className="text-[11px] font-black tracking-wide text-left leading-tight truncate">
                    {theme.name}
                  </span>
                  {isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 absolute right-3 opacity-90" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`lg:hidden absolute inset-x-0 bottom-0 z-[130] bg-[#0A1930]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[2.5rem] transition-transform duration-500 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] ${
            isMobileThemeMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "80vh" }}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-[#00A3FF]" />
              <h3 className="text-white font-black tracking-wide">
                Şablon Galerisi
              </h3>
            </div>
            <button
              onClick={() => setIsMobileThemeMenuOpen(false)}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {THEMES.map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsMobileThemeMenuOpen(false);
                  }}
                  className={`relative group flex items-center justify-between p-4 rounded-[1.5rem] transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#0052CC] to-[#00A3FF] text-white shadow-[0_4px_15px_rgba(0,82,204,0.4)]"
                      : "bg-white/5 text-[#8A9EBD] hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <LayoutTemplate
                      className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-[#8A9EBD]"}`}
                    />
                    <div className="flex flex-col items-start truncate">
                      <span className="text-xs font-black tracking-wide truncate w-full text-left">
                        {theme.name}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 opacity-90 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-[120] transition-all duration-300 ${
            isMobileThemeMenuOpen
              ? "opacity-0 pointer-events-none scale-90"
              : "opacity-100 scale-100"
          }`}
        >
          <button
            onClick={() => setIsMobileThemeMenuOpen(true)}
            className="flex items-center gap-3 bg-[#0B1A3A]/90 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
          >
            <Palette className="w-4 h-4 text-[#00A3FF]" />
            <span className="text-white text-xs font-black tracking-wider truncate max-w-[120px]">
              {activeThemeName}
            </span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <ChevronUp className="w-4 h-4 text-[#00A3FF]" />
          </button>
        </div>

        <div className="absolute top-8 right-10 items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-2xl z-20 pointer-events-none hidden lg:flex">
          <Sparkles className="w-3.5 h-3.5 text-[#00A3FF]" />
          <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.3em]">
            Canlı Önizleme
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full overflow-auto custom-scrollbar flex justify-center items-center lg:pl-15 relative z-10">
          <div
            style={{
              width: `calc(210mm * ${scale})`,
              height: `calc(297mm * ${scale})`,
            }}
            className="relative shrink-0 transition-all duration-200"
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              className="absolute top-0 left-0"
            >
              <div className="absolute inset-0 bg-black/60 blur-[100px] -bottom-10 opacity-70 rounded-full pointer-events-none" />

              <div
                ref={contentRef}
                className="w-[210mm] min-w-[210mm] h-[297mm] min-h-[297mm] bg-white shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-white/10"
              >
                <ActiveThemeComponent />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-10 right-10 text-white/5 text-7xl font-black select-none pointer-events-none tracking-tighter z-0">
          cVIP
        </div>

      </div>
    </div>
  );
}

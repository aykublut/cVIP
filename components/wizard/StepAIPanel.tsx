"use client";

import { useState } from "react";
import { useAIStore } from "@/store/useAIStore";
import { useCVStore } from "@/store/useCVStore";
import { ATSScoreRing } from "@/components/ai/ATSScoreRing";
import {
  Bot,
  Search,
  Briefcase,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import type {
  ATSSeverity,
  ATSSuggestion,
  ATSSection,
  JobMatchResult,
} from "@/types/ai";

const SECTION_LABELS: Record<ATSSection, string> = {
  personalInfo: "Kişisel Bilgiler",
  experience: "Deneyim",
  education: "Eğitim",
  skills: "Beceriler",
  certificates: "Sertifikalar",
  projects: "Projeler",
  languages: "Diller",
};

const SEVERITY_CONFIG = {
  error: {
    Icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  warning: {
    Icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  tip: {
    Icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
};

const TABS = [
  { id: "score" as const, label: "Anlık Skor", Icon: Sparkles },
  { id: "analysis" as const, label: "Derin Analiz", Icon: Search },
  { id: "job" as const, label: "İş İlanı", Icon: Briefcase },
];

export default function StepAIPanel() {
  const { cvData } = useCVStore();
  const {
    scoreResult,
    activeTab,
    setActiveTab,
    isAnalyzing,
    analysisSuggestions,
    overallFeedback,
    analysisError,
    runAnalysis,
    clearAnalysis,
    jobDescription,
    setJobDescription,
    isMatchingJob,
    jobMatchResult,
    jobMatchError,
    matchJob,
    clearJobMatch,
  } = useAIStore();

  const [filterSeverity, setFilterSeverity] = useState<ATSSeverity | "all">(
    "all"
  );

  const localSuggestions = scoreResult?.suggestions ?? [];
  const allSuggestions =
    activeTab === "score"
      ? localSuggestions
      : activeTab === "analysis"
        ? analysisSuggestions
        : [];

  const filtered =
    filterSeverity === "all"
      ? allSuggestions
      : allSuggestions.filter((s) => s.severity === filterSeverity);

  const errorCount = allSuggestions.filter((s) => s.severity === "error").length;
  const warnCount = allSuggestions.filter((s) => s.severity === "warning").length;
  const tipCount = allSuggestions.filter((s) => s.severity === "tip").length;

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A1930] to-[#0052CC] flex items-center justify-center shadow-lg shadow-[#0052CC]/20 shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0A1930] tracking-tight">
            AI Asistan
          </h2>
          <p className="text-sm text-[#8A9EBD] font-medium mt-0.5">
            CV'nizi analiz edin, ATS skorunuzu yükseltin
          </p>
        </div>
      </div>

      {/* Sekme seçici */}
      <div className="flex bg-[#F4F7FA] rounded-2xl p-1 gap-1">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeTab === id
                ? "bg-white text-[#0052CC] shadow-sm"
                : "text-[#8A9EBD] hover:text-[#0A1930]"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── ANLIQ SKOR ── */}
      {activeTab === "score" && (
        <div className="space-y-4">
          {scoreResult ? (
            <>
              <div className="bg-gradient-to-br from-[#F4F7FA] to-white rounded-3xl p-5 border border-[#E6F0FA]">
                <ATSScoreRing result={scoreResult} />
              </div>
              <SuggestionBlock
                suggestions={filtered}
                filterSeverity={filterSeverity}
                onFilter={setFilterSeverity}
                errorCount={errorCount}
                warnCount={warnCount}
                tipCount={tipCount}
              />
            </>
          ) : (
            <EmptyCard message="CV bilgilerini doldurmaya başladığınızda skor otomatik hesaplanır." />
          )}
        </div>
      )}

      {/* ── DERİN ANALİZ ── */}
      {activeTab === "analysis" && (
        <div className="space-y-4">
          {overallFeedback && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-sm text-blue-700 leading-relaxed">
                {overallFeedback}
              </p>
            </div>
          )}
          {analysisError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-sm text-red-600">{analysisError}</p>
            </div>
          )}
          {analysisSuggestions.length > 0 ? (
            <SuggestionBlock
              suggestions={filtered}
              filterSeverity={filterSeverity}
              onFilter={setFilterSeverity}
              errorCount={errorCount}
              warnCount={warnCount}
              tipCount={tipCount}
            />
          ) : (
            !isAnalyzing && (
              <EmptyCard message="Groq AI, CV'nin tamamını tarar ve detaylı öneriler sunar." />
            )
          )}
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              <p className="text-sm text-blue-600 font-medium">
                AI analiz ediyor...
              </p>
            </div>
          )}
          <button
            onClick={() => {
              clearAnalysis();
              runAnalysis(cvData);
            }}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-[#0A1930] to-[#0052CC] text-white hover:shadow-lg hover:shadow-[#0052CC]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Search className="w-4 h-4" />
            {isAnalyzing ? "Analiz ediliyor..." : "Derin Analiz Başlat"}
          </button>
        </div>
      )}

      {/* ── İŞ İLANI ── */}
      {activeTab === "job" && (
        <div className="space-y-4">
          {jobMatchResult ? (
            <JobMatchBlock result={jobMatchResult} onClear={clearJobMatch} />
          ) : (
            <>
              <div className="bg-[#F4F7FA] rounded-2xl p-4">
                <p className="text-sm text-[#8A9EBD] font-medium leading-relaxed">
                  İş ilanını yapıştırın; CV'nizdeki eksik anahtar kelimeleri
                  bulalım.
                </p>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="İş ilanı metnini buraya yapıştırın..."
                rows={7}
                className="w-full text-sm border border-[#E6F0FA] rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]/30 bg-white placeholder-[#CBD6E2] text-[#0A1930]"
              />
              {jobMatchError && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-3">
                  <p className="text-sm text-red-600">{jobMatchError}</p>
                </div>
              )}
              <button
                onClick={() => matchJob(cvData)}
                disabled={isMatchingJob || !jobDescription.trim()}
                className="w-full py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isMatchingJob ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Eşleştiriliyor...
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    İlanla Eşleştir
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Boş durum kartı ── */
function EmptyCard({ message }: { message: string }) {
  return (
    <div className="bg-[#F4F7FA] rounded-3xl p-8 text-center border border-[#E6F0FA]">
      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6F0FA] flex items-center justify-center mx-auto mb-3 shadow-sm">
        <Sparkles className="w-5 h-5 text-[#8A9EBD]" />
      </div>
      <p className="text-sm text-[#8A9EBD] font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
}

/* ── Öneri listesi ── */
function SuggestionBlock({
  suggestions,
  filterSeverity,
  onFilter,
  errorCount,
  warnCount,
  tipCount,
}: {
  suggestions: ATSSuggestion[];
  filterSeverity: ATSSeverity | "all";
  onFilter: (v: ATSSeverity | "all") => void;
  errorCount: number;
  warnCount: number;
  tipCount: number;
}) {
  const total = errorCount + warnCount + tipCount;

  if (total === 0) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
        <p className="text-sm font-bold text-green-600">
          ✓ Harika! Önerilecek bir şey bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filtre */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "error", "warning", "tip"] as const).map((sv) => {
          const count =
            sv === "all"
              ? total
              : sv === "error"
                ? errorCount
                : sv === "warning"
                  ? warnCount
                  : tipCount;
          if (sv !== "all" && count === 0) return null;
          return (
            <button
              key={sv}
              onClick={() => onFilter(sv)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === sv
                  ? "bg-[#0A1930] text-white"
                  : "bg-[#F4F7FA] text-[#8A9EBD] hover:text-[#0A1930]"
              }`}
            >
              {sv === "all"
                ? `Tümü (${count})`
                : sv === "error"
                  ? `✗ Hata (${count})`
                  : sv === "warning"
                    ? `⚠ Uyarı (${count})`
                    : `💡 İpucu (${count})`}
            </button>
          );
        })}
      </div>

      {/* Kartlar */}
      <div className="space-y-2">
        {suggestions.map((s) => {
          const { Icon, color, bg, border } = SEVERITY_CONFIG[s.severity];
          return (
            <div
              key={s.id}
              className={`rounded-2xl border p-4 space-y-1 ${bg} ${border}`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${color}`}>
                      {s.title}
                    </span>
                    <span className="text-xs text-[#8A9EBD] bg-white/70 px-2 py-0.5 rounded-full">
                      {SECTION_LABELS[s.section]}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {s.message}
                  </p>
                  <p className="text-xs text-[#8A9EBD] italic">→ {s.fix}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── İş ilanı eşleşme sonucu ── */
function JobMatchBlock({
  result,
  onClear,
}: {
  result: JobMatchResult;
  onClear: () => void;
}) {
  const scoreColor =
    result.matchScore >= 70
      ? "text-emerald-500"
      : result.matchScore >= 40
        ? "text-amber-500"
        : "text-red-500";
  const scoreBg =
    result.matchScore >= 70
      ? "bg-emerald-50 border-emerald-100"
      : result.matchScore >= 40
        ? "bg-amber-50 border-amber-100"
        : "bg-red-50 border-red-100";

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border p-5 flex items-center gap-4 ${scoreBg}`}
      >
        <span className={`text-4xl font-black ${scoreColor}`}>
          %{result.matchScore}
        </span>
        <div>
          <p className="text-sm font-black text-[#0A1930]">İlan Eşleşmesi</p>
          <p className="text-xs text-[#8A9EBD]">
            {result.presentKeywords.length} anahtar kelime eşleşti
          </p>
        </div>
      </div>

      {result.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#0A1930] mb-2">
            Eksik Anahtar Kelimeler
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full text-xs bg-red-50 text-red-600 border border-red-100 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.presentKeywords.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#0A1930] mb-2">
            Eşleşen Kelimeler
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.presentKeywords.slice(0, 10).map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-600 border border-green-100 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#0A1930]">Öneriler</p>
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5"
            >
              <p className="text-xs font-semibold text-blue-700">
                {rec.message}
              </p>
              <p className="text-xs text-[#8A9EBD] italic mt-0.5">
                → {rec.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClear}
        className="w-full py-3 text-sm font-bold text-[#8A9EBD] border border-[#E6F0FA] rounded-2xl hover:bg-[#F4F7FA] transition-colors"
      >
        Yeni İlan Eşleştir
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAIStore } from "@/store/useAIStore";
import { useCVStore } from "@/store/useCVStore";
import { ATSScoreRing } from "./ATSScoreRing";
import type { ATSSeverity, ATSSection, ATSSuggestion, JobMatchResult } from "@/types/ai";

const SECTION_LABELS: Record<ATSSection, string> = {
  personalInfo: "Kişisel Bilgiler",
  experience: "Deneyim",
  education: "Eğitim",
  skills: "Beceriler",
  certificates: "Sertifikalar",
  projects: "Projeler",
  languages: "Diller",
};

const SEVERITY_CONFIG: Record<ATSSeverity, { icon: string; color: string; bg: string; label: string }> = {
  error: { icon: "✗", color: "#ef4444", bg: "#fef2f2", label: "Hata" },
  warning: { icon: "⚠", color: "#f59e0b", bg: "#fffbeb", label: "Uyarı" },
  tip: { icon: "💡", color: "#3b82f6", bg: "#eff6ff", label: "İpucu" },
};

export function ATSRobotPanel() {
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

  const [filterSeverity, setFilterSeverity] = useState<ATSSeverity | "all">("all");

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
    <div className="border-t border-gray-200 bg-white">
      {/* Başlık + sekmeler */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-800 mr-2">🤖 ATS Robotu</span>
        {(["score", "analysis", "job"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "score" ? "Anlık Skor" : tab === "analysis" ? "Derin Analiz" : "İş İlanı"}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* ── SKOR SEKME ── */}
        {activeTab === "score" && (
          <div className="space-y-4">
            {scoreResult ? (
              <>
                <ATSScoreRing result={scoreResult} />
                <SuggestionList
                  suggestions={filtered}
                  filterSeverity={filterSeverity}
                  onFilter={setFilterSeverity}
                  errorCount={errorCount}
                  warnCount={warnCount}
                  tipCount={tipCount}
                />
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                CV bilgilerini doldurmaya başladığınızda skor hesaplanır.
              </p>
            )}
          </div>
        )}

        {/* ── ANALİZ SEKME ── */}
        {activeTab === "analysis" && (
          <div className="space-y-3">
            {overallFeedback && (
              <p className="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded p-2">
                {overallFeedback}
              </p>
            )}
            {analysisError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded p-2">
                {analysisError}
              </p>
            )}
            {analysisSuggestions.length > 0 ? (
              <SuggestionList
                suggestions={filtered}
                filterSeverity={filterSeverity}
                onFilter={setFilterSeverity}
                errorCount={errorCount}
                warnCount={warnCount}
                tipCount={tipCount}
              />
            ) : (
              !isAnalyzing && (
                <p className="text-xs text-gray-400 text-center py-2">
                  Claude, CV'nin tamamını analiz eder ve detaylı öneriler sunar.
                </p>
              )
            )}
            <button
              onClick={() => { clearAnalysis(); runAnalysis(cvData); }}
              disabled={isAnalyzing}
              className="w-full py-2 px-3 rounded text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">⟳</span> Analiz ediliyor...
                </>
              ) : (
                "🔍 Derin Analiz Başlat"
              )}
            </button>
          </div>
        )}

        {/* ── İŞ İLANI SEKME ── */}
        {activeTab === "job" && (
          <div className="space-y-3">
            {jobMatchResult ? (
              <JobMatchView
                result={jobMatchResult}
                onClear={clearJobMatch}
              />
            ) : (
              <>
                <p className="text-xs text-gray-500">
                  İş ilanını yapıştırın; CV'nizdeki eksik anahtar kelimeleri bulalım.
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="İş ilanı metnini buraya yapıştırın..."
                  rows={6}
                  className="w-full text-xs border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                {jobMatchError && (
                  <p className="text-xs text-red-500">{jobMatchError}</p>
                )}
                <button
                  onClick={() => matchJob(cvData)}
                  disabled={isMatchingJob || !jobDescription.trim()}
                  className="w-full py-2 px-3 rounded text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isMatchingJob ? (
                    <>
                      <span className="animate-spin">⟳</span> Eşleştiriliyor...
                    </>
                  ) : (
                    "🎯 İlanla Eşleştir"
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Öneri Listesi ── */
function SuggestionList({
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
  if (errorCount + warnCount + tipCount === 0) {
    return (
      <p className="text-xs text-green-600 text-center py-2">
        ✓ Harika! Önerilecek bir şey bulunamadı.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Filtre chipları */}
      <div className="flex gap-1.5 flex-wrap">
        {(["all", "error", "warning", "tip"] as const).map((sv) => {
          const count =
            sv === "all"
              ? errorCount + warnCount + tipCount
              : sv === "error"
                ? errorCount
                : sv === "warning"
                  ? warnCount
                  : tipCount;
          if (sv !== "all" && count === 0) return null;
          const cfg = sv !== "all" ? SEVERITY_CONFIG[sv] : null;
          return (
            <button
              key={sv}
              onClick={() => onFilter(sv)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                filterSeverity === sv
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {sv === "all" ? `Tümü (${count})` : `${cfg!.icon} ${count}`}
            </button>
          );
        })}
      </div>

      {/* Kart listesi */}
      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {suggestions.map((s) => {
          const cfg = SEVERITY_CONFIG[s.severity];
          return (
            <div
              key={s.id}
              className="rounded border text-xs p-2.5 space-y-1"
              style={{ borderColor: `${cfg.color}40`, backgroundColor: cfg.bg }}
            >
              <div className="flex items-start gap-1.5">
                <span style={{ color: cfg.color }} className="shrink-0 mt-0.5">{cfg.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold" style={{ color: cfg.color }}>{s.title}</span>
                    <span className="text-gray-400 text-[10px]">
                      {SECTION_LABELS[s.section]}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-0.5">{s.message}</p>
                  <p className="text-gray-500 italic mt-0.5">→ {s.fix}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── İş İlanı Sonuç Görünümü ── */
function JobMatchView({
  result,
  onClear,
}: {
  result: JobMatchResult;
  onClear: () => void;
}) {
  const scoreColor =
    result.matchScore >= 70
      ? "#10b981"
      : result.matchScore >= 40
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="space-y-3">
      {/* Match skoru */}
      <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${scoreColor}40`, backgroundColor: `${scoreColor}10` }}>
        <span className="text-2xl font-bold" style={{ color: scoreColor }}>
          %{result.matchScore}
        </span>
        <div>
          <p className="text-xs font-semibold text-gray-700">İlan Eşleşmesi</p>
          <p className="text-xs text-gray-500">
            {result.presentKeywords.length} anahtar kelime eşleşti
          </p>
        </div>
      </div>

      {/* Eksik kelimeler */}
      {result.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-600 mb-1.5">Eksik Anahtar Kelimeler</p>
          <div className="flex flex-wrap gap-1">
            {result.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mevcut kelimeler */}
      {result.presentKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-green-600 mb-1.5">Eşleşen Kelimeler</p>
          <div className="flex flex-wrap gap-1">
            {result.presentKeywords.slice(0, 10).map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-600 border border-green-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Öneriler */}
      {result.recommendations.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-700">Öneriler</p>
          {result.recommendations.map((rec, i) => (
            <div key={i} className="text-xs bg-blue-50 border border-blue-100 rounded p-2">
              <p className="font-medium text-blue-700">{rec.message}</p>
              <p className="text-gray-600 italic mt-0.5">→ {rec.suggestion}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClear}
        className="w-full py-1.5 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50"
      >
        Yeni İlan Eşleştir
      </button>
    </div>
  );
}

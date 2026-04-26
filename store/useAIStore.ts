"use client";

import { create } from "zustand";
import type { CVData } from "@/types/cv";
import type {
  ATSScoreResult,
  ATSSuggestion,
  JobMatchResult,
  FieldType,
} from "@/types/ai";
import { calculateATSScore } from "@/lib/ats-scoring";

interface AIState {
  // Real-time skor
  scoreResult: ATSScoreResult | null;

  // Claude derin analizi
  isAnalyzing: boolean;
  analysisSuggestions: ATSSuggestion[];
  overallFeedback: string;
  analysisError: string | null;

  // Alan geliştirme (streaming)
  enhancingFieldId: string | null;
  enhancedContent: Record<string, string>;  // fieldId → yeni metin
  originalContent: Record<string, string>;  // fieldId → orijinal metin
  enhanceError: string | null;

  // İş ilanı eşleştirme
  jobDescription: string;
  isMatchingJob: boolean;
  jobMatchResult: JobMatchResult | null;
  jobMatchError: string | null;

  // Panel durumu
  isPanelOpen: boolean;
  activeTab: "score" | "analysis" | "job";
}

interface AIActions {
  calculateScore: (cvData: CVData) => void;

  runAnalysis: (cvData: CVData) => Promise<void>;
  clearAnalysis: () => void;

  enhanceField: (
    fieldId: string,
    content: string,
    jobTitle: string,
    fieldType: FieldType,
    onChunk: (chunk: string) => void,
  ) => Promise<void>;
  acceptEnhancement: (fieldId: string) => string | null;
  rejectEnhancement: (fieldId: string) => string | null;
  clearEnhancement: (fieldId: string) => void;

  setJobDescription: (text: string) => void;
  matchJob: (cvData: CVData) => Promise<void>;
  clearJobMatch: () => void;

  setPanelOpen: (open: boolean) => void;
  setActiveTab: (tab: AIState["activeTab"]) => void;
}

const initialState: AIState = {
  scoreResult: null,
  isAnalyzing: false,
  analysisSuggestions: [],
  overallFeedback: "",
  analysisError: null,
  enhancingFieldId: null,
  enhancedContent: {},
  originalContent: {},
  enhanceError: null,
  jobDescription: "",
  isMatchingJob: false,
  jobMatchResult: null,
  jobMatchError: null,
  isPanelOpen: true,
  activeTab: "score",
};

export const useAIStore = create<AIState & AIActions>((set, get) => ({
  ...initialState,

  calculateScore: (cvData) => {
    const result = calculateATSScore(cvData);
    set({ scoreResult: result });
  },

  runAnalysis: async (cvData) => {
    set({ isAnalyzing: true, analysisError: null, analysisSuggestions: [], overallFeedback: "" });
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData }),
      });
      if (!res.ok) throw new Error("Analiz başarısız.");
      const data = await res.json();
      set({
        analysisSuggestions: data.suggestions ?? [],
        overallFeedback: data.overallFeedback ?? "",
        isAnalyzing: false,
      });
    } catch (e) {
      set({
        analysisError: e instanceof Error ? e.message : "Bir hata oluştu.",
        isAnalyzing: false,
      });
    }
  },

  clearAnalysis: () => {
    set({ analysisSuggestions: [], overallFeedback: "", analysisError: null });
  },

  enhanceField: async (fieldId, content, jobTitle, fieldType, onChunk) => {
    set((s) => ({
      enhancingFieldId: fieldId,
      enhanceError: null,
      originalContent: { ...s.originalContent, [fieldId]: content },
      enhancedContent: { ...s.enhancedContent, [fieldId]: "" },
    }));

    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldType, currentContent: content, jobTitle }),
      });

      if (!res.ok) throw new Error("Geliştirme başarısız.");
      if (!res.body) throw new Error("Stream alınamadı.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        onChunk(chunk);
        set((s) => ({
          enhancedContent: { ...s.enhancedContent, [fieldId]: accumulated },
        }));
      }
    } catch (e) {
      set({
        enhanceError: e instanceof Error ? e.message : "Bir hata oluştu.",
      });
    } finally {
      set({ enhancingFieldId: null });
    }
  },

  acceptEnhancement: (fieldId) => {
    const enhanced = get().enhancedContent[fieldId] ?? null;
    set((s) => {
      const ec = { ...s.enhancedContent };
      const oc = { ...s.originalContent };
      delete ec[fieldId];
      delete oc[fieldId];
      return { enhancedContent: ec, originalContent: oc };
    });
    return enhanced;
  },

  rejectEnhancement: (fieldId) => {
    const original = get().originalContent[fieldId] ?? null;
    set((s) => {
      const ec = { ...s.enhancedContent };
      const oc = { ...s.originalContent };
      delete ec[fieldId];
      delete oc[fieldId];
      return { enhancedContent: ec, originalContent: oc };
    });
    return original;
  },

  clearEnhancement: (fieldId) => {
    set((s) => {
      const ec = { ...s.enhancedContent };
      const oc = { ...s.originalContent };
      delete ec[fieldId];
      delete oc[fieldId];
      return { enhancedContent: ec, originalContent: oc };
    });
  },

  setJobDescription: (text) => set({ jobDescription: text }),

  matchJob: async (cvData) => {
    const { jobDescription } = get();
    if (!jobDescription.trim()) return;
    set({ isMatchingJob: true, jobMatchError: null, jobMatchResult: null });
    try {
      const res = await fetch("/api/ai/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, jobDescription }),
      });
      if (!res.ok) throw new Error("Eşleştirme başarısız.");
      const data = await res.json();
      set({ jobMatchResult: data, isMatchingJob: false });
    } catch (e) {
      set({
        jobMatchError: e instanceof Error ? e.message : "Bir hata oluştu.",
        isMatchingJob: false,
      });
    }
  },

  clearJobMatch: () => {
    set({ jobMatchResult: null, jobMatchError: null, jobDescription: "" });
  },

  setPanelOpen: (open) => set({ isPanelOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

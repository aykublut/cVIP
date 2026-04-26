"use client";

import { useState } from "react";
import { useAIStore } from "@/store/useAIStore";
import type { FieldType } from "@/types/ai";

interface FieldEnhancerProps {
  fieldId: string;
  fieldType: FieldType;
  currentContent: string;
  jobTitle: string;
  onAccept: (newContent: string) => void;
  onReject?: () => void;
}

export function FieldEnhancer({
  fieldId,
  fieldType,
  currentContent,
  jobTitle,
  onAccept,
  onReject,
}: FieldEnhancerProps) {
  const { enhancingFieldId, enhancedContent, originalContent, enhanceError, enhanceField, acceptEnhancement, rejectEnhancement } =
    useAIStore();

  const isThisEnhancing = enhancingFieldId === fieldId;
  const hasEnhanced = fieldId in enhancedContent;
  const enhanced = enhancedContent[fieldId] ?? "";
  const original = originalContent[fieldId] ?? "";

  const [streamedText, setStreamedText] = useState("");

  const handleEnhance = async () => {
    if (!currentContent.trim()) return;
    setStreamedText("");
    await enhanceField(fieldId, currentContent, jobTitle, fieldType, (chunk) => {
      setStreamedText((prev) => prev + chunk);
    });
  };

  const handleAccept = () => {
    const accepted = acceptEnhancement(fieldId);
    if (accepted) {
      onAccept(accepted);
      setStreamedText("");
    }
  };

  const handleReject = () => {
    rejectEnhancement(fieldId);
    setStreamedText("");
    onReject?.();
  };

  if (hasEnhanced || isThisEnhancing) {
    return (
      <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 overflow-hidden text-xs">
        <div className="px-3 py-2 bg-blue-100 border-b border-blue-200 flex items-center justify-between">
          <span className="font-semibold text-blue-700 flex items-center gap-1.5">
            ✨ AI Önerisi
            {isThisEnhancing && (
              <span className="animate-pulse text-blue-500">Yazıyor...</span>
            )}
          </span>
          {!isThisEnhancing && (
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="px-2.5 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors"
              >
                Kabul Et
              </button>
              <button
                onClick={handleReject}
                className="px-2.5 py-1 bg-white text-gray-600 border border-gray-200 rounded font-semibold hover:bg-gray-50 transition-colors"
              >
                Reddet
              </button>
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          {original && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Orijinal</p>
              <p className="text-gray-400 line-through leading-relaxed">{original}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Geliştirilmiş</p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {enhanced || streamedText}
              {isThisEnhancing && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>

        {enhanceError && (
          <p className="px-3 pb-2 text-red-500">{enhanceError}</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleEnhance}
      disabled={!currentContent.trim()}
      title={!currentContent.trim() ? "Önce bir metin girin" : "AI ile geliştir"}
      className="mt-1.5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      ✨ AI ile Geliştir
    </button>
  );
}

"use client";

import { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import {
  Trash2,
  Zap,
  CornerDownLeft,
  AlertCircle,
  Info,
  Sparkles,
  Check,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { skillSchema } from "@/lib/schemas";
import { getAcronymExpansion } from "@/lib/cv-helpers";

const SKILL_MAX = 15;
const SKILL_HARD_MAX = 20;

export default function StepSkills() {
  const { cvData, updateSkills } = useCVStore();
  const { skills } = cvData;
  const [skillInput, setSkillInput] = useState("");
  const [inlineError, setInlineError] = useState<string>("");
  const [pendingSuggestion, setPendingSuggestion] = useState<{
    raw: string;
    expansion: string;
  } | null>(null);

  const tryAddSkill = (raw: string) => {
    const trimmed = raw.trim();
    setInlineError("");
    if (!trimmed) return;

    // Zod ile validate
    const result = skillSchema.safeParse(trimmed);
    if (!result.success) {
      setInlineError(result.error.issues[0].message);
      return;
    }

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setInlineError("Bu beceri zaten listenizde var.");
      return;
    }

    if (skills.length >= SKILL_HARD_MAX) {
      setInlineError(`Maksimum ${SKILL_HARD_MAX} beceri eklenebilir.`);
      return;
    }

    const expansion = getAcronymExpansion(trimmed);
    if (expansion && expansion.toLowerCase() !== trimmed.toLowerCase()) {
      setPendingSuggestion({ raw: trimmed, expansion });
      return;
    }

    commitSkill(trimmed);
  };

  const commitSkill = (value: string) => {
    updateSkills([...skills, value]);
    setSkillInput("");
    setPendingSuggestion(null);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryAddSkill(skillInput);
    }
  };

  const removeSkill = (skill: string) =>
    updateSkills(skills.filter((s) => s !== skill));

  const ideallyFull = skills.length >= SKILL_MAX;
  const hardFull = skills.length >= SKILL_HARD_MAX;

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
          Beceriler
        </h2>
        <p className="text-[#8A9EBD] text-sm font-medium">
          İş ilanındaki anahtar kelimeleri birebir yansıtın. ATS eşleştirmesinin
          en doğrudan puanlandığı alan.
        </p>
      </div>

      <div className="mb-3">
        <Label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-3 pl-1">
          <Zap className="w-3 h-3 text-[#0052CC]" /> Beceri Ekle
        </Label>
        <div className="relative">
          <Input
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              if (inlineError) setInlineError("");
            }}
            onKeyDown={handleKey}
            disabled={hardFull}
            maxLength={50}
            placeholder={
              hardFull
                ? `Maksimum ${SKILL_HARD_MAX} beceriye ulaştınız`
                : "Örn: React, Stratejik Planlama (Enter'a basın)"
            }
            className="h-14 text-lg font-bold pr-14 rounded-3xl"
            aria-invalid={!!inlineError}
          />
          <CornerDownLeft className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#CBD6E2] pointer-events-none" />
        </div>
        {inlineError && (
          <p className="mt-2 pl-1 text-[9px] text-red-400 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {inlineError}
          </p>
        )}
      </div>

      {/* Kısaltma genişletme önerisi */}
      {pendingSuggestion && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 flex flex-col sm:flex-row sm:items-center gap-3">
          <Sparkles className="h-4 w-4 text-[#0052CC] shrink-0" />
          <AlertDescription className="flex-1 text-[10px] text-[#0A1930]/80 font-medium leading-relaxed">
            <strong className="text-[11px] text-[#0A1930] tracking-wide block mb-1">
              ATS ÖNERİSİ: KISALTMAYI AÇIKLAYIN
            </strong>
            ATS bazen sadece &quot;{pendingSuggestion.raw.toUpperCase()}&quot;
            arar, bazen açık karşılığını. İkisini de kapsayan versiyonu eklemek
            eşleşme ihtimalini artırır.
          </AlertDescription>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              onClick={() => commitSkill(pendingSuggestion.expansion)}
              className="bg-[#0052CC] hover:bg-[#003a8c] text-[9px] font-black uppercase tracking-widest h-auto px-3 py-2"
            >
              <Check className="w-3 h-3 mr-1" />
              {pendingSuggestion.expansion}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => commitSkill(pendingSuggestion.raw)}
              className="text-[9px] font-black uppercase tracking-widest"
            >
              Orijinali kullan
            </Button>
          </div>
        </Alert>
      )}

      <div className="flex items-center justify-between pl-1 mb-8">
        <p className="text-[9px] text-[#8A9EBD] font-medium flex items-center gap-1">
          <Info className="w-3 h-3 shrink-0" />
          İdeal: 10–15 beceri. İş ilanındaki anahtar kelimeleri birebir
          kullanın.
        </p>
        <span
          className={`text-[9px] font-bold tabular-nums ${
            hardFull
              ? "text-red-400"
              : ideallyFull
                ? "text-amber-500"
                : skills.length >= 5
                  ? "text-emerald-500"
                  : "text-[#CBD6E2]"
          }`}
        >
          {skills.length}/{SKILL_MAX}
          {skills.length > SKILL_MAX && (
            <span className="text-[#CBD6E2]"> (max {SKILL_HARD_MAX})</span>
          )}
        </span>
      </div>

      {ideallyFull && !hardFull && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-[10px] text-amber-800 font-medium">
            İdeal beceri sayısını geçtiniz. Daha fazla beceri ATS&apos;de
            keyword stuffing algılanabilir — en kritik {SKILL_MAX} tanesini
            bırakmayı düşünün.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        {skills.length === 0 ? (
          <div className="w-full py-12 bg-[#F4F7FA] rounded-[2.5rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
            <p className="text-[#8A9EBD] font-medium text-sm text-center">
              Uzmanlıklarınızı ekleyerek profilinizi tamamlayın.
              <br />
              <span className="text-[10px]">
                Teknik beceriler + yumuşak beceriler birlikte önerilir.
              </span>
            </p>
          </div>
        ) : (
          skills.map((skill, index) => (
            <Badge
              key={`${skill}-${index}`}
              variant="default"
              className="group flex items-center gap-3 bg-gradient-to-r from-[#0A1930] to-[#0052CC] text-white pl-5 pr-2 py-2.5 rounded-2xl font-bold text-sm shadow-[0_4px_15px_rgba(0,82,204,0.15)] hover:shadow-[0_8px_25px_rgba(0,82,204,0.25)] hover:-translate-y-1 transition-all duration-300 border-0"
            >
              <span className="tracking-wide">{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="bg-white/10 hover:bg-red-500 text-white p-1.5 rounded-xl transition-colors"
                aria-label={`${skill} becerisini kaldır`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

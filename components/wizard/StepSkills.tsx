"use client";

import { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { Trash2, Zap, CornerDownLeft } from "lucide-react";

const SKILL_MAX = 20;

export default function StepSkills() {
  const { cvData, updateSkills } = useCVStore();
  const { skills } = cvData;
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (!skills.includes(trimmed) && skills.length < SKILL_MAX) {
        updateSkills([...skills, trimmed]);
      }
      setSkillInput("");
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
          Kritik Yetkinlikler
        </h2>
        <p className="text-[#8A9EBD] text-sm font-medium">
          Sizi benzersiz kılan teknik ve sosyal becerilerinizi ekleyin.
        </p>
      </div>

      {/* Input */}
      <div className="group relative mb-3">
        <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-3 pl-1">
          <Zap className="w-3 h-3 text-[#0052CC]" /> YETENEK HAVUZU
        </label>
        <div className="relative">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            disabled={skills.length >= SKILL_MAX}
            placeholder={
              skills.length >= SKILL_MAX
                ? `Maksimum ${SKILL_MAX} yetenek eklendi`
                : "Örn: React, Stratejik Planlama (Yazıp Enter'a basın)"
            }
            className="w-full bg-[#F4F7FA] border border-transparent rounded-3xl px-6 py-5 pr-14 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-bold text-[#0A1930] text-lg placeholder:text-[#8A9EBD]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#CBD6E2] pointer-events-none">
            <CornerDownLeft className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sayaç + ATS ipucu */}
      <div className="flex items-center justify-between pl-1 mb-8">
        <p className="text-[9px] text-[#CBD6E2] font-medium">
          İpucu: İş ilanındaki anahtar kelimeleri birebir kullanın — ATS eşleşme
          skoru yükselir.
        </p>
        <span
          className={`text-[9px] font-bold tabular-nums transition-colors ${
            skills.length >= SKILL_MAX ? "text-red-400" : "text-[#CBD6E2]"
          }`}
        >
          {skills.length}/{SKILL_MAX}
        </span>
      </div>

      {/* Badge Listesi */}
      <div className="flex flex-wrap gap-3">
        {skills.length === 0 ? (
          <div className="w-full py-12 bg-[#F4F7FA] rounded-[2.5rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4">
            <p className="text-[#8A9EBD] font-medium text-sm">
              Uzmanlıklarınızı ekleyerek profilinizi tamamlayın.
            </p>
          </div>
        ) : (
          skills.map((skill, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 bg-gradient-to-r from-[#0A1930] to-[#0052CC] text-white pl-5 pr-2 py-2.5 rounded-2xl font-bold text-sm shadow-[0_4px_15px_rgba(0,82,204,0.15)] hover:shadow-[0_8px_25px_rgba(0,82,204,0.25)] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="tracking-wide">{skill}</span>
              <button
                onClick={() => updateSkills(skills.filter((s) => s !== skill))}
                className="bg-white/10 hover:bg-red-500 text-white p-1.5 rounded-xl transition-colors"
                aria-label={`${skill} yeteneğini kaldır`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

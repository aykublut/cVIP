"use client";

import { useCVStore } from "@/store/useCVStore";
import { Plus, Trash2, Briefcase, ChevronRight } from "lucide-react";

const DESCRIPTION_MAX = 600;

export default function StepExperience() {
  const { cvData, addExperience, updateExperience, removeExperience } =
    useCVStore();
  const { experiences } = cvData;

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
            Kariyer Yolculuğu
          </h2>
          <p className="text-[#8A9EBD] text-sm font-medium">
            Sizi bugüne getiren profesyonel duraklarınızı detaylandırın.
          </p>
        </div>
        <button
          onClick={addExperience}
          className="group flex items-center justify-center gap-2 bg-[#F4F7FA] text-[#0052CC] px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0052CC] hover:text-white transition-all duration-300 shadow-sm shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />{" "}
          YENİ POZİSYON
        </button>
      </div>

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-16 bg-[#F4F7FA] rounded-[2rem] border border-dashed border-[#CBD6E2] flex flex-col items-center justify-center gap-4 transition-all hover:border-[#0052CC]/30">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-[#0052CC]/40" />
            </div>
            <p className="text-[#8A9EBD] font-medium text-sm">
              İlk liderlik veya iş deneyiminizi
              <br />
              ekleyerek CV'nizi güçlendirin.
            </p>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E6F0FA] relative group transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,82,204,0.06)] hover:border-[#0052CC]/30"
            >
              {/* VIP Vurgu Çizgisi */}
              <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-[#0052CC] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Numaralandırma */}
              <div className="absolute -left-3 -top-3 w-10 h-10 bg-gradient-to-br from-[#0A1930] to-[#0052CC] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-[0_4px_15px_rgba(0,82,204,0.3)] transform transition-transform group-hover:scale-110">
                {index + 1}
              </div>

              {/* Silme Butonu */}
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute right-6 top-6 w-9 h-9 bg-white text-[#8A9EBD] border border-[#E6F0FA] rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                title="Bu deneyimi sil"
                aria-label="Bu deneyimi sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 mb-5 mt-2">
                {/* Pozisyon */}
                <div className="group/input relative">
                  <label className="flex items-center gap-2 text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
                    POZİSYON / UNVAN
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(exp.id, { position: e.target.value })
                    }
                    className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-bold text-[#0A1930] placeholder:text-[#8A9EBD]/60"
                    placeholder="Örn: Senior Software Engineer"
                    maxLength={80}
                  />
                </div>

                {/* Şirket */}
                <div className="group/input relative">
                  <label className="flex items-center gap-2 text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
                    KURUM / ŞİRKET
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, { company: e.target.value })
                    }
                    className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-bold text-[#0A1930] placeholder:text-[#8A9EBD]/60"
                    placeholder="Örn: Google Inc."
                    maxLength={80}
                  />
                </div>

                {/* Tarihler */}
                <div className="flex gap-3 md:col-span-2">
                  <div className="w-1/2 group/input relative">
                    <label className="flex items-center gap-2 text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
                      BAŞLANGIÇ
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { startDate: e.target.value })
                      }
                      className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60"
                      placeholder="Örn: 2020"
                    />
                  </div>

                  <div className="flex items-center justify-center pt-6">
                    <ChevronRight className="w-4 h-4 text-[#CBD6E2]" />
                  </div>

                  <div className="w-1/2 group/input relative">
                    <label className="flex items-center gap-2 text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
                      BİTİŞ
                    </label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { endDate: e.target.value })
                      }
                      className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60"
                      placeholder="Günümüz"
                    />
                  </div>
                </div>
              </div>

              {/* Açıklama + karakter sayacı */}
              <div className="group/input relative">
                <div className="flex items-center justify-between mb-2 pl-1">
                  <label className="flex items-center gap-2 text-[9px] font-black text-[#0A1930] uppercase tracking-[0.2em]">
                    BAŞARILAR & SORUMLULUKLAR
                  </label>
                  <span
                    className={`text-[9px] font-bold tabular-nums transition-colors ${
                      exp.description.length > DESCRIPTION_MAX * 0.9
                        ? "text-red-400"
                        : "text-[#CBD6E2]"
                    }`}
                  >
                    {exp.description.length}/{DESCRIPTION_MAX}
                  </span>
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => {
                    if (e.target.value.length <= DESCRIPTION_MAX)
                      updateExperience(exp.id, { description: e.target.value });
                  }}
                  rows={3}
                  className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60 resize-none leading-relaxed custom-scrollbar"
                  placeholder="Bu pozisyonda şirkete kattığınız en büyük değer neydi? Somut başarıları ve kullandığınız teknolojileri yazın. (Örn: Yeni mimari ile API yanıt süresi %40 azaltıldı.)"
                />
                {/* ATS ipucu */}
                <p className="mt-1.5 pl-1 text-[9px] text-[#CBD6E2] font-medium">
                  İpucu: Rakamlarla desteklenmiş başarılar ATS sıralamanda +%30
                  avantaj sağlar.
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

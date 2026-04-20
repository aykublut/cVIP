"use client";

import { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import EditableText from "@/components/ui/EditableText";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "../ui/ImageUploader";

export default function MinimalistTheme() {
  const {
    cvData,
    isEditMode,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
  } = useCVStore();

  const { personalInfo, experiences, educations, skills } = cvData;
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim()))
        updateSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  return (
    <div className="w-full h-full min-h-[297mm] bg-white text-slate-900 p-[15mm] sm:p-[20mm] flex flex-col font-serif">
      {/* BAŞLIK (Merkeze Hizalı, Klasik Tipografi) */}
      <header className="flex flex-col items-center text-center mb-10">
        {/* YENİ: PROFiL FOTOĞRAFI */}
        <ImageUploader className="w-28 h-28 mb-6 shadow-sm border-slate-200" />
        <EditableText
          value={personalInfo.fullName}
          onChange={(v) => updatePersonalInfo({ fullName: v })}
          placeholder="AD SOYAD"
          className="text-4xl sm:text-5xl font-light tracking-widest uppercase mb-3 text-slate-900 w-full text-center"
        />
        <EditableText
          value={personalInfo.jobTitle}
          onChange={(v) => updatePersonalInfo({ jobTitle: v })}
          placeholder="Meslek / Unvan"
          className="text-lg font-medium tracking-widest text-slate-500 uppercase mb-4 w-full text-center"
        />

        {/* İletişim Bilgileri (Satır İçi Noktalı Ayrım) */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-sm text-slate-600 font-sans">
          <EditableText
            value={personalInfo.email}
            onChange={(v) => updatePersonalInfo({ email: v })}
            placeholder="E-posta"
            className="w-auto text-center"
          />
          <span className="text-slate-300">•</span>
          <EditableText
            value={personalInfo.phone}
            onChange={(v) => updatePersonalInfo({ phone: v })}
            placeholder="Telefon"
            className="w-auto text-center"
          />
          <span className="text-slate-300">•</span>
          <EditableText
            value={personalInfo.location}
            onChange={(v) => updatePersonalInfo({ location: v })}
            placeholder="Lokasyon"
            className="w-auto text-center"
          />
          <span className="text-slate-300">•</span>
          <EditableText
            value={personalInfo.linkedin}
            onChange={(v) => updatePersonalInfo({ linkedin: v })}
            placeholder="LinkedIn"
            className="w-auto text-center"
          />
          <span className="text-slate-300">•</span>
          <EditableText
            value={personalInfo.github}
            onChange={(v) => updatePersonalInfo({ github: v })}
            placeholder="GitHub"
            className="w-auto text-center"
          />
        </div>
      </header>

      {/* ÖZET */}
      <section className="mb-8">
        <div className="border-b border-slate-300 pb-1 mb-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-900">
            Özet
          </h3>
        </div>
        <EditableText
          value={personalInfo.summary}
          onChange={(v) => updatePersonalInfo({ summary: v })}
          placeholder="Kariyer hedeflerinizi anlatan kısa ve profesyonel bir metin girin..."
          className="text-sm text-slate-700 leading-relaxed text-justify font-sans block w-full"
          isMultiline={true}
        />
      </section>

      {/* DENEYİM */}
      <section className="mb-8">
        <div className="flex justify-between items-end border-b border-slate-300 pb-1 mb-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-900">
            İş Deneyimi
          </h3>
          {isEditMode && (
            <button
              onClick={addExperience}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 print:hidden font-sans font-medium"
            >
              <Plus className="w-3 h-3" /> Yeni Ekle
            </button>
          )}
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group font-sans">
              {isEditMode && (
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute -left-6 top-1 text-red-400 hover:text-red-600 print:hidden"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex justify-between items-baseline mb-1">
                <div className="flex items-baseline gap-2 w-2/3">
                  <EditableText
                    value={exp.position}
                    onChange={(v) => updateExperience(exp.id, { position: v })}
                    placeholder="Pozisyon"
                    className="font-bold text-slate-900 text-base"
                  />
                  <span className="text-slate-400">|</span>
                  <EditableText
                    value={exp.company}
                    onChange={(v) => updateExperience(exp.id, { company: v })}
                    placeholder="Şirket"
                    className="font-medium text-slate-700"
                  />
                </div>
                <div className="flex gap-1 text-sm font-medium text-slate-500 w-1/3 justify-end italic">
                  <EditableText
                    value={exp.startDate}
                    onChange={(v) => updateExperience(exp.id, { startDate: v })}
                    placeholder="Başlangıç"
                    className="text-right w-16"
                  />{" "}
                  -{" "}
                  <EditableText
                    value={exp.endDate}
                    onChange={(v) => updateExperience(exp.id, { endDate: v })}
                    placeholder="Bitiş"
                    className="w-16"
                  />
                </div>
              </div>
              <EditableText
                value={exp.description}
                onChange={(v) => updateExperience(exp.id, { description: v })}
                placeholder="Sorumluluklarınızı ve başarılarınızı listeleyin..."
                className="text-sm text-slate-600 leading-relaxed w-full block text-justify mt-2"
                isMultiline={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* EĞİTİM */}
      <section className="mb-8">
        <div className="flex justify-between items-end border-b border-slate-300 pb-1 mb-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-900">
            Eğitim
          </h3>
          {isEditMode && (
            <button
              onClick={addEducation}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 print:hidden font-sans font-medium"
            >
              <Plus className="w-3 h-3" /> Yeni Ekle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="relative group flex justify-between items-baseline font-sans"
            >
              {isEditMode && (
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute -left-6 top-1 text-red-400 hover:text-red-600 print:hidden"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="w-2/3">
                <EditableText
                  value={edu.school}
                  onChange={(v) => updateEducation(edu.id, { school: v })}
                  placeholder="Okul / Üniversite"
                  className="font-bold text-slate-900 block w-full text-base"
                />
                <div className="flex gap-1 text-sm text-slate-600 mt-1">
                  <EditableText
                    value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, { degree: v })}
                    placeholder="Derece"
                    className="w-auto"
                  />
                  <span className="text-slate-400">,</span>
                  <EditableText
                    value={edu.fieldOfStudy}
                    onChange={(v) =>
                      updateEducation(edu.id, { fieldOfStudy: v })
                    }
                    placeholder="Bölüm"
                    className="w-auto"
                  />
                </div>
              </div>
              <div className="flex gap-1 text-sm font-medium text-slate-500 w-1/3 justify-end italic">
                <EditableText
                  value={edu.startDate}
                  onChange={(v) => updateEducation(edu.id, { startDate: v })}
                  placeholder="Baş."
                  className="text-right w-12"
                />{" "}
                -{" "}
                <EditableText
                  value={edu.endDate}
                  onChange={(v) => updateEducation(edu.id, { endDate: v })}
                  placeholder="Bit."
                  className="w-12"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* YETENEKLER */}
      <section>
        <div className="border-b border-slate-300 pb-1 mb-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-900">
            Yetenekler
          </h3>
        </div>
        <div className="font-sans flex flex-wrap gap-x-2 gap-y-2 items-center text-sm text-slate-700 leading-relaxed">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center">
              <span>{skill}</span>
              {isEditMode && (
                <button
                  onClick={() =>
                    updateSkills(skills.filter((s) => s !== skill))
                  }
                  className="ml-1 text-slate-300 hover:text-red-500 print:hidden"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              {index < skills.length - 1 && (
                <span className="ml-2 text-slate-300 font-serif">•</span>
              )}
            </div>
          ))}
          {isEditMode && (
            <div className="flex items-center ml-2 border-l border-slate-200 pl-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="+ Yetenek Ekle"
                className="text-sm bg-slate-50 px-2 py-1 rounded outline-none w-32 print:hidden italic"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

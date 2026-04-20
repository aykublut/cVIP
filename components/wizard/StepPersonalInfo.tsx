"use client";

import { useCVStore } from "@/store/useCVStore";
import ImageUploader from "../ui/ImageUploader";
import { User, Briefcase, Mail, Phone, MapPin, AlignLeft } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

export default function StepPersonalInfo() {
  const { cvData, updatePersonalInfo } = useCVStore();
  const { personalInfo } = cvData;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#0A1930] mb-2 tracking-tight">
          Kişisel Markanız
        </h2>
        <p className="text-[#8A9EBD] text-sm font-medium">
          Vitrinizi tasarlayın. İletişim bilgilerinizi ve sizi özetleyen
          hikayenizi girin.
        </p>
      </div>

      {/* ÜST BÖLÜM: FOTOĞRAF VE ANA BİLGİLER */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
        {/* Lüks Fotoğraf Alanı */}
        <div className="flex flex-col items-center gap-4 shrink-0 mt-1">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-[#E6F0FA] to-[#F4F7FA] shadow-[0_8px_20px_rgba(0,20,50,0.03)] border border-[#E6F0FA] transition-transform hover:scale-105 duration-300">
            <ImageUploader className="w-28 h-28" />
          </div>
          <span className="text-[9px] text-[#8A9EBD] font-black uppercase tracking-[0.2em]">
            PROFESYONEL PORTRE
          </span>
        </div>

        {/* Ad & Unvan Alanı */}
        <div className="flex-1 space-y-5 w-full">
          <div className="group relative">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
              <User className="w-3 h-3 text-[#0052CC]" /> İSİM SOYİSİM
            </label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-bold text-[#0A1930] placeholder:text-[#8A9EBD]/60"
              placeholder="Örn: John Doe"
            />
          </div>

          <div className="group relative">
            <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
              <Briefcase className="w-3 h-3 text-[#0052CC]" /> HEDEF POZİSYON
            </label>
            <input
              type="text"
              value={personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
              className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-bold text-[#0A1930] placeholder:text-[#8A9EBD]/60"
              placeholder="Örn: Chief Executive Officer"
            />
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E6F0FA] to-transparent mb-8" />

      {/* ALT BÖLÜM: İLETİŞİM BİLGİLERİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="group relative">
          <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
            <Mail className="w-3 h-3 text-[#0052CC]" /> E-POSTA ADRESİ
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60"
            placeholder="hello@domain.com"
          />
        </div>
        <div className="group relative">
          <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
            <Phone className="w-3 h-3 text-[#0052CC]" /> TELEFON
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60"
            placeholder="+90 555 123 4567"
          />
        </div>
        <div className="group relative">
          <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
            <MapPin className="w-3 h-3 text-[#0052CC]" /> LOKASYON
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60"
            placeholder="Şehir, Ülke"
          />
        </div>
        <div className="group relative">
          <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
            {/* React Icons'dan çekilen LinkedIn ikonu */}
            <FaLinkedin className="w-3 h-3 text-[#0052CC]" /> LİNKEDİN
          </label>
          <input
            type="text"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60"
            placeholder="linkedin.com/in/username"
          />
        </div>
      </div>

      {/* YÖNETİCİ ÖZETİ */}
      <div className="group relative">
        <label className="flex items-center gap-2 text-[10px] font-black text-[#0A1930] uppercase tracking-[0.2em] mb-2 pl-1">
          <AlignLeft className="w-3 h-3 text-[#0052CC]" /> YÖNETİCİ ÖZETİ
          (EXECUTIVE SUMMARY)
        </label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          rows={5}
          className="w-full bg-[#F4F7FA] border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#0052CC]/30 focus:shadow-[0_0_0_4px_rgba(0,82,204,0.08)] transition-all duration-300 font-medium text-[#0A1930] placeholder:text-[#8A9EBD]/60 resize-none leading-relaxed custom-scrollbar"
          placeholder="Yılların getirdiği tecrübenizi, vizyonunuzu ve şirkete katacağınız değeri anlatan, kısa ve vurucu bir profesyonel hikaye yazın..."
        />
      </div>
    </div>
  );
}

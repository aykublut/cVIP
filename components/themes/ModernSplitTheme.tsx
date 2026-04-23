"use client";

import { useCVStore } from "@/store/useCVStore";
import { Briefcase, GraduationCap, Award, ChevronRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { LuPhone, LuMapPin } from "react-icons/lu";

const FONT_STACK =
  "'DM Sans', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

function toDatetime(dateStr: string): string {
  if (!dateStr) return "";
  const months: Record<string, string> = {
    ocak: "01",
    şubat: "02",
    mart: "03",
    nisan: "04",
    mayıs: "05",
    haziran: "06",
    temmuz: "07",
    ağustos: "08",
    eylul: "09",
    eylül: "09",
    ekim: "10",
    kasım: "11",
    aralık: "12",
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };
  const lower = dateStr.toLowerCase().trim();
  if (["günümüz", "present", "halen", "devam ediyor"].includes(lower))
    return "";
  const year = lower.match(/\d{4}/)?.[0];
  if (!year) return "";
  for (const [name, num] of Object.entries(months)) {
    if (lower.includes(name)) return `${year}-${num}`;
  }
  return year;
}

export default function ModernSplitTheme() {
  const { cvData } = useCVStore();
  const { personalInfo, experiences, educations, skills } = cvData;

  return (
    <main
      /* OPTİMİZASYON: "antialiased" eklendi. Yazıların PDF'te soft ve pürüzsüz çıkmasını sağlar */
      className="w-full h-full min-h-[297mm] flex bg-white text-slate-800 relative z-0 overflow-hidden antialiased"
      role="main"
      aria-label="Curriculum Vitae"
      data-ats-document="resume"
      style={{
        fontFamily: FONT_STACK,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        
        /* TIPOGRAFİ OPTİMİZASYONU: PDF motorunu zorlayıp harfleri kusursuz dizer */
        html, body, main {
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
        }

        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
        
        @media print {
          [data-decor="true"]{display:none !important}
          *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
        }
        
        .break-text {
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        .preserve-lines {
          white-space: pre-line;
        }
      `}</style>

      {/* ══ SOL KOLON ══ */}
      <div
        className="w-[38%] text-slate-300 flex flex-col relative shrink-0"
        style={{
          backgroundColor: "#0f172a",
          padding: "14mm 11mm 12mm",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Fotoğraf */}
        {personalInfo.photo && (
          <div className="flex justify-center mb-8 relative">
            <img
              src={personalInfo.photo}
              alt={`${personalInfo.fullName} profile`}
              className="w-36 h-36 rounded-full object-cover outline outline-[3px] outline-[#3b82f6] border-[6px] border-[#0f172a] bg-[#0f172a]"
              fetchPriority="high"
              loading="eager"
            />
          </div>
        )}

        {/* İsim & Unvan */}
        <header className="text-center mb-10 relative break-text">
          <h1
            className="text-[2rem] font-black uppercase tracking-wider text-white mb-2 leading-none"
            style={{ fontFamily: FONT_STACK }}
          >
            {personalInfo.fullName}
          </h1>
          <div
            className="flex items-center justify-center gap-2 my-4"
            aria-hidden="true"
          >
            <div className="h-px w-8 bg-[#1e3a8a]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <div className="h-px w-16 bg-[#3b82f6]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <div className="h-px w-8 bg-[#1e3a8a]" />
          </div>
          <h2
            className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#60a5fa] px-2 break-text"
            style={{ fontFamily: FONT_STACK }}
          >
            {personalInfo.jobTitle}
          </h2>
        </header>

        {/* İletişim */}
        <section
          className="mb-11 relative"
          aria-label="Contact Information"
          data-ats-section="contact"
        >
          <h3
            className="text-[9px] font-black tracking-[0.4em] uppercase mb-5 flex items-center gap-3 text-[#94a3b8]"
            aria-hidden="true"
          >
            İletişim
            <span className="h-px flex-1 bg-[#334155]" />
          </h3>

          <address className="space-y-[7px] not-italic">
            {[
              {
                show: personalInfo.email,
                icon: <CiMail size={15} className="shrink-0" />,
                label: "Email",
                href: `mailto:${personalInfo.email}`,
                value: personalInfo.email,
                field: "email",
              },
              {
                show: personalInfo.phone,
                icon: <LuPhone size={15} className="shrink-0" />,
                label: "Phone",
                href: `tel:${personalInfo.phone}`,
                value: personalInfo.phone,
                field: "phone",
              },
              {
                show: personalInfo.location,
                icon: <LuMapPin size={15} className="shrink-0" />,
                label: "Location",
                href: null,
                value: personalInfo.location,
                field: "location",
              },
              {
                show: personalInfo.linkedin,
                icon: <FaLinkedin size={15} className="shrink-0" />,
                label: "LinkedIn",
                href: `https://${personalInfo.linkedin?.replace(/^https?:\/\//, "")}`,
                value: personalInfo.linkedin,
                field: "linkedin",
              },
              {
                show: personalInfo.github,
                icon: <FaGithub size={15} className="shrink-0" />,
                label: "GitHub",
                href: `https://${personalInfo.github?.replace(/^https?:\/\//, "")}`,
                value: personalInfo.github,
                field: "github",
              },
            ]
              .filter((c) => c.show)
              .map(({ icon, label, href, value, field }) => (
                <div
                  key={field}
                  className="flex items-center gap-3 rounded-xl text-xs font-medium tracking-wide bg-[#1e293b] border border-[#334155] px-3 py-2"
                >
                  <div
                    className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 text-[#60a5fa] bg-[#0f172a] border border-[#1e293b]"
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    {href ? (
                      <a
                        href={href}
                        className="block text-[11px] text-[#e2e8f0] truncate"
                        target={
                          field === "linkedin" || field === "github"
                            ? "_blank"
                            : undefined
                        }
                        rel="noopener noreferrer"
                        data-ats-field={field}
                      >
                        {value}
                      </a>
                    ) : (
                      <span
                        className="block text-[11px] text-[#e2e8f0] break-text"
                        data-ats-field={field}
                      >
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </address>
        </section>

        {/* Yetenekler */}
        {skills.length > 0 && (
          <section
            className="relative flex-1"
            aria-label="Skills"
            data-ats-section="skills"
          >
            <h3
              className="text-[9px] font-black tracking-[0.4em] uppercase mb-5 flex items-center gap-3 text-[#94a3b8]"
              aria-hidden="true"
            >
              Uzmanlık
              <span className="h-px flex-1 bg-[#334155]" />
            </h3>
            <ul className="flex flex-wrap gap-2" role="list">
              {skills.map((skill, i) => (
                <li
                  key={`skill-${i}-${skill.substring(0, 5)}`}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#e2e8f0] max-w-full truncate bg-[#1e293b] border border-[#334155]"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ══ SAĞ KOLON ══ */}
      <div
        className="w-[62%] flex flex-col relative shrink-0"
        style={{
          padding: "13mm 12mm 12mm",
          gap: "9mm",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          data-decor="true"
          className="hidden md:block absolute top-16 right-8 font-black tracking-tighter select-none pointer-events-none print:hidden opacity-5 text-[#0f172a]"
          style={{ fontSize: 110, lineHeight: 1 }}
          aria-hidden="true"
        >
          CV
        </div>

        {/* Hakkımda */}
        {personalInfo.summary && (
          <section
            className="relative break-text"
            aria-label="Professional Summary"
            data-ats-section="summary"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe]"
                aria-hidden="true"
              >
                <Award size={18} className="shrink-0" aria-hidden="true" />
              </div>
              <h3 className="text-[21px] font-black uppercase text-[#0f172a] tracking-widest">
                Hakkımda
              </h3>
              <div
                className="flex-1 h-px ml-2 bg-[#3b82f6] opacity-20"
                aria-hidden="true"
              />
            </div>
            <p className="text-[12.5px] leading-relaxed text-[#475569] font-medium text-left preserve-lines">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Deneyim */}
        {experiences.length > 0 && (
          <section
            className="relative"
            aria-label="Professional Experience"
            data-ats-section="experience"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe]"
                aria-hidden="true"
              >
                <Briefcase size={18} className="shrink-0" aria-hidden="true" />
              </div>
              <h3 className="text-[21px] font-black uppercase text-[#0f172a] tracking-widest">
                Deneyim
              </h3>
              <div
                className="flex-1 h-px ml-2 bg-[#3b82f6] opacity-20"
                aria-hidden="true"
              />
            </div>

            <div className="relative ml-5 space-y-7 pb-2 border-l-2 border-[#e2e8f0]">
              {experiences.map((exp, idx) => (
                <article
                  key={exp.id || idx}
                  className="relative pl-8 break-text"
                  data-ats-entry="job"
                >
                  <div
                    className="absolute -left-[9px] top-[5px] w-[16px] h-[16px] rounded-full bg-white border-[3px] border-[#3b82f6]"
                    aria-hidden="true"
                  />

                  {idx === 0 && (
                    <div
                      className="absolute -left-[2px] top-[5px] w-[2px] bg-[#3b82f6] opacity-30"
                      style={{ height: "calc(100% + 28px)" }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-black text-[16px] leading-snug text-[#0f172a]"
                        data-ats-field="job-title"
                      >
                        {exp.position}
                      </h4>
                      {exp.company && (
                        <div className="flex items-center gap-1.5 mt-[5px]">
                          <ChevronRight
                            size={11}
                            className="shrink-0 text-[#3b82f6]"
                            aria-hidden="true"
                          />
                          <span
                            className="text-[11px] font-bold uppercase tracking-widest text-[#64748b] truncate"
                            data-ats-field="company"
                          >
                            {exp.company}
                          </span>
                        </div>
                      )}
                    </div>

                    {(exp.startDate || exp.endDate) && (
                      <div className="flex shrink-0 mt-[2px]">
                        <div className="text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b]">
                          {exp.startDate && (
                            <time dateTime={toDatetime(exp.startDate)}>
                              {exp.startDate}
                            </time>
                          )}
                          {exp.startDate && exp.endDate && (
                            <span
                              className="mx-0.5 text-[#cbd5e1]"
                              aria-hidden="true"
                            >
                              –
                            </span>
                          )}
                          {exp.endDate && (
                            <time dateTime={toDatetime(exp.endDate)}>
                              {exp.endDate}
                            </time>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {exp.description && (
                    <p
                      className="text-[12px] leading-relaxed mt-2 font-medium text-[#475569] text-left preserve-lines"
                      data-ats-field="description"
                    >
                      {exp.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Eğitim */}
        {educations.length > 0 && (
          <section
            className="relative flex-1"
            aria-label="Education"
            data-ats-section="education"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe]"
                aria-hidden="true"
              >
                <GraduationCap
                  size={18}
                  className="shrink-0"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-[21px] font-black uppercase text-[#0f172a] tracking-widest">
                Eğitim
              </h3>
              <div
                className="flex-1 h-px ml-2 bg-[#3b82f6] opacity-20"
                aria-hidden="true"
              />
            </div>

            <div className="relative ml-5 space-y-6 pb-2 border-l-2 border-[#e2e8f0]">
              {educations.map((edu, idx) => (
                <article
                  key={edu.id || idx}
                  className="relative pl-8 break-text"
                  data-ats-entry="education"
                >
                  <div
                    className="absolute -left-[8px] top-[6px] w-[14px] h-[14px] rounded-full bg-[#f8fafc] border-[2.5px] border-[#cbd5e1]"
                    aria-hidden="true"
                  />

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-black text-[15px] leading-snug text-[#0f172a]"
                        data-ats-field="school"
                      >
                        {edu.school}
                      </h4>
                      <div className="flex items-center flex-wrap gap-1 mt-[5px] text-[12px]">
                        {edu.degree && (
                          <span
                            className="font-bold text-[#2563eb]"
                            data-ats-field="degree"
                          >
                            {edu.degree}
                          </span>
                        )}
                        {edu.degree && edu.fieldOfStudy && (
                          <span
                            className="font-black px-0.5 text-[#cbd5e1]"
                            aria-hidden="true"
                          >
                            •
                          </span>
                        )}
                        {edu.fieldOfStudy && (
                          <span
                            className="font-semibold text-[#64748b] break-text"
                            data-ats-field="field-of-study"
                          >
                            {edu.fieldOfStudy}
                          </span>
                        )}
                      </div>
                    </div>

                    {(edu.startDate || edu.endDate) && (
                      <div className="flex shrink-0 mt-[2px]">
                        <div className="text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap bg-white border border-[#e2e8f0] text-[#64748b]">
                          {edu.startDate && (
                            <time dateTime={toDatetime(edu.startDate)}>
                              {edu.startDate}
                            </time>
                          )}
                          {edu.startDate && edu.endDate && (
                            <span
                              className="mx-0.5 text-[#cbd5e1]"
                              aria-hidden="true"
                            >
                              –
                            </span>
                          )}
                          {edu.endDate && (
                            <time dateTime={toDatetime(edu.endDate)}>
                              {edu.endDate}
                            </time>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

"use client";

import { useCVStore } from "@/store/useCVStore";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// Tüm PDF viewer'larda garantili render için font stack
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
  if (["günümüz", "present", "halen"].includes(lower)) return "";
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
      className="w-full h-full min-h-[297mm] flex bg-[#fafafa] text-slate-800 relative z-0 overflow-hidden"
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
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
        /* PDF/print için ekstra güvenlik katmanı — mobil viewer garantisi */
        @media print {
          [data-decor="true"]{display:none !important}
          *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
        }
      `}</style>

      {/* ══ SOL KOLON ══ */}
      <div
        className="w-[38%] text-slate-300 flex flex-col relative"
        style={{
          background:
            "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: "14mm 11mm 12mm",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Dekoratif üst mavi çizgi — sadece preview */}
        <div
          data-decor="true"
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none print:hidden"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.6) 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        {/* Dekoratif mavi hale — sadece preview */}
        <div
          data-decor="true"
          className="absolute top-0 left-0 w-full h-72 pointer-events-none print:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.14) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        {/* Dekoratif nokta deseni — sadece preview */}
        <div
          data-decor="true"
          className="absolute inset-0 pointer-events-none print:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden="true"
        />

        {/* Fotoğraf */}
        {personalInfo.photo && (
          <div className="flex justify-center mb-8 relative z-10">
            <div
              className="p-[3px] rounded-full"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #67e8f9 100%)",
                boxShadow: "0 0 24px rgba(59,130,246,0.28)",
              }}
            >
              <div
                className="p-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)",
                }}
              >
                <img
                  src={personalInfo.photo}
                  alt={`${personalInfo.fullName} profile photo`}
                  className="w-36 h-36 rounded-full object-cover border-[3px] border-[#0f172a]"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* İsim & Unvan */}
        <header className="text-center mb-10 relative z-10">
          <span className="sr-only">Candidate Name: </span>
          <h1
            className="text-[2.15rem] font-black uppercase tracking-[0.14em] text-white mb-2 leading-none"
            style={{ fontFamily: FONT_STACK }}
          >
            {personalInfo.fullName}
          </h1>
          <div
            className="flex items-center justify-center gap-2 my-4"
            aria-hidden="true"
          >
            <div
              className="h-px w-8"
              style={{ background: "rgba(59,130,246,0.4)" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#3b82f6" }}
            />
            <div className="h-px w-16" style={{ background: "#3b82f6" }} />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#3b82f6" }}
            />
            <div
              className="h-px w-8"
              style={{ background: "rgba(59,130,246,0.4)" }}
            />
          </div>
          <span className="sr-only">Job Title: </span>
          <h2
            className="text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ color: "#60a5fa", fontFamily: FONT_STACK }}
          >
            {personalInfo.jobTitle}
          </h2>
        </header>

        {/* İletişim */}
        <section
          className="mb-11 relative z-10"
          aria-label="Contact Information"
          data-ats-section="contact"
        >
          <span className="sr-only">Contact Information</span>
          <h3
            className="text-[9px] font-black tracking-[0.42em] uppercase mb-5 flex items-center gap-3"
            style={{ color: "#64748b" }}
            aria-hidden="true"
          >
            İletişim
            <span
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(71,85,105,0.5) 0%, transparent 100%)",
              }}
            />
          </h3>

          <address className="space-y-[7px] not-italic">
            {[
              {
                show: personalInfo.email,
                icon: <Mail className="w-[15px] h-[15px]" aria-hidden="true" />,
                label: "Email",
                href: `mailto:${personalInfo.email}`,
                value: personalInfo.email,
                field: "email",
              },
              {
                show: personalInfo.phone,
                icon: (
                  <Phone className="w-[15px] h-[15px]" aria-hidden="true" />
                ),
                label: "Phone",
                href: `tel:${personalInfo.phone}`,
                value: personalInfo.phone,
                field: "phone",
              },
              {
                show: personalInfo.location,
                icon: (
                  <MapPin className="w-[15px] h-[15px]" aria-hidden="true" />
                ),
                label: "Location",
                href: null,
                value: personalInfo.location,
                field: "location",
              },
              {
                show: personalInfo.linkedin,
                icon: (
                  <FaLinkedin
                    className="w-[15px] h-[15px]"
                    aria-hidden="true"
                  />
                ),
                label: "LinkedIn",
                href: `https://${personalInfo.linkedin?.replace(/^https?:\/\//, "")}`,
                value: personalInfo.linkedin,
                field: "linkedin",
              },
              {
                show: personalInfo.github,
                icon: (
                  <FaGithub className="w-[15px] h-[15px]" aria-hidden="true" />
                ),
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
                  className="flex items-center gap-3 rounded-xl text-xs font-medium tracking-wide"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "9px 11px",
                  }}
                >
                  <div
                    className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(59,130,246,0.15)",
                      border: "1px solid rgba(59,130,246,0.18)",
                      color: "#60a5fa",
                    }}
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <span className="sr-only">{label}: </span>
                  {href ? (
                    <a
                      href={href}
                      className="flex-1 text-[11px] transition-colors"
                      style={{ color: "#e2e8f0" }}
                      target={
                        field === "linkedin" || field === "github"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        field === "linkedin" || field === "github"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      data-ats-field={field}
                    >
                      {value}
                    </a>
                  ) : (
                    <span
                      className="flex-1 text-[11px]"
                      style={{ color: "#e2e8f0" }}
                      data-ats-field={field}
                    >
                      {value}
                    </span>
                  )}
                </div>
              ))}
          </address>
        </section>

        {/* Yetenekler */}
        {skills.length > 0 && (
          <section
            className="relative z-10 flex-1"
            aria-label="Skills"
            data-ats-section="skills"
          >
            <span className="sr-only">Skills: {skills.join(", ")}</span>
            <h3
              className="text-[9px] font-black tracking-[0.42em] uppercase mb-5 flex items-center gap-3"
              style={{ color: "#64748b" }}
              aria-hidden="true"
            >
              Uzmanlık
              <span
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(71,85,105,0.5) 0%, transparent 100%)",
                }}
              />
            </h3>
            <ul className="flex flex-wrap gap-[7px]" role="list">
              {skills.map((skill, i) => (
                <li
                  key={i}
                  className="flex items-center px-[13px] py-[6px] rounded-full text-[11px] font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)",
                    border: "1px solid rgba(100,116,139,0.35)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    letterSpacing: "0.02em",
                    color: "#e2e8f0",
                  }}
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
        className="w-[62%] flex flex-col relative"
        style={{
          padding: "13mm 12mm 12mm",
          gap: "9mm",
          background: "linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Dev "CV" watermark — sadece preview */}
        <div
          data-decor="true"
          className="absolute top-16 right-8 font-black tracking-tighter select-none pointer-events-none print:hidden"
          style={{
            fontSize: 110,
            color: "rgba(15,23,42,0.028)",
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          CV
        </div>

        {/* Hakkımda */}
        {personalInfo.summary && (
          <section
            className="relative z-10"
            aria-label="Professional Summary"
            data-ats-section="summary"
          >
            <span className="sr-only">Professional Summary</span>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(219,234,254,0.8)",
                  border: "1px solid rgba(147,197,253,0.5)",
                  boxShadow: "0 1px 3px rgba(59,130,246,0.1)",
                  color: "#2563eb",
                }}
                aria-hidden="true"
              >
                <Award className="w-[18px] h-[18px]" aria-hidden="true" />
              </div>
              <h3
                className="text-[21px] font-black uppercase"
                style={{ letterSpacing: "0.14em", color: "#0f172a" }}
              >
                Hakkımda
              </h3>
              <div
                className="flex-1 h-px ml-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,0.25) 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
            </div>
            <p
              className="text-[12.5px] leading-[1.85] text-justify font-medium"
              style={{ color: "#475569" }}
            >
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Deneyim */}
        {experiences.length > 0 && (
          <section
            className="relative z-10"
            aria-label="Professional Experience"
            data-ats-section="experience"
          >
            <span className="sr-only">Professional Experience</span>
            <span className="sr-only">Work Experience</span>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(219,234,254,0.8)",
                  border: "1px solid rgba(147,197,253,0.5)",
                  boxShadow: "0 1px 3px rgba(59,130,246,0.1)",
                  color: "#2563eb",
                }}
                aria-hidden="true"
              >
                <Briefcase className="w-[18px] h-[18px]" aria-hidden="true" />
              </div>
              <h3
                className="text-[21px] font-black uppercase"
                style={{ letterSpacing: "0.14em", color: "#0f172a" }}
              >
                Deneyim
              </h3>
              <div
                className="flex-1 h-px ml-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,0.25) 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
            </div>

            <div
              className="relative ml-5 space-y-7 pb-2"
              style={{ borderLeft: "2px solid rgba(226,232,240,0.9)" }}
            >
              {experiences.map((exp, idx) => (
                <article
                  key={exp.id}
                  className="relative pl-8"
                  data-ats-entry="job"
                >
                  <div
                    className="absolute -left-[9px] top-[5px] w-[16px] h-[16px] rounded-full"
                    style={{
                      background: "#ffffff",
                      border: "3.5px solid #3b82f6",
                      boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
                    }}
                    aria-hidden="true"
                  />
                  {idx === 0 && (
                    <div
                      className="absolute -left-[2px] top-[5px] w-[2px]"
                      style={{
                        height: "calc(100% + 28px)",
                        background:
                          "linear-gradient(180deg, #3b82f6 0%, transparent 100%)",
                        opacity: 0.3,
                      }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <div className="w-[68%]">
                      <span className="sr-only">Job Title: </span>
                      <h4
                        className="font-black text-[16px] leading-snug"
                        style={{ color: "#0f172a" }}
                        data-ats-field="job-title"
                      >
                        {exp.position}
                      </h4>
                      {exp.company && (
                        <div className="flex items-center gap-1.5 mt-[5px]">
                          <ChevronRight
                            className="w-[11px] h-[11px] shrink-0"
                            style={{ color: "#3b82f6" }}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Company: </span>
                          <span
                            className="text-[11px] font-bold uppercase tracking-widest"
                            style={{ color: "#64748b" }}
                            data-ats-field="company"
                          >
                            {exp.company}
                          </span>
                        </div>
                      )}
                    </div>

                    {(exp.startDate || exp.endDate) && (
                      <div className="w-[30%] flex justify-end mt-[2px]">
                        <div
                          className="text-[10px] font-bold px-[10px] py-[5px] rounded-lg flex items-center gap-1 whitespace-nowrap"
                          style={{
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            color: "#64748b",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                          }}
                        >
                          <span className="sr-only">Employment period: </span>
                          {exp.startDate && (
                            <time dateTime={toDatetime(exp.startDate)}>
                              {exp.startDate}
                            </time>
                          )}
                          {exp.startDate && exp.endDate && (
                            <span
                              className="mx-0.5"
                              style={{ color: "#cbd5e1" }}
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
                      className="text-[12px] leading-[1.78] text-justify mt-2 font-medium"
                      style={{ color: "#64748b" }}
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
            className="relative z-10 flex-1"
            aria-label="Education"
            data-ats-section="education"
          >
            <span className="sr-only">Education</span>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(219,234,254,0.8)",
                  border: "1px solid rgba(147,197,253,0.5)",
                  boxShadow: "0 1px 3px rgba(59,130,246,0.1)",
                  color: "#2563eb",
                }}
                aria-hidden="true"
              >
                <GraduationCap
                  className="w-[18px] h-[18px]"
                  aria-hidden="true"
                />
              </div>
              <h3
                className="text-[21px] font-black uppercase"
                style={{ letterSpacing: "0.14em", color: "#0f172a" }}
              >
                Eğitim
              </h3>
              <div
                className="flex-1 h-px ml-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,0.25) 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
            </div>

            <div
              className="relative ml-5 space-y-6 pb-2"
              style={{ borderLeft: "2px solid rgba(226,232,240,0.9)" }}
            >
              {educations.map((edu) => (
                <article
                  key={edu.id}
                  className="relative pl-8"
                  data-ats-entry="education"
                >
                  <div
                    className="absolute -left-[8px] top-[6px] w-[14px] h-[14px] rounded-full"
                    style={{
                      background: "#f1f5f9",
                      border: "2.5px solid #cbd5e1",
                      boxShadow: "0 0 0 3px #ffffff",
                    }}
                    aria-hidden="true"
                  />

                  <div className="flex justify-between items-start">
                    <div className="w-[68%]">
                      <span className="sr-only">School: </span>
                      <h4
                        className="font-black text-[15px] leading-snug"
                        style={{ color: "#0f172a" }}
                        data-ats-field="school"
                      >
                        {edu.school}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-[5px] text-[12px]">
                        {edu.degree && (
                          <>
                            <span className="sr-only">Degree: </span>
                            <span
                              className="font-bold"
                              style={{ color: "#2563eb" }}
                              data-ats-field="degree"
                            >
                              {edu.degree}
                            </span>
                          </>
                        )}
                        {edu.degree && edu.fieldOfStudy && (
                          <span
                            className="font-black px-0.5"
                            style={{ color: "#cbd5e1" }}
                            aria-hidden="true"
                          >
                            •
                          </span>
                        )}
                        {edu.fieldOfStudy && (
                          <>
                            <span className="sr-only">Field of Study: </span>
                            <span
                              className="font-semibold"
                              style={{ color: "#64748b" }}
                              data-ats-field="field-of-study"
                            >
                              {edu.fieldOfStudy}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {(edu.startDate || edu.endDate) && (
                      <div className="w-[30%] flex justify-end mt-[2px]">
                        <div
                          className="text-[10px] font-bold px-[10px] py-[5px] rounded-md flex items-center gap-1"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            color: "#64748b",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                          }}
                        >
                          <span className="sr-only">Dates: </span>
                          {edu.startDate && (
                            <time dateTime={toDatetime(edu.startDate)}>
                              {edu.startDate}
                            </time>
                          )}
                          {edu.startDate && edu.endDate && (
                            <span
                              className="mx-0.5"
                              style={{ color: "#cbd5e1" }}
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

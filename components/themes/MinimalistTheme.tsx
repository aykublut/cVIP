"use client";

import { useCVStore } from "@/store/useCVStore";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

function toDatetime(d: string): string {
  if (!d) return "";
  const m: Record<string, string> = {
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
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };
  const l = d.toLowerCase().trim();
  if (["günümüz", "present", "halen", "devam"].includes(l)) return "";
  const y = l.match(/\d{4}/)?.[0];
  if (!y) return "";
  for (const [k, v] of Object.entries(m)) if (l.includes(k)) return `${y}-${v}`;
  return y;
}

export default function MinimalistTheme() {
  const { cvData } = useCVStore();
  const { personalInfo, experiences, educations, skills } = cvData;

  const contacts = [
    {
      v: personalInfo.email,
      icon: <Mail className="w-[11px] h-[11px]" aria-hidden="true" />,
      href: `mailto:${personalInfo.email}`,
      field: "email",
    },
    {
      v: personalInfo.phone,
      icon: <Phone className="w-[11px] h-[11px]" aria-hidden="true" />,
      href: `tel:${personalInfo.phone}`,
      field: "phone",
    },
    {
      v: personalInfo.location,
      icon: <MapPin className="w-[11px] h-[11px]" aria-hidden="true" />,
      href: null,
      field: "location",
    },
    {
      v: personalInfo.linkedin,
      icon: <FaLinkedin className="w-[11px] h-[11px]" aria-hidden="true" />,
      href: `https://${personalInfo.linkedin?.replace(/^https?:\/\//, "")}`,
      field: "linkedin",
    },
    {
      v: personalInfo.github,
      icon: <FaGithub className="w-[11px] h-[11px]" aria-hidden="true" />,
      href: `https://${personalInfo.github?.replace(/^https?:\/\//, "")}`,
      field: "github",
    },
  ].filter((c) => c.v);

  return (
    <main
      className="w-full min-h-[297mm] bg-white text-[#0f0f0f] relative overflow-hidden"
      role="main"
      aria-label="Curriculum Vitae"
      data-ats-document="resume"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
        .cormorant{font-family:'Cormorant Garamond',serif}
      `}</style>

      {/* ── Dikey Accent Çizgisi ── */}
      <div
        className="absolute top-0 bottom-0 left-[42mm] w-[1px] print:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #e2e2e2 8%, #e2e2e2 92%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════
          HEADER — Asimetrik Yerleşim
      ════════════════════════════ */}
      <header
        className="relative"
        style={{ padding: "14mm 14mm 0 14mm" }}
        data-ats-section="header"
      >
        {/* Sol etiket — "CV" dikey */}
        <div
          className="absolute top-[14mm] left-[7mm] cormorant text-[9px] font-light tracking-[0.35em] text-[#c0c0c0] uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.3em",
          }}
          aria-hidden="true"
        >
          Curriculum Vitae
        </div>

        <div
          className="ml-[32mm] flex gap-[10mm] items-end pb-[9mm]"
          style={{ borderBottom: "2px solid #0f0f0f" }}
        >
          {/* Fotoğraf */}
          {personalInfo.photo && (
            <div className="shrink-0" aria-hidden="true">
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || "Profile"}
                className="object-cover"
                style={{
                  width: "28mm",
                  height: "34mm",
                  filter: "grayscale(15%)",
                }}
              />
            </div>
          )}

          {/* Ad + İletişim */}
          <div className="flex-1 flex flex-col justify-end">
            {/* İsim */}
            <div className="mb-[3mm]">
              <span className="sr-only">Candidate Name: </span>
              <h1
                className="cormorant font-light text-[#0f0f0f] leading-none"
                style={{ fontSize: "3.6rem", letterSpacing: "0.04em" }}
                aria-label="Full Name"
              >
                {personalInfo.fullName}
              </h1>
            </div>

            {/* Unvan + iletişim yan yana */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="sr-only">Job Title: </span>
                <h2
                  className="font-light uppercase text-[#888] tracking-[0.25em]"
                  style={{ fontSize: "10px", letterSpacing: "0.28em" }}
                  aria-label="Job Title"
                >
                  {personalInfo.jobTitle}
                </h2>
              </div>

              {/* İletişim — sağ hizalı inline */}
              {contacts.length > 0 && (
                <address
                  className="flex flex-wrap justify-end items-center not-italic"
                  style={{ gap: "2px 14px" }}
                  aria-label="Contact Information"
                  data-ats-section="contact"
                >
                  {contacts.map(({ v, icon, href, field }) => (
                    <span
                      key={field}
                      className="flex items-center gap-[4px]"
                      style={{
                        color: "#555",
                        fontSize: "9.5px",
                        fontWeight: 400,
                      }}
                    >
                      <span aria-hidden="true" style={{ color: "#aaa" }}>
                        {icon}
                      </span>
                      <span className="sr-only">{field}: </span>
                      {href ? (
                        <a
                          href={href}
                          className="hover:text-[#0f0f0f] transition-colors"
                          target={
                            ["linkedin", "github"].includes(field)
                              ? "_blank"
                              : undefined
                          }
                          rel="noopener noreferrer"
                          data-ats-field={field}
                        >
                          {v}
                        </a>
                      ) : (
                        <span data-ats-field={field}>{v}</span>
                      )}
                    </span>
                  ))}
                </address>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════
          GÖVDE — 2 Alan: Sol etiket / Sağ içerik
      ════════════════════════════ */}
      <div style={{ padding: "0 14mm 14mm 14mm" }}>
        {/* ── Özet ── */}
        {personalInfo.summary && (
          <section
            className="flex"
            style={{
              paddingTop: "8mm",
              paddingBottom: "7mm",
              borderBottom: "1px solid #e8e8e8",
            }}
            aria-label="Professional Summary"
            data-ats-section="summary"
          >
            <span className="sr-only">Professional Summary</span>

            {/* Sol etiket */}
            <div className="shrink-0" style={{ width: "32mm" }}>
              <span
                className="block font-medium uppercase text-[#0f0f0f]"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  paddingTop: "3px",
                }}
              >
                Özet
              </span>
            </div>

            {/* İçerik */}
            <div className="flex-1">
              <p
                className="cormorant font-light text-[#2a2a2a] text-justify leading-[1.75]"
                style={{ fontSize: "14.5px", fontStyle: "italic" }}
              >
                {personalInfo.summary}
              </p>
            </div>
          </section>
        )}

        {/* ── Deneyim ── */}
        {experiences.length > 0 && (
          <section
            className="flex"
            style={{
              paddingTop: "8mm",
              paddingBottom: "7mm",
              borderBottom: "1px solid #e8e8e8",
            }}
            aria-label="Professional Experience"
            data-ats-section="experience"
          >
            <span className="sr-only">Professional Experience</span>
            <span className="sr-only">Work Experience</span>

            {/* Sol etiket */}
            <div className="shrink-0" style={{ width: "32mm" }}>
              <span
                className="block font-medium uppercase text-[#0f0f0f] sticky top-0"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  paddingTop: "3px",
                }}
              >
                Deneyim
              </span>
            </div>

            {/* İçerik */}
            <div className="flex-1 flex flex-col" style={{ gap: "6mm" }}>
              {experiences.map((exp, idx) => (
                <article
                  key={exp.id}
                  data-ats-entry="job"
                  aria-label={`${exp.position}${exp.company ? ` at ${exp.company}` : ""}`}
                  style={{
                    paddingTop: idx > 0 ? "6mm" : 0,
                    borderTop: idx > 0 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  {/* Pozisyon + Şirket + Tarih — tek satır */}
                  <div className="flex items-baseline justify-between gap-4 mb-[4px]">
                    <div className="flex items-baseline gap-[8px] flex-1 min-w-0">
                      <span className="sr-only">Job Title: </span>
                      <h3
                        className="font-semibold text-[#0f0f0f] shrink-0"
                        style={{ fontSize: "13px", letterSpacing: "-0.01em" }}
                        data-ats-field="job-title"
                      >
                        {exp.position}
                      </h3>
                      {exp.company && (
                        <>
                          <span
                            className="text-[#ccc] font-light"
                            style={{ fontSize: "11px" }}
                            aria-hidden="true"
                          >
                            —
                          </span>
                          <span className="sr-only">Company: </span>
                          <span
                            className="font-light text-[#666] truncate"
                            style={{
                              fontSize: "12px",
                              letterSpacing: "0.02em",
                            }}
                            data-ats-field="company"
                          >
                            {exp.company}
                          </span>
                        </>
                      )}
                    </div>

                    {(exp.startDate || exp.endDate) && (
                      <div
                        className="shrink-0 flex items-baseline gap-[3px]"
                        style={{
                          fontSize: "10px",
                          color: "#999",
                          fontStyle: "italic",
                        }}
                      >
                        <span className="sr-only">Employment period: </span>
                        {exp.startDate && (
                          <time dateTime={toDatetime(exp.startDate)}>
                            {exp.startDate}
                          </time>
                        )}
                        {exp.startDate && exp.endDate && (
                          <span aria-hidden="true"> – </span>
                        )}
                        {exp.endDate && (
                          <time dateTime={toDatetime(exp.endDate)}>
                            {exp.endDate}
                          </time>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Açıklama */}
                  {exp.description && (
                    <p
                      className="font-light text-[#444] leading-[1.75] text-justify"
                      style={{ fontSize: "11.5px" }}
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

        {/* ── Eğitim ── */}
        {educations.length > 0 && (
          <section
            className="flex"
            style={{
              paddingTop: "8mm",
              paddingBottom: "7mm",
              borderBottom: "1px solid #e8e8e8",
            }}
            aria-label="Education"
            data-ats-section="education"
          >
            <span className="sr-only">Education</span>

            {/* Sol etiket */}
            <div className="shrink-0" style={{ width: "32mm" }}>
              <span
                className="block font-medium uppercase text-[#0f0f0f]"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  paddingTop: "3px",
                }}
              >
                Eğitim
              </span>
            </div>

            {/* İçerik */}
            <div className="flex-1 flex flex-col" style={{ gap: "5mm" }}>
              {educations.map((edu, idx) => (
                <article
                  key={edu.id}
                  data-ats-entry="education"
                  aria-label={`${edu.degree ?? ""}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}${edu.school ? ` at ${edu.school}` : ""}`}
                  style={{
                    paddingTop: idx > 0 ? "5mm" : 0,
                    borderTop: idx > 0 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="sr-only">School: </span>
                      <h3
                        className="font-semibold text-[#0f0f0f]"
                        style={{ fontSize: "13px", letterSpacing: "-0.01em" }}
                        data-ats-field="school"
                      >
                        {edu.school}
                      </h3>
                      <div
                        className="flex items-center gap-[6px] mt-[2px]"
                        style={{ fontSize: "11px" }}
                      >
                        {edu.degree && (
                          <>
                            <span className="sr-only">Degree: </span>
                            <span
                              className="font-light text-[#444]"
                              data-ats-field="degree"
                            >
                              {edu.degree}
                            </span>
                          </>
                        )}
                        {edu.degree && edu.fieldOfStudy && (
                          <span className="text-[#ccc]" aria-hidden="true">
                            /
                          </span>
                        )}
                        {edu.fieldOfStudy && (
                          <>
                            <span className="sr-only">Field of Study: </span>
                            <span
                              className="font-light text-[#666]"
                              data-ats-field="field-of-study"
                            >
                              {edu.fieldOfStudy}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {(edu.startDate || edu.endDate) && (
                      <div
                        className="shrink-0 flex items-baseline gap-[3px]"
                        style={{
                          fontSize: "10px",
                          color: "#999",
                          fontStyle: "italic",
                        }}
                      >
                        <span className="sr-only">Dates: </span>
                        {edu.startDate && (
                          <time dateTime={toDatetime(edu.startDate)}>
                            {edu.startDate}
                          </time>
                        )}
                        {edu.startDate && edu.endDate && (
                          <span aria-hidden="true"> – </span>
                        )}
                        {edu.endDate && (
                          <time dateTime={toDatetime(edu.endDate)}>
                            {edu.endDate}
                          </time>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Yetenekler ── */}
        {skills.length > 0 && (
          <section
            className="flex"
            style={{ paddingTop: "8mm" }}
            aria-label="Skills"
            data-ats-section="skills"
          >
            <span className="sr-only">Skills: {skills.join(", ")}</span>

            {/* Sol etiket */}
            <div className="shrink-0" style={{ width: "32mm" }}>
              <span
                className="block font-medium uppercase text-[#0f0f0f]"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  paddingTop: "3px",
                }}
              >
                Yetkinlikler
              </span>
            </div>

            {/* İçerik — noktalı inline liste */}
            <div className="flex-1">
              <ul
                className="flex flex-wrap items-center"
                style={{ gap: "0px 0px" }}
                role="list"
                aria-label="Skills list"
              >
                {skills.map((skill, i) => (
                  <li
                    key={i}
                    className="flex items-center"
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 300,
                      color: "#333",
                    }}
                  >
                    <span>{skill}</span>
                    {i < skills.length - 1 && (
                      <span
                        className="cormorant font-light mx-[8px]"
                        style={{ color: "#bbb", fontSize: "14px" }}
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* ── Alt Çizgi ── */}
      <div
        className="mx-[14mm]"
        style={{ borderBottom: "2px solid #0f0f0f", marginBottom: "6mm" }}
        aria-hidden="true"
      />

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "0 14mm 8mm",
          fontSize: "8px",
          color: "#ccc",
          letterSpacing: "0.15em",
        }}
        aria-hidden="true"
      >
        <span
          className="cormorant font-light"
          style={{
            fontSize: "11px",
            fontStyle: "italic",
            letterSpacing: "0.05em",
          }}
        >
          {personalInfo.fullName}
        </span>
        <span
          className="uppercase tracking-[0.2em]"
          style={{ fontSize: "7.5px" }}
        >
          {new Date().getFullYear()}
        </span>
      </div>
    </main>
  );
}

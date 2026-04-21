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
      Icon: Mail,
      href: `mailto:${personalInfo.email}`,
      field: "email",
    },
    {
      v: personalInfo.phone,
      Icon: Phone,
      href: `tel:${personalInfo.phone}`,
      field: "phone",
    },
    { v: personalInfo.location, Icon: MapPin, href: null, field: "location" },
    {
      v: personalInfo.linkedin,
      Icon: FaLinkedin,
      href: `https://${personalInfo.linkedin?.replace(/^https?:\/\//, "")}`,
      field: "linkedin",
    },
    {
      v: personalInfo.github,
      Icon: FaGithub,
      href: `https://${personalInfo.github?.replace(/^https?:\/\//, "")}`,
      field: "github",
    },
  ].filter((c) => c.v);

  return (
    <main
      className="w-full min-h-[297mm] relative overflow-hidden"
      role="main"
      aria-label="Curriculum Vitae"
      data-ats-document="resume"
      style={{ background: "#fafaf8", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
        .pf{font-family:'Playfair Display',serif}
      `}</style>

      {/* ══════════════════════════════════
          HERO — Tam genişlik siyah şerit
      ══════════════════════════════════ */}
      <header
        data-ats-section="header"
        style={{
          background: "#111",
          padding: "11mm 13mm 0 13mm",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Büyük dekoratif arka plan harf — görsel derinlik */}
        <div
          className="pf absolute select-none pointer-events-none"
          style={{
            bottom: "-10mm",
            right: "10mm",
            fontSize: "180px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.03)",
            lineHeight: 1,
            letterSpacing: "-0.06em",
          }}
          aria-hidden="true"
        >
          {(personalInfo.fullName || "CV")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>

        {/* Amber accent top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div
          className="relative z-10"
          style={{ display: "flex", alignItems: "flex-end", gap: "10mm" }}
        >
          {/* Fotoğraf */}
          {personalInfo.photo && (
            <div style={{ flexShrink: 0, marginBottom: -1 }}>
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || "Profile"}
                style={{
                  width: "30mm",
                  height: "38mm",
                  objectFit: "cover",
                  display: "block",
                  filter: "grayscale(20%) contrast(1.05)",
                }}
              />
            </div>
          )}

          {/* İsim bloğu */}
          <div style={{ flex: 1, paddingBottom: "9mm" }}>
            {/* Unvan — üstte, küçük */}
            <div style={{ marginBottom: "4px" }}>
              <span className="sr-only">Job Title: </span>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "#f59e0b",
                }}
                aria-label="Job Title"
              >
                {personalInfo.jobTitle}
              </p>
            </div>

            {/* İsim — büyük, beyaz */}
            <div>
              <span className="sr-only">Candidate Name: </span>
              <h1
                className="pf"
                style={{
                  fontSize: "3.2rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.0,
                  letterSpacing: "-0.01em",
                }}
                aria-label="Full Name"
              >
                {personalInfo.fullName}
              </h1>
            </div>
          </div>
        </div>

        {/* İletişim bandı — hero içinde alt şerit */}
        {contacts.length > 0 && (
          <address
            className="relative z-10 not-italic"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: "6mm",
            }}
            aria-label="Contact Information"
            data-ats-section="contact"
          >
            {contacts.map(({ v, Icon, href, field }, i) => (
              <div
                key={field}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 14px 8px 0",
                  marginRight: "14px",
                  borderRight:
                    i < contacts.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  paddingRight: i < contacts.length - 1 ? "14px" : "0",
                }}
              >
                <Icon
                  style={{
                    width: 10,
                    height: 10,
                    color: "#f59e0b",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span className="sr-only">{field}: </span>
                {href ? (
                  <a
                    href={href}
                    style={{
                      fontSize: "9.5px",
                      color: "rgba(255,255,255,0.6)",
                      fontWeight: 400,
                      textDecoration: "none",
                    }}
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
                  <span
                    style={{
                      fontSize: "9.5px",
                      color: "rgba(255,255,255,0.6)",
                      fontWeight: 400,
                    }}
                    data-ats-field={field}
                  >
                    {v}
                  </span>
                )}
              </div>
            ))}
          </address>
        )}
      </header>

      {/* ══════════════════════════════════
          GÖVDE
      ══════════════════════════════════ */}
      <div style={{ padding: "0 13mm 13mm 13mm" }}>
        {/* ── Özet ── */}
        {personalInfo.summary && (
          <section
            style={{ padding: "8mm 0 7mm", borderBottom: "1px solid #e4e4e0" }}
            aria-label="Professional Summary"
            data-ats-section="summary"
          >
            <span className="sr-only">Professional Summary</span>

            <div
              style={{ display: "flex", gap: "8mm", alignItems: "flex-start" }}
            >
              {/* Sol: Bölüm numarası */}
              <div
                style={{ flexShrink: 0, width: "8mm", paddingTop: "2px" }}
                aria-hidden="true"
              >
                <span
                  className="pf"
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#e8e6e0",
                    lineHeight: 1,
                  }}
                >
                  01
                </span>
              </div>

              {/* İçerik */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#111",
                    }}
                  >
                    Profil
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, #111 0%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <p
                  className="pf"
                  style={{
                    fontSize: "13.5px",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#333",
                    lineHeight: 1.78,
                    textAlign: "justify",
                  }}
                >
                  {personalInfo.summary}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Deneyim ── */}
        {experiences.length > 0 && (
          <section
            style={{ padding: "8mm 0 7mm", borderBottom: "1px solid #e4e4e0" }}
            aria-label="Professional Experience"
            data-ats-section="experience"
          >
            <span className="sr-only">Professional Experience</span>
            <span className="sr-only">Work Experience</span>

            <div
              style={{ display: "flex", gap: "8mm", alignItems: "flex-start" }}
            >
              {/* Numara */}
              <div
                style={{ flexShrink: 0, width: "8mm", paddingTop: "2px" }}
                aria-hidden="true"
              >
                <span
                  className="pf"
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#e8e6e0",
                    lineHeight: 1,
                  }}
                >
                  02
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "7mm",
                  }}
                >
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#111",
                    }}
                  >
                    Deneyim
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, #111 0%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6mm",
                  }}
                >
                  {experiences.map((exp, idx) => (
                    <article
                      key={exp.id}
                      data-ats-entry="job"
                      aria-label={`${exp.position}${exp.company ? ` at ${exp.company}` : ""}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: "0 6mm",
                        paddingTop: idx > 0 ? "6mm" : 0,
                        borderTop: idx > 0 ? "1px solid #edede9" : "none",
                      }}
                    >
                      {/* Sol: Tarih + Şirket — dikey */}
                      <div style={{ width: "24mm", paddingTop: "3px" }}>
                        {(exp.startDate || exp.endDate) && (
                          <div style={{ marginBottom: "4px" }}>
                            <span className="sr-only">Employment period: </span>
                            <div
                              style={{
                                fontSize: "9px",
                                color: "#999",
                                fontStyle: "italic",
                                lineHeight: 1.4,
                              }}
                            >
                              {exp.startDate && (
                                <time dateTime={toDatetime(exp.startDate)}>
                                  {exp.startDate}
                                </time>
                              )}
                              {exp.startDate && exp.endDate && <br />}
                              {exp.endDate && (
                                <time dateTime={toDatetime(exp.endDate)}>
                                  {exp.endDate}
                                </time>
                              )}
                            </div>
                          </div>
                        )}
                        {exp.company && (
                          <div>
                            <span className="sr-only">Company: </span>
                            <p
                              style={{
                                fontSize: "8.5px",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#f59e0b",
                                lineHeight: 1.4,
                              }}
                              data-ats-field="company"
                            >
                              {exp.company}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Sağ: Pozisyon + Açıklama */}
                      <div>
                        <span className="sr-only">Job Title: </span>
                        <h3
                          className="pf"
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#111",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.2,
                            marginBottom: "5px",
                          }}
                          data-ats-field="job-title"
                        >
                          {exp.position}
                        </h3>
                        {exp.description && (
                          <p
                            style={{
                              fontSize: "11px",
                              fontWeight: 300,
                              color: "#555",
                              lineHeight: 1.78,
                              textAlign: "justify",
                            }}
                            data-ats-field="description"
                          >
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Eğitim + Yetenekler — yan yana ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8mm",
            paddingTop: "8mm",
          }}
        >
          {/* Eğitim */}
          {educations.length > 0 && (
            <section aria-label="Education" data-ats-section="education">
              <span className="sr-only">Education</span>

              <div
                style={{
                  display: "flex",
                  gap: "6mm",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{ flexShrink: 0, width: "8mm", paddingTop: "2px" }}
                  aria-hidden="true"
                >
                  <span
                    className="pf"
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: "#e8e6e0",
                      lineHeight: 1,
                    }}
                  >
                    03
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6mm",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 700,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "#111",
                      }}
                    >
                      Eğitim
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, #111 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5mm",
                    }}
                  >
                    {educations.map((edu, idx) => (
                      <article
                        key={edu.id}
                        data-ats-entry="education"
                        aria-label={`${edu.degree ?? ""}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}${edu.school ? ` at ${edu.school}` : ""}`}
                        style={{
                          paddingTop: idx > 0 ? "5mm" : 0,
                          borderTop: idx > 0 ? "1px solid #edede9" : "none",
                        }}
                      >
                        {(edu.startDate || edu.endDate) && (
                          <div
                            style={{
                              fontSize: "8.5px",
                              color: "#aaa",
                              fontStyle: "italic",
                              marginBottom: "2px",
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
                        <span className="sr-only">School: </span>
                        <h3
                          className="pf"
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#111",
                            lineHeight: 1.2,
                            marginBottom: "3px",
                          }}
                          data-ats-field="school"
                        >
                          {edu.school}
                        </h3>
                        <div
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 300,
                            color: "#666",
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          {edu.degree && (
                            <>
                              <span className="sr-only">Degree: </span>
                              <span data-ats-field="degree">{edu.degree}</span>
                            </>
                          )}
                          {edu.degree && edu.fieldOfStudy && (
                            <span style={{ color: "#ccc" }} aria-hidden="true">
                              /
                            </span>
                          )}
                          {edu.fieldOfStudy && (
                            <>
                              <span className="sr-only">Field of Study: </span>
                              <span data-ats-field="field-of-study">
                                {edu.fieldOfStudy}
                              </span>
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Yetenekler */}
          {skills.length > 0 && (
            <section aria-label="Skills" data-ats-section="skills">
              <span className="sr-only">Skills: {skills.join(", ")}</span>

              <div
                style={{
                  display: "flex",
                  gap: "6mm",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{ flexShrink: 0, width: "8mm", paddingTop: "2px" }}
                  aria-hidden="true"
                >
                  <span
                    className="pf"
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: "#e8e6e0",
                      lineHeight: 1,
                    }}
                  >
                    04
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6mm",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 700,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "#111",
                      }}
                    >
                      Yetkinlikler
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, #111 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                    role="list"
                  >
                    {skills.map((skill, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "11px",
                          fontWeight: 400,
                          color: "#333",
                          lineHeight: 1.5,
                        }}
                      >
                        {/* Amber nokta */}
                        <span
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "#f59e0b",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#111",
          padding: "5mm 13mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        aria-hidden="true"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{ width: "18px", height: "2px", background: "#f59e0b" }}
          />
          <span
            className="pf"
            style={{
              fontSize: "11px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
              fontStyle: "italic",
            }}
          >
            {personalInfo.fullName}
          </span>
        </div>
        <span
          style={{
            fontSize: "7.5px",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Curriculum Vitae · {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}

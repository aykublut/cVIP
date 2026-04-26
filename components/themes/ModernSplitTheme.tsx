"use client";

import { useCVStore } from "@/store/useCVStore";

const FONT_STACK = "'Calibri', 'Arial', 'Helvetica Neue', Helvetica, sans-serif";

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatDate(iso: string): string {
  if (!iso) return "";
  if (iso === "present") return "Günümüz";
  const [year, month] = iso.split("-");
  const idx = parseInt(month, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx > 11) return iso;
  return `${MONTHS_TR[idx]} ${year}`;
}

function formatDateRange(start: string, end: string): string {
  const s = formatDate(start);
  const e = formatDate(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

function SectionHeading({ tr, en }: { tr: string; en: string }) {
  return (
    <h2
      style={{
        fontSize: "11.5pt",
        fontWeight: 700,
        color: "#0a1930",
        textTransform: "uppercase",
        letterSpacing: 0,
        borderBottom: "1.5px solid #0052cc",
        paddingBottom: "1.5mm",
        marginBottom: "4mm",
        marginTop: 0,
      }}
    >
      {tr}
      <span className="sr-only"> {en}</span>
    </h2>
  );
}

export default function ModernSplitTheme() {
  const { cvData } = useCVStore();
  const {
    personalInfo,
    experiences,
    educations,
    skills,
    certificates,
    projects,
    languages,
  } = cvData;

  return (
    <div
      data-ats-document="true"
      style={{
        position: "relative",
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        fontFamily: FONT_STACK,
        color: "#1a1a2e",
        fontSize: "10.5pt",
        lineHeight: "1.15",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <style>{`
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
        @media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.sr-only{display:none!important}}
      `}</style>

      {/* Sol accent çizgisi — dekoratif, ATS metin akışına dokunmaz */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4mm",
          backgroundColor: "#0052cc",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Tüm içerik bu div içinde — accent çizgisinin sağında */}
      <div style={{ padding: "13mm 15mm 13mm 19mm", position: "relative", zIndex: 1 }}>

        {/* ── İLETİŞİM BLOĞU ── */}
        <header
          data-ats-section="contact"
          style={{
            marginBottom: "7mm",
            position: "relative",
            paddingRight: (personalInfo.showPhoto && personalInfo.photo) ? "33mm" : 0,
          }}
        >
          {/* Fotoğraf — position:absolute, ATS metin akışına dokunmaz */}
          {personalInfo.showPhoto && personalInfo.photo && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "28mm",
                height: "28mm",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #0052cc",
                flexShrink: 0,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              <img
                src={personalInfo.photo}
                alt=""
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}
          <h1
            data-ats-field="name"
            style={{
              fontSize: "26pt",
              fontWeight: 900,
              color: "#0a1930",
              lineHeight: 1.05,
              marginBottom: "2mm",
              letterSpacing: 0,
            }}
          >
            {personalInfo.fullName}
          </h1>

          {personalInfo.jobTitle && (
            <p
              data-ats-field="job-title"
              style={{
                fontSize: "13pt",
                fontWeight: 600,
                color: "#0052cc",
                marginBottom: "4mm",
              }}
            >
              {personalInfo.jobTitle}
            </p>
          )}

          <address
            style={{
              fontStyle: "normal",
              fontSize: "9.5pt",
              color: "#444444",
              lineHeight: "1.6",
            }}
          >
            {[
              personalInfo.location && (
                <span key="location" data-ats-field="location">
                  {personalInfo.location}
                </span>
              ),
              personalInfo.phone && (
                <a
                  key="phone"
                  href={`tel:${personalInfo.phone}`}
                  data-ats-field="phone"
                  style={{ color: "#444444", textDecoration: "none" }}
                >
                  {personalInfo.phone}
                </a>
              ),
              personalInfo.email && (
                <a
                  key="email"
                  href={`mailto:${personalInfo.email}`}
                  data-ats-field="email"
                  style={{ color: "#444444", textDecoration: "underline" }}
                >
                  {personalInfo.email}
                </a>
              ),
            ]
              .filter(Boolean)
              .reduce<React.ReactNode[]>((acc, el, i) => {
                if (i > 0) acc.push(<span key={`sep-${i}`}> | </span>);
                acc.push(el);
                return acc;
              }, [])}

            {(personalInfo.linkedin || personalInfo.github) && (
              <div style={{ marginTop: "1mm" }}>
                {[
                  personalInfo.linkedin && (
                    <a
                      key="linkedin"
                      href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, "")}`}
                      data-ats-field="linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0052cc", textDecoration: "underline" }}
                    >
                      {personalInfo.linkedin}
                    </a>
                  ),
                  personalInfo.github && (
                    <a
                      key="github"
                      href={`https://${personalInfo.github.replace(/^https?:\/\//, "")}`}
                      data-ats-field="github"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0052cc", textDecoration: "underline" }}
                    >
                      {personalInfo.github}
                    </a>
                  ),
                ]
                  .filter(Boolean)
                  .reduce<React.ReactNode[]>((acc, el, i) => {
                    if (i > 0) acc.push(<span key={`sep-${i}`}> | </span>);
                    acc.push(el);
                    return acc;
                  }, [])}
              </div>
            )}
          </address>
        </header>

        {/* ── PROFESYONEL ÖZET ── */}
        {personalInfo.summary && (
          <section data-ats-section="summary" style={{ marginBottom: "7mm" }}>
            <SectionHeading tr="Profesyonel Özet" en="Professional Summary" />
            <p
              style={{
                fontSize: "10.5pt",
                lineHeight: "1.4",
                color: "#333333",
                textAlign: "left",
                whiteSpace: "pre-line",
                margin: 0,
              }}
            >
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* ── İŞ DENEYİMİ ── */}
        {experiences.length > 0 && (
          <section data-ats-section="work-experience" style={{ marginBottom: "7mm" }}>
            <SectionHeading tr="İş Deneyimi" en="Work Experience" />
            {experiences.map((exp) => (
              <article
                key={exp.id}
                data-ats-entry="experience"
                style={{ marginBottom: "5mm" }}
              >
                <h3
                  data-ats-field="position"
                  style={{
                    fontSize: "11pt",
                    fontWeight: 700,
                    color: "#0a1930",
                    margin: "0 0 1mm",
                  }}
                >
                  {exp.position}
                </h3>
                <p style={{ fontSize: "9.5pt", color: "#555555", margin: "0 0 2mm" }}>
                  <span data-ats-field="company" style={{ fontWeight: 600 }}>
                    {exp.company}
                  </span>
                  {(exp.startDate || exp.endDate) && (
                    <>
                      <span> | </span>
                      <time
                        data-ats-field="date-range"
                        dateTime={exp.startDate && exp.startDate !== "present" ? exp.startDate : undefined}
                      >
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </time>
                    </>
                  )}
                </p>
                {exp.description && (
                  <ul style={{ margin: 0, paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .map((line) => line.trim().replace(/^[•\-*]\s*/, ""))
                      .filter(Boolean)
                      .map((line, i) => (
                        <li
                          key={i}
                          data-ats-field="description"
                          style={{
                            fontSize: "10pt",
                            lineHeight: "1.4",
                            color: "#333333",
                            marginBottom: "1mm",
                            listStyleType: "disc",
                          }}
                        >
                          {line}
                        </li>
                      ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        )}

        {/* ── EĞİTİM ── */}
        {educations.length > 0 && (
          <section data-ats-section="education" style={{ marginBottom: "7mm" }}>
            <SectionHeading tr="Eğitim" en="Education" />
            {educations.map((edu) => (
              <article
                key={edu.id}
                data-ats-entry="education"
                style={{ marginBottom: "4mm" }}
              >
                <h3
                  data-ats-field="degree"
                  style={{
                    fontSize: "11pt",
                    fontWeight: 700,
                    color: "#0a1930",
                    margin: "0 0 0.5mm",
                  }}
                >
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" — ")}
                </h3>
                <p style={{ fontSize: "10pt", color: "#555555", margin: 0 }}>
                  <span data-ats-field="school">{edu.school}</span>
                  {(edu.startDate || edu.endDate) && (
                    <>
                      <span> | </span>
                      <time
                        data-ats-field="date-range"
                        dateTime={edu.startDate && edu.startDate !== "present" ? edu.startDate : undefined}
                      >
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </time>
                    </>
                  )}
                </p>
              </article>
            ))}
          </section>
        )}

        {/* ── BECERİLER ── */}
        {skills.length > 0 && (
          <section data-ats-section="skills" style={{ marginBottom: "7mm" }}>
            <SectionHeading tr="Beceriler" en="Skills" />
            <p
              data-ats-field="skills"
              style={{
                fontSize: "10.5pt",
                color: "#333333",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {skills.join(" · ")}
            </p>
          </section>
        )}

        {/* ── SERTİFİKALAR ── */}
        {certificates.length > 0 && (
          <section data-ats-section="certifications" style={{ marginBottom: "7mm" }}>
            <SectionHeading tr="Sertifikalar" en="Certifications" />
            {certificates.map((cert) => (
              <article
                key={cert.id}
                data-ats-entry="certification"
                style={{ marginBottom: "3mm" }}
              >
                <h3
                  data-ats-field="certification-name"
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: 700,
                    color: "#0a1930",
                    margin: "0 0 0.5mm",
                  }}
                >
                  {cert.name}
                </h3>
                <p style={{ fontSize: "9.5pt", color: "#555555", margin: 0 }}>
                  <span data-ats-field="issuer">{cert.issuer}</span>
                  {cert.issueDate && (
                    <>
                      <span> | </span>
                      <time dateTime={cert.issueDate} data-ats-field="issue-date">
                        {formatDate(cert.issueDate)}
                      </time>
                    </>
                  )}
                  {cert.expiryDate && (
                    <>
                      <span> – </span>
                      <time dateTime={cert.expiryDate} data-ats-field="expiry-date">
                        {formatDate(cert.expiryDate)}
                      </time>
                    </>
                  )}
                </p>
                {cert.credentialId && (
                  <p style={{ fontSize: "9pt", color: "#777777", margin: "0.5mm 0 0" }}>
                    ID: <span data-ats-field="credential-id">{cert.credentialId}</span>
                  </p>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    data-ats-field="credential-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      fontSize: "9pt",
                      color: "#0052cc",
                      textDecoration: "underline",
                      marginTop: "0.5mm",
                    }}
                  >
                    {cert.credentialUrl}
                  </a>
                )}
              </article>
            ))}
          </section>
        )}

        {/* ── PROJELER ── */}
        {projects.length > 0 && (
          <section data-ats-section="projects" style={{ marginBottom: "7mm" }}>
            <SectionHeading tr="Projeler" en="Projects" />
            {projects.map((proj) => (
              <article
                key={proj.id}
                data-ats-entry="project"
                style={{ marginBottom: "5mm" }}
              >
                <h3
                  data-ats-field="project-name"
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: 700,
                    color: "#0a1930",
                    margin: "0 0 0.5mm",
                  }}
                >
                  {proj.name}
                  {proj.role && (
                    <span style={{ fontWeight: 400, color: "#555555" }}>
                      {" | "}{proj.role}
                    </span>
                  )}
                  {(proj.startDate || proj.endDate) && (
                    <span style={{ fontWeight: 400, color: "#555555" }}>
                      {" | "}
                      <time
                        data-ats-field="date-range"
                        dateTime={proj.startDate && proj.startDate !== "present" ? proj.startDate : undefined}
                      >
                        {formatDateRange(proj.startDate, proj.endDate)}
                      </time>
                    </span>
                  )}
                </h3>
                {proj.technologies && (
                  <p style={{ fontSize: "9.5pt", color: "#555555", margin: "0 0 1mm" }}>
                    <span data-ats-field="technologies">
                      Teknolojiler: {proj.technologies.replace(/,(?!\s)/g, ", ")}
                    </span>
                  </p>
                )}
                {proj.url && (
                  <a
                    href={proj.url}
                    data-ats-field="project-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      fontSize: "9pt",
                      color: "#0052cc",
                      textDecoration: "underline",
                      marginBottom: "1mm",
                    }}
                  >
                    {proj.url}
                  </a>
                )}
                {proj.description && (
                  <ul style={{ margin: 0, paddingLeft: "14px" }}>
                    {proj.description
                      .split("\n")
                      .map((line) => line.trim().replace(/^[•\-*]\s*/, ""))
                      .filter(Boolean)
                      .map((line, i) => (
                        <li
                          key={i}
                          data-ats-field="description"
                          style={{
                            fontSize: "10pt",
                            lineHeight: "1.4",
                            color: "#333333",
                            marginBottom: "1mm",
                            listStyleType: "disc",
                          }}
                        >
                          {line}
                        </li>
                      ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        )}

        {/* ── DİLLER ── */}
        {languages.length > 0 && (
          <section data-ats-section="languages">
            <SectionHeading tr="Diller" en="Languages" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {languages.map((lang) => (
                <li
                  key={lang.id}
                  data-ats-entry="language"
                  style={{
                    fontSize: "10.5pt",
                    color: "#333333",
                    marginBottom: "1mm",
                  }}
                >
                  <span data-ats-field="language-name" style={{ fontWeight: 600 }}>
                    {lang.name}
                  </span>
                  {": "}
                  <span data-ats-field="language-level">{lang.level}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}

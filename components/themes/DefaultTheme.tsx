"use client";

import { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import EditableText from "@/components/ui/EditableText";
import {
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ImageUploader from "../ui/ImageUploader";

export default function DefaultTheme() {
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
    <div
      className="w-full min-h-[297mm] relative overflow-hidden"
      style={{ background: "#080806", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .et-white input,.et-white textarea,.et-white span{color:#ffffff!important}
        .et-amber input,.et-amber textarea,.et-amber span{color:#f59e0b!important}
        .et-cream input,.et-cream textarea,.et-cream span{color:#fef3c7!important}
        .et-muted input,.et-muted textarea,.et-muted span{color:rgba(253,230,138,0.55)!important}
        .et-body input,.et-body textarea,.et-body span{color:rgba(255,255,255,0.62)!important}
        .et-dark input,.et-dark textarea,.et-dark span{color:#92400e!important}
      `}</style>

      {/* ════════ HERO BAND ════════ */}
      <div
        className="relative w-full"
        style={{
          background:
            "linear-gradient(108deg,#0a0a08 0%,#1c1200 45%,#0a0a08 100%)",
          borderBottom: "1px solid rgba(245,158,11,0.18)",
        }}
      >
        {/* ambient */}
        <div
          className="absolute inset-0 pointer-events-none print:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 52% -10%,rgba(245,158,11,0.14) 0%,transparent 55%)",
          }}
        />
        {/* top line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg,transparent 0%,#f59e0b 35%,#fbbf24 50%,#f59e0b 65%,transparent 100%)",
          }}
        />

        <div
          className="relative z-10 flex items-end"
          style={{ padding: "11mm 12mm 0", gap: "9mm" }}
        >
          {/* ─ Photo ─ */}
          <div className="shrink-0" style={{ marginBottom: -1 }}>
            <div
              style={{
                padding: 3,
                background: "linear-gradient(160deg,#f59e0b,#78350f)",
                borderRadius: "6px 6px 0 0",
              }}
            >
              <div
                style={{
                  background: "#0a0a08",
                  borderRadius: "4px 4px 0 0",
                  padding: "3px 3px 0 3px",
                }}
              >
                <ImageUploader className="w-[26mm] h-[32mm] object-cover" />
              </div>
            </div>
          </div>

          {/* ─ Name block ─ */}
          <div className="flex-1" style={{ paddingBottom: "10mm" }}>
            {/* logo watermark */}
            <div
              className="flex items-center gap-2 mb-4"
              style={{ opacity: 0.2 }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: "linear-gradient(135deg,#f59e0b,#b45309)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L5 1.5L9 9H1Z" fill="white" opacity="0.9" />
                  <path
                    d="M3.5 9L5 5.5L6.5 9H3.5Z"
                    fill="white"
                    opacity="0.4"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f59e0b",
                }}
              >
                c<span style={{ color: "#fbbf24" }}>VIP</span>
              </span>
            </div>

            {/* name */}
            <div
              className="et-white"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "2.9rem",
                lineHeight: 1,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              <EditableText
                value={personalInfo.fullName}
                onChange={(v) => updatePersonalInfo({ fullName: v })}
                placeholder="Ad Soyad"
                className="block"
              />
            </div>

            {/* title */}
            <div
              className="et-amber"
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: "8mm",
              }}
            >
              <EditableText
                value={personalInfo.jobTitle}
                onChange={(v) => updatePersonalInfo({ jobTitle: v })}
                placeholder="Pozisyon Unvanı"
                className="block"
              />
            </div>

            {/* contact row */}
            <div
              className="flex flex-wrap items-center"
              style={{ gap: "5px 18px" }}
            >
              {[
                {
                  icon: <Mail style={{ width: 10, height: 10 }} />,
                  field: "email",
                  placeholder: "eposta@adres.com",
                },
                {
                  icon: <Phone style={{ width: 10, height: 10 }} />,
                  field: "phone",
                  placeholder: "+90 555 000 0000",
                },
                {
                  icon: <MapPin style={{ width: 10, height: 10 }} />,
                  field: "location",
                  placeholder: "Şehir, Ülke",
                },
                {
                  icon: <FaLinkedin style={{ width: 10, height: 10 }} />,
                  field: "linkedin",
                  placeholder: "linkedin.com/in/...",
                },
                {
                  icon: <FaGithub style={{ width: 10, height: 10 }} />,
                  field: "github",
                  placeholder: "github.com/...",
                },
              ].map(({ icon, field, placeholder }) => (
                <div
                  key={field}
                  className="flex items-center gap-[5px]"
                  style={{ color: "rgba(245,158,11,0.45)" }}
                >
                  {icon}
                  <div
                    className="et-muted"
                    style={{ fontSize: 10, fontWeight: 500 }}
                  >
                    <EditableText
                      value={(personalInfo as any)[field]}
                      onChange={(v) =>
                        updatePersonalInfo({ [field]: v } as any)
                      }
                      placeholder={placeholder}
                      className="block"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─ Summary ─ */}
          <div
            className="shrink-0"
            style={{
              width: "62mm",
              paddingBottom: "10mm",
              borderLeft: "1px solid rgba(245,158,11,0.15)",
              paddingLeft: "8mm",
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(245,158,11,0.38)",
                marginBottom: 8,
              }}
            >
              Profil
            </div>
            <div
              className="et-body"
              style={{ fontSize: 10.5, lineHeight: 1.8 }}
            >
              <EditableText
                value={personalInfo.summary}
                onChange={(v) => updatePersonalInfo({ summary: v })}
                placeholder="Kendinizi tanıtan güçlü ve özlü bir paragraf yazın..."
                className="block"
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ════════ ANA GÖVDE ════════ */}
      <div className="flex w-full" style={{ minHeight: "calc(297mm - 82mm)" }}>
        {/* ── Sol Sütun: Yetenekler + Eğitim ── */}
        <div
          className="flex flex-col shrink-0"
          style={{
            width: "52mm",
            background: "#0b0b09",
            borderRight: "1px solid rgba(245,158,11,0.1)",
            padding: "9mm 7mm",
            gap: "7mm",
          }}
        >
          {/* Yetenekler */}
          <div>
            <div
              className="flex items-center gap-2 mb-4"
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(245,158,11,0.38)",
              }}
            >
              Yetenekler
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(245,158,11,0.1)" }}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              {skills.map((skill, i) => (
                <div key={i} className="group relative flex items-center gap-2">
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        i % 3 === 0
                          ? "#f59e0b"
                          : i % 3 === 1
                            ? "rgba(245,158,11,0.4)"
                            : "rgba(245,158,11,0.15)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "rgba(253,230,138,0.78)",
                    }}
                  >
                    {skill}
                  </span>
                  {isEditMode && (
                    <button
                      onClick={() =>
                        updateSkills(skills.filter((s) => s !== skill))
                      }
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                      style={{ color: "#ef4444" }}
                    >
                      <Trash2 style={{ width: 10, height: 10 }} />
                    </button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="+ Ekle (Enter)"
                  className="outline-none w-full mt-1 print:hidden"
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    background: "transparent",
                    border: "1px dashed rgba(245,158,11,0.22)",
                    color: "rgba(245,158,11,0.5)",
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(245,158,11,0.07)" }} />

          {/* Eğitim */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex items-center gap-2"
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(245,158,11,0.38)",
                }}
              >
                <GraduationCap
                  style={{ width: 10, height: 10, color: "#f59e0b" }}
                />
                Eğitim
              </div>
              {isEditMode && (
                <button
                  onClick={addEducation}
                  className="print:hidden"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.18)",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  + Ekle
                </button>
              )}
            </div>
            <div className="flex flex-col gap-5">
              {educations.map((edu) => (
                <div key={edu.id} className="relative group">
                  {isEditMode && (
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                      style={{ color: "#ef4444" }}
                    >
                      <Trash2 style={{ width: 10, height: 10 }} />
                    </button>
                  )}
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#f59e0b",
                      letterSpacing: "0.05em",
                      marginBottom: 3,
                    }}
                  >
                    <span>{edu.startDate || "—"}</span>
                    <span
                      style={{ color: "rgba(245,158,11,0.3)", margin: "0 3px" }}
                    >
                      ›
                    </span>
                    <span>{edu.endDate || "—"}</span>
                  </div>
                  <div
                    className="et-cream"
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      lineHeight: 1.25,
                      marginBottom: 3,
                    }}
                  >
                    <EditableText
                      value={edu.school}
                      onChange={(v) => updateEducation(edu.id, { school: v })}
                      placeholder="Okul / Üniversite"
                      className="block"
                    />
                  </div>
                  <div
                    className="et-muted"
                    style={{ fontSize: 10, fontWeight: 500 }}
                  >
                    <EditableText
                      value={edu.degree}
                      onChange={(v) => updateEducation(edu.id, { degree: v })}
                      placeholder="Derece"
                      className="inline"
                    />
                    <span
                      style={{ color: "rgba(245,158,11,0.2)", margin: "0 4px" }}
                    >
                      ·
                    </span>
                    <EditableText
                      value={edu.fieldOfStudy}
                      onChange={(v) =>
                        updateEducation(edu.id, { fieldOfStudy: v })
                      }
                      placeholder="Bölüm"
                      className="inline"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sağ Sütun: Deneyim ── */}
        <div
          className="flex-1 flex flex-col"
          style={{ padding: "9mm 11mm", gap: "6mm", position: "relative" }}
        >
          {/* ruled lines */}
          <div
            className="absolute inset-0 pointer-events-none print:hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.022) 1px,transparent 1px)",
              backgroundSize: "100% 22px",
            }}
          />

          {/* Başlık */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                }}
              >
                <Briefcase style={{ width: 13, height: 13 }} />
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                }}
              >
                Deneyim
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(90deg,rgba(245,158,11,0.35),transparent)",
                  minWidth: 20,
                }}
              />
            </div>
            {isEditMode && (
              <button
                onClick={addExperience}
                className="print:hidden flex items-center gap-1"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#0a0a08",
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  padding: "4px 10px",
                  borderRadius: 5,
                  boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
                }}
              >
                <Plus style={{ width: 10, height: 10 }} /> EKLE
              </button>
            )}
          </div>

          {/* Kartlar */}
          <div className="relative z-10 flex flex-col" style={{ gap: "5mm" }}>
            {experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="relative group"
                style={{
                  background:
                    idx % 2 === 0 ? "rgba(245,158,11,0.03)" : "transparent",
                  border: "1px solid rgba(245,158,11,0.08)",
                  borderRadius: 6,
                  padding: "5mm 5mm 4mm",
                }}
              >
                {isEditMode && (
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 style={{ width: 11, height: 11 }} />
                  </button>
                )}

                <div className="flex items-start justify-between gap-3 mb-[5px]">
                  <div
                    className="et-white flex-1"
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 14,
                      fontWeight: 700,
                      fontStyle: "italic",
                      lineHeight: 1.2,
                    }}
                  >
                    <EditableText
                      value={exp.position}
                      onChange={(v) =>
                        updateExperience(exp.id, { position: v })
                      }
                      placeholder="Pozisyon Adı"
                      className="block"
                    />
                  </div>
                  <div
                    className="et-dark flex items-center gap-1 shrink-0"
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      padding: "2px 8px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <EditableText
                      value={exp.startDate}
                      onChange={(v) =>
                        updateExperience(exp.id, { startDate: v })
                      }
                      placeholder="2020"
                      className="w-8 text-right bg-transparent"
                    />
                    <span style={{ color: "rgba(180,83,9,0.5)" }}>–</span>
                    <EditableText
                      value={exp.endDate}
                      onChange={(v) => updateExperience(exp.id, { endDate: v })}
                      placeholder="Günümüz"
                      className="w-14 bg-transparent"
                    />
                  </div>
                </div>

                <div
                  className="et-amber flex items-center gap-[5px] mb-[5px]"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      flexShrink: 0,
                    }}
                  />
                  <EditableText
                    value={exp.company}
                    onChange={(v) => updateExperience(exp.id, { company: v })}
                    placeholder="Şirket Adı"
                    className="block"
                  />
                </div>

                <div
                  className="et-body"
                  style={{
                    fontSize: 11,
                    lineHeight: 1.75,
                    borderTop: "1px solid rgba(245,158,11,0.07)",
                    paddingTop: 5,
                  }}
                >
                  <EditableText
                    value={exp.description}
                    onChange={(v) =>
                      updateExperience(exp.id, { description: v })
                    }
                    placeholder="Rolünüzü, başarılarınızı ve kullandığınız teknolojileri açıklayın..."
                    className="block text-justify"
                    isMultiline={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ FOOTER ════════ */}
      <div
        style={{
          borderTop: "1px solid rgba(245,158,11,0.12)",
          padding: "4mm 12mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(245,158,11,0.025)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: 2,
              background: "linear-gradient(135deg,#f59e0b,#b45309)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
              <path d="M1 7L4 1.5L7 7H1Z" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(245,158,11,0.25)",
            }}
          >
            c<span style={{ color: "rgba(251,191,36,0.25)" }}>VIP</span>
          </span>
        </div>
        <span
          style={{
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,158,11,0.18)",
          }}
        >
          Premium Resume
        </span>
      </div>
    </div>
  );
}

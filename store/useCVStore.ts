import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CVData,
  PersonalInfo,
  Experience,
  Education,
  Certificate,
  Project,
  Language,
} from "../types/cv";

interface CVStore {
  cvData: CVData;
  isEditMode: boolean;
  activeThemeId: string;
  _hasHydrated: boolean;
  setHasHydrated: () => void;
  toggleEditMode: () => void;
  setTheme: (id: string) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;

  /* Deneyim */
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (from: number, to: number) => void;

  /* Eğitim */
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducations: (from: number, to: number) => void;

  /* Beceriler */
  updateSkills: (skills: string[]) => void;

  /* Sertifikalar */
  addCertificate: () => void;
  updateCertificate: (id: string, data: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;
  reorderCertificates: (from: number, to: number) => void;

  /* Projeler */
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (from: number, to: number) => void;

  /* Diller */
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  clearAllData: () => void;
}

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    photo: "",
    showPhoto: false,
  },
  experiences: [],
  educations: [],
  skills: [],
  certificates: [],
  projects: [],
  languages: [],
  theme: { color: "", font: "" },
};

/**
 * Eski tarih string'lerini ("Ocak 2023", "01/2023", "2023") ISO "YYYY-MM" formatına çevirir.
 * Başarısız olursa boş string döner.
 */
const legacyDateToIso = (v: unknown): string => {
  if (typeof v !== "string" || !v.trim()) return "";
  const trimmed = v.trim().toLowerCase();

  if (/^(günümüz|present|current|halen|devam ediyor)$/i.test(trimmed))
    return "present";

  // Zaten ISO ise
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(v)) return v;

  // Sadece yıl
  if (/^\d{4}$/.test(v)) return `${v}-01`;

  // MM/YYYY veya M/YYYY
  const numericMatch = v.match(/^(\d{1,2})\/(\d{4})$/);
  if (numericMatch) {
    const m = parseInt(numericMatch[1], 10);
    return `${numericMatch[2]}-${String(m).padStart(2, "0")}`;
  }

  // "Ocak 2023", "January 2023", "Jan 2023"
  const TR = [
    "ocak",
    "şubat",
    "mart",
    "nisan",
    "mayıs",
    "haziran",
    "temmuz",
    "ağustos",
    "eylül",
    "ekim",
    "kasım",
    "aralık",
  ];
  const EN_FULL = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const EN_SHORT = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const parts = v.trim().split(/\s+/);
  if (parts.length === 2) {
    const monthName = parts[0].toLowerCase();
    const year = parts[1];
    if (!/^\d{4}$/.test(year)) return "";

    let idx = TR.indexOf(monthName);
    if (idx === -1) idx = EN_FULL.indexOf(monthName);
    if (idx === -1) idx = EN_SHORT.indexOf(monthName);
    if (idx !== -1) return `${year}-${String(idx + 1).padStart(2, "0")}`;
  }

  return "";
};

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      isEditMode: true,
      activeThemeId: "modern-split",
      _hasHydrated: false,
      setHasHydrated: () => set({ _hasHydrated: true }),

      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      setTheme: (id) => set({ activeThemeId: id }),

      updatePersonalInfo: (data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, ...data },
          },
        })),

      /* Deneyim */
      addExperience: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: [
              ...state.cvData.experiences,
              {
                id: crypto.randomUUID(),
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
          },
        })),
      updateExperience: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: state.cvData.experiences.map((e) =>
              e.id === id ? { ...e, ...data } : e,
            ),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experiences: state.cvData.experiences.filter((e) => e.id !== id),
          },
        })),
      reorderExperiences: (from, to) =>
        set((state) => {
          const arr = [...state.cvData.experiences];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { cvData: { ...state.cvData, experiences: arr } };
        }),

      /* Eğitim */
      addEducation: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            educations: [
              ...state.cvData.educations,
              {
                id: crypto.randomUUID(),
                school: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
              },
            ],
          },
        })),
      updateEducation: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            educations: state.cvData.educations.map((e) =>
              e.id === id ? { ...e, ...data } : e,
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            educations: state.cvData.educations.filter((e) => e.id !== id),
          },
        })),
      reorderEducations: (from, to) =>
        set((state) => {
          const arr = [...state.cvData.educations];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { cvData: { ...state.cvData, educations: arr } };
        }),

      updateSkills: (skills) =>
        set((state) => ({ cvData: { ...state.cvData, skills } })),

      /* Sertifikalar */
      addCertificate: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certificates: [
              ...state.cvData.certificates,
              {
                id: crypto.randomUUID(),
                name: "",
                issuer: "",
                issueDate: "",
                expiryDate: "",
                credentialId: "",
                credentialUrl: "",
              },
            ],
          },
        })),
      updateCertificate: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certificates: state.cvData.certificates.map((c) =>
              c.id === id ? { ...c, ...data } : c,
            ),
          },
        })),
      removeCertificate: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certificates: state.cvData.certificates.filter((c) => c.id !== id),
          },
        })),
      reorderCertificates: (from, to) =>
        set((state) => {
          const arr = [...state.cvData.certificates];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { cvData: { ...state.cvData, certificates: arr } };
        }),

      /* Projeler */
      addProject: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: [
              ...state.cvData.projects,
              {
                id: crypto.randomUUID(),
                name: "",
                role: "",
                startDate: "",
                endDate: "",
                url: "",
                technologies: "",
                description: "",
              },
            ],
          },
        })),
      updateProject: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.map((p) =>
              p.id === id ? { ...p, ...data } : p,
            ),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.filter((p) => p.id !== id),
          },
        })),
      reorderProjects: (from, to) =>
        set((state) => {
          const arr = [...state.cvData.projects];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          return { cvData: { ...state.cvData, projects: arr } };
        }),

      /* Diller */
      addLanguage: () =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: [
              ...state.cvData.languages,
              { id: crypto.randomUUID(), name: "", level: "B2" },
            ],
          },
        })),
      updateLanguage: (id, data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.map((l) =>
              l.id === id ? { ...l, ...data } : l,
            ),
          },
        })),
      removeLanguage: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.filter((l) => l.id !== id),
          },
        })),

      clearAllData: () =>
        set({
          cvData: initialCVData,
          isEditMode: true,
          activeThemeId: "modern-split",
        }),
    }),
    {
      name: "cv-storage-v5",
      version: 5,
      migrate: (persistedState: unknown) => {
        const state = persistedState as {
          cvData?: Partial<CVData>;
          isEditMode?: boolean;
          activeThemeId?: string;
        };
        const old = state?.cvData ?? {};

        return {
          cvData: {
            personalInfo: {
              ...initialCVData.personalInfo,
              ...(old.personalInfo ?? {}),
            },
            experiences: (old.experiences ?? []).map((e) => ({
              ...e,
              startDate: legacyDateToIso(e.startDate),
              endDate: legacyDateToIso(e.endDate),
            })),
            educations: (old.educations ?? []).map((e) => ({
              ...e,
              startDate: legacyDateToIso(e.startDate),
              endDate: legacyDateToIso(e.endDate),
            })),
            skills: old.skills ?? [],
            certificates: (old.certificates ?? []).map((c) => ({
              ...c,
              issueDate: legacyDateToIso(c.issueDate),
              expiryDate: legacyDateToIso(c.expiryDate),
            })),
            projects: (old.projects ?? []).map((p) => ({
              ...p,
              startDate: legacyDateToIso(p.startDate),
              endDate: legacyDateToIso(p.endDate),
            })),
            languages: old.languages ?? [],
            theme: old.theme ?? { color: "", font: "" },
          },
          isEditMode: state?.isEditMode ?? true,
          activeThemeId: state?.activeThemeId ?? "modern-split",
        } as unknown as CVStore;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    },
  ),
);

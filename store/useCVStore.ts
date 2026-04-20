import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CVData, PersonalInfo, Experience, Education } from "../types/cv";

interface CVStore {
  cvData: CVData;
  isEditMode: boolean;
  activeThemeId: string;
  toggleEditMode: () => void;
  setTheme: (id: string) => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
}

const initialCVData: CVData = {
  // YENİ: photo: '' eklendi
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
  },
  experiences: [],
  educations: [],
  skills: [],
  theme: { color: "", font: "" },
};

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      isEditMode: true,
      activeThemeId: "modern-split",

      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

      setTheme: (id) => set({ activeThemeId: id }),

      updatePersonalInfo: (data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, ...data },
          },
        })),

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

      updateSkills: (skills) =>
        set((state) => ({ cvData: { ...state.cvData, skills } })),
    }),
    { name: "cv-storage-v3" },
  ),
);

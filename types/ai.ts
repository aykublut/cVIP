export type ATSSeverity = "error" | "warning" | "tip";

export type ATSSection =
  | "personalInfo"
  | "experience"
  | "education"
  | "skills"
  | "certificates"
  | "projects"
  | "languages";

export interface ATSSuggestion {
  id: string;
  section: ATSSection;
  severity: ATSSeverity;
  title: string;
  message: string;
  fix: string;
  entryId?: string;
}

export interface ATSLayerScore {
  label: string;
  score: number;
  maxScore: number;
  color: string;
}

export interface ATSScoreResult {
  total: number;
  layers: {
    ats: ATSLayerScore;
    content: ATSLayerScore;
    completeness: ATSLayerScore;
    professionalism: ATSLayerScore;
  };
  suggestions: ATSSuggestion[];
}

export type JobMatchRecommendationType = "add-skill" | "rephrase" | "emphasize";

export interface JobMatchRecommendation {
  type: JobMatchRecommendationType;
  message: string;
  suggestion: string;
}

export interface JobMatchResult {
  matchScore: number;
  missingKeywords: string[];
  presentKeywords: string[];
  recommendations: JobMatchRecommendation[];
}

export interface AnalysisResult {
  suggestions: ATSSuggestion[];
  overallFeedback: string;
}

export type FieldType = "summary" | "experience" | "project";

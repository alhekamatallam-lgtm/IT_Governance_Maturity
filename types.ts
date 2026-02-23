
export interface Question {
  text: string;
}

export interface MaturityGuidance {
  level: number;
  statement: string;
}

export interface Criterion {
  text: string;
  assessmentFocus?: string;
  referenceLevel?: number;
  formalStatement?: string;
  improvementOpportunities?: string;
  relatedQuestion?: string;
}

export interface Section {
  title: string;
  criteria: Criterion[];
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  questions: Question[];
}

export interface MaturityLevel {
  level: number;
  title:string;
  description: string;
}

export interface Result {
  id: string;
  subject: string;
  score: number;
  fullMark: number;
}

export interface EvaluatorInfo {
  name: string;
  email: string;
  mobile: string;
}

export interface DomainStat {
  id: string;
  title: string;
  average: number;
}

export interface GlobalStatsData {
  totalAssessments: number;
  overallAverage: number;
  domainStats: DomainStat[];
}

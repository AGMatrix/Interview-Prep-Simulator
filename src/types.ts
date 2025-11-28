// import { DateTime, Str } from "chanfana";
// import type { Context } from "hono";
// import { z } from "zod";

// export type AppContext = Context<{ Bindings: Env }>;

// export const Task = z.object({
// 	name: Str({ example: "lorem" }),
// 	slug: Str(),
// 	description: Str({ required: false }),
// 	completed: z.boolean().default(false),
// 	due_date: DateTime(),
// });

// Core Types
export interface Env {
  AI: Ai;
  DB: D1Database;
  RESUME_BUCKET?: R2Bucket;
  AUDIO_BUCKET?: R2Bucket;
  SESSION_CACHE: KVNamespace;
  VECTORIZE?: VectorizeIndex;
  USER_MEMORY: DurableObjectNamespace;
}

export type InterviewType = 
  | 'SDE' 
  | 'SDE_INTERN' 
  | 'CLOUD_ENGINEER' 
  | 'DATA_ENGINEER' 
  | 'AI_ML_ENGINEER' 
  | 'SECURITY' 
  | 'DEVOPS';

export type ExperienceLevel = 0 | 1 | 2 | 5; // 0=intern, 1=junior, 2=mid, 5=senior

export type RoundType = 'BEHAVIORAL' | 'TECHNICAL' | 'CODING' | 'SYSTEM_DESIGN';

export interface Question {
  id: string;
  type: RoundType;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  category: string;
  expectedAnswer?: string;
  followUpHints?: string[];
  evaluationCriteria: {
    correctness: string;
    depth: string;
    communication: string;
  };
}

export interface InterviewSession {
  id: string;
  userId: string;
  interviewType: InterviewType;
  experienceLevel: ExperienceLevel;
  currentRound: RoundType;
  rounds: RoundType[];
  conversationHistory: Message[];
  currentQuestion: Question | null;
  evaluations: Evaluation[];
  status: 'active' | 'completed' | 'paused';
  startedAt: string;
  endedAt?: string;
}

export interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface Evaluation {
  questionId: string;
  scores: {
    correctness: number; // 0-10
    depth: number;
    clarity: number;
    completeness: number;
  };
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  suggestedImprovement: string;
  needsFollowUp: boolean;
  probeAreas: string[];
}

export interface SkillSet {
  languages: string[];
  frameworks: string[];
  tools: string[];
  cloud: string[];
  databases: string[];
  soft: string[];
}

export interface JDAnalysis {
  role: string;
  company: string;
  experienceLevel: string;
  requiredSkills: {
    technical: string[];
    soft: string[];
  };
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: {
    education: string[];
    experience: string[];
  };
  interviewFocus: string[];
}

export interface UserMemory {
  userId: string;
  resume: ResumeData | null;
  weakAreas: WeakArea[];
  skillProgress: Record<string, SkillProgress>;
  sessions: SessionSummary[];
  targetRole: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeakArea {
  skill: string;
  category: string;
  confidenceScore: number; // 0-1
  lastPracticed: string;
  improvementTips: string[];
}

export interface SkillProgress {
  skill: string;
  initialScore: number;
  currentScore: number;
  practiceCount: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  gpa?: string;
  coursework?: string[];
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  impact?: string;
  link?: string;
}

export interface SessionSummary {
  sessionId: string;
  date: string;
  interviewType: string;
  experienceLevel: number;
  overallScore: number;
  roundScores?: {
    behavioral?: number;
    technical?: number;
    coding?: number;
    systemDesign?: number;
  };
  strengths: string[];
  weaknesses: string[];
  duration?: number;
}

export interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  education: Education[];
  experience: Experience[];
  skills: SkillSet;
  projects: Project[];
  certifications: string[];
}
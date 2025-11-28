// API Client for Interview Prep Simulator

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export interface InterviewSession {
  id: string;
  userId: string;
  interviewType: string;
  experienceLevel: number;
  currentRound: string;
  rounds: string[];
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

export interface Question {
  id: string;
  type: string;
  difficulty: string;
  text: string;
  category: string;
}

export interface Evaluation {
  scores: {
    correctness: number;
    depth: number;
    clarity: number;
    completeness: number;
  };
  feedback: string;
}

export interface ResumeData {
  id: string;
  name: string;
  email: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    cloud: string[];
    databases: string[];
  };
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Session Management
  async startSession(params: {
    userId: string;
    interviewType: string;
    experienceLevel: number;
    rounds?: string[];
    resumeId?: string;
    jdId?: string;
  }): Promise<{ sessionId: string; firstQuestion: string; session: InterviewSession }> {
    const response = await fetch(`${this.baseURL}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to start session: ${response.statusText}`);
    }

    return await response.json();
  }

  async getSession(sessionId: string): Promise<InterviewSession> {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}`);

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.statusText}`);
    }

    return await response.json();
  }

  async sendMessage(sessionId: string, message: string, audio?: string): Promise<{
    interviewerResponse: string;
    evaluation: Evaluation;
    sessionComplete: boolean;
  }> {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, audio }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return await response.json();
  }

  async endSession(sessionId: string): Promise<{
    sessionId: string;
    finalEvaluation: any;
  }> {
    const response = await fetch(`${this.baseURL}/api/session/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to end session: ${response.statusText}`);
    }

    return await response.json();
  }

  // Resume Management
  async uploadResume(file: File, userId: string): Promise<{ id: string; data: ResumeData }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch(`${this.baseURL}/api/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload resume: ${response.statusText}`);
    }

    return await response.json();
  }

  async getResume(resumeId: string): Promise<ResumeData> {
    const response = await fetch(`${this.baseURL}/api/resume/${resumeId}`);

    if (!response.ok) {
      throw new Error(`Failed to get resume: ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserResumes(userId: string): Promise<{ resumes: Array<{ id: string; filename: string }> }> {
    const response = await fetch(`${this.baseURL}/api/resume/user/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to get resumes: ${response.statusText}`);
    }

    return await response.json();
  }

  // Job Description
  async analyzeJD(params: { text?: string; url?: string; userId: string }): Promise<{
    id: string;
    analysis: any;
  }> {
    const response = await fetch(`${this.baseURL}/api/jd/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to analyze JD: ${response.statusText}`);
    }

    return await response.json();
  }

  async compareResumeToJD(resumeId: string, jdId: string): Promise<{
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  }> {
    const response = await fetch(`${this.baseURL}/api/jd/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId, jdId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to compare: ${response.statusText}`);
    }

    return await response.json();
  }

  // User Memory
  async getUserMemory(userId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/memory/${userId}/memory`);

    if (!response.ok) {
      throw new Error(`Failed to get memory: ${response.statusText}`);
    }

    return await response.json();
  }

  async getAnalytics(userId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/memory/${userId}/analytics`);

    if (!response.ok) {
      throw new Error(`Failed to get analytics: ${response.statusText}`);
    }

    return await response.json();
  }

  async getRecommendations(userId: string): Promise<{ recommendations: string[] }> {
    const response = await fetch(`${this.baseURL}/api/memory/${userId}/recommendations`);

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    return await response.json();
  }

  // Voice
  async speechToText(audioBlob: Blob): Promise<{ text: string; confidence: number }> {
    const response = await fetch(`${this.baseURL}/api/voice/stt`, {
      method: 'POST',
      headers: { 'Content-Type': 'audio/webm' },
      body: audioBlob,
    });

    if (!response.ok) {
      throw new Error(`Failed STT: ${response.statusText}`);
    }

    return await response.json();
  }

  async textToSpeech(text: string, voice: string = 'professional'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      throw new Error(`Failed TTS: ${response.statusText}`);
    }

    return await response.blob();
  }

  async getAvailableVoices(): Promise<{ voices: Array<{ id: string; name: string; description: string }> }> {
    const response = await fetch(`${this.baseURL}/api/voice/voices`);

    if (!response.ok) {
      throw new Error(`Failed to get voices: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const apiClient = new APIClient();
export default apiClient;

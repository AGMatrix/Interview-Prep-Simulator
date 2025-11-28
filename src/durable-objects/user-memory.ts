import { DurableObject } from 'cloudflare:workers';
import { ResumeData, SessionSummary as SessionSummaryType, Env } from '../types';

interface UserMemory {
  userId: string;
  personalInfo: {
    name: string;
    email: string;
    targetRole: string | null;
    experienceYears: number;
  };
  resume: ResumeData | null;
  weakAreas: WeakArea[];
  skillProgress: Map<string, SkillProgress>;
  sessionHistory: SessionSummary[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

interface WeakArea {
  skill: string;
  category: 'technical' | 'behavioral' | 'coding' | 'system_design';
  severity: 'low' | 'medium' | 'high';
  detectedIn: string[]; // session IDs
  improvementPlan: string[];
  lastPracticed: string | null;
  practiceCount: number;
  trendDirection: 'improving' | 'stable' | 'declining';
}

interface SkillProgress {
  skill: string;
  category: string;
  initialScore: number; // 0-10
  currentScore: number; // 0-10
  historicalScores: { date: string; score: number }[];
  practiceCount: number;
  lastPracticed: string;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface SessionSummary {
  sessionId: string;
  date: string;
  interviewType: string;
  experienceLevel: number;
  overallScore: number;
  roundScores: {
    behavioral?: number;
    technical?: number;
    coding?: number;
    systemDesign?: number;
  };
  strengths: string[];
  weaknesses: string[];
  duration: number; // minutes
}

interface UserPreferences {
  voiceEnabled: boolean;
  selectedVoice: string;
  interruptionsEnabled: boolean;
  detailedFeedback: boolean;
  focusAreas: string[];
}

export class UserMemoryDO extends DurableObject {
  private memory: UserMemory | null = null;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  /**
   * Main fetch handler for the Durable Object
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case '/memory':
          return await this.getMemory();
        
        case '/initialize':
          return await this.initialize(await request.json());
        
        case '/update':
          return await this.updateMemory(await request.json());
        
        case '/weak-areas':
          return await this.getWeakAreas();
        
        case '/weak-areas/update':
          return await this.updateWeakAreas(await request.json());
        
        case '/skills/progress':
          return await this.getSkillProgress();
        
        case '/skills/update':
          return await this.updateSkillProgress(await request.json());
        
        case '/session/add':
          return await this.addSession(await request.json());
        
        case '/analytics':
          return await this.getAnalytics();
        
        case '/recommendations':
          return await this.getRecommendations();
        
        default:
          return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      console.error('UserMemoryDO Error:', error);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  /**
   * Load memory from storage or create new
   */
  private async loadMemory(): Promise<UserMemory> {
    if (this.memory) {
      return this.memory;
    }

    const stored = await this.state.storage.get<UserMemory>('memory');
    if (stored) {
      this.memory = stored;
      return stored;
    }

    // Initialize new memory
    this.memory = {
      userId: this.state.id.toString(),
      personalInfo: {
        name: '',
        email: '',
        targetRole: null,
        experienceYears: 0,
      },
      resume: null,
      weakAreas: [],
      skillProgress: new Map(),
      sessionHistory: [],
      preferences: {
        voiceEnabled: true,
        selectedVoice: 'professional',
        interruptionsEnabled: true,
        detailedFeedback: true,
        focusAreas: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveMemory();
    return this.memory;
  }

  /**
   * Save memory to persistent storage
   */
  private async saveMemory(): Promise<void> {
    if (!this.memory) return;
    
    this.memory.updatedAt = new Date().toISOString();
    await this.state.storage.put('memory', this.memory);
  }

  /**
   * Get full memory
   */
  private async getMemory(): Promise<Response> {
    const memory = await this.loadMemory();
    return Response.json(memory);
  }

  /**
   * Initialize user memory
   */
  private async initialize(data: any): Promise<Response> {
    const memory = await this.loadMemory();
    
    if (data.personalInfo) {
      memory.personalInfo = { ...memory.personalInfo, ...data.personalInfo };
    }
    
    if (data.resume) {
      memory.resume = data.resume;
      // Extract initial skills
      await this.extractSkillsFromResume(data.resume);
    }
    
    await this.saveMemory();
    return Response.json({ success: true, memory });
  }

  /**
   * Update memory with new data
   */
  private async updateMemory(data: any): Promise<Response> {
    const memory = await this.loadMemory();
    
    if (data.resume) {
      memory.resume = data.resume;
      await this.extractSkillsFromResume(data.resume);
    }
    
    if (data.preferences) {
      memory.preferences = { ...memory.preferences, ...data.preferences };
    }
    
    await this.saveMemory();
    return Response.json({ success: true });
  }

  /**
   * Get weak areas
   */
  private async getWeakAreas(): Promise<Response> {
    const memory = await this.loadMemory();
    
    // Sort by severity and practice count
    const sortedWeakAreas = memory.weakAreas.sort((a, b) => {
      const severityWeight = { high: 3, medium: 2, low: 1 };
      const severityDiff = severityWeight[b.severity] - severityWeight[a.severity];
      
      if (severityDiff !== 0) return severityDiff;
      return a.practiceCount - b.practiceCount; // Less practiced first
    });
    
    return Response.json({ weakAreas: sortedWeakAreas });
  }

  /**
   * Update weak areas after a session
   */
  private async updateWeakAreas(data: {
    sessionId: string;
    newWeakAreas: string[];
    improvedAreas: string[];
  }): Promise<Response> {
    const memory = await this.loadMemory();
    
    // Add new weak areas
    for (const skill of data.newWeakAreas) {
      const existing = memory.weakAreas.find(wa => wa.skill === skill);
      
      if (existing) {
        // Update existing
        existing.detectedIn.push(data.sessionId);
        existing.severity = this.calculateSeverity(existing.detectedIn.length);
        existing.trendDirection = 'declining';
      } else {
        // Create new
        memory.weakAreas.push({
          skill,
          category: this.categorizeSkill(skill),
          severity: 'low',
          detectedIn: [data.sessionId],
          improvementPlan: await this.generateImprovementPlan(skill),
          lastPracticed: null,
          practiceCount: 0,
          trendDirection: 'stable',
        });
      }
    }
    
    // Update improved areas
    for (const skill of data.improvedAreas) {
      const weakArea = memory.weakAreas.find(wa => wa.skill === skill);
      
      if (weakArea) {
        weakArea.practiceCount++;
        weakArea.lastPracticed = new Date().toISOString();
        weakArea.trendDirection = 'improving';
        
        // Remove if improved enough
        if (weakArea.practiceCount >= 3 && weakArea.severity === 'low') {
          memory.weakAreas = memory.weakAreas.filter(wa => wa.skill !== skill);
        }
      }
    }
    
    await this.saveMemory();
    return Response.json({ success: true, weakAreas: memory.weakAreas });
  }

  /**
   * Get skill progress
   */
  private async getSkillProgress(): Promise<Response> {
    const memory = await this.loadMemory();
    
    const progressArray = Array.from(memory.skillProgress.entries()).map(([skill, progress]) => ({
      skill,
      ...progress,
    }));
    
    return Response.json({ skills: progressArray });
  }

  /**
   * Update skill progress after evaluation
   */
  private async updateSkillProgress(data: {
    evaluations: Array<{ skill: string; score: number }>;
  }): Promise<Response> {
    const memory = await this.loadMemory();
    
    for (const { skill, score } of data.evaluations) {
      const existing = memory.skillProgress.get(skill);
      
      if (existing) {
        // Update existing
        existing.currentScore = score;
        existing.historicalScores.push({
          date: new Date().toISOString(),
          score,
        });
        existing.practiceCount++;
        existing.lastPracticed = new Date().toISOString();
        existing.masteryLevel = this.calculateMasteryLevel(score);
      } else {
        // Create new
        memory.skillProgress.set(skill, {
          skill,
          category: this.categorizeSkill(skill),
          initialScore: score,
          currentScore: score,
          historicalScores: [{ date: new Date().toISOString(), score }],
          practiceCount: 1,
          lastPracticed: new Date().toISOString(),
          masteryLevel: this.calculateMasteryLevel(score),
        });
      }
    }
    
    await this.saveMemory();
    return Response.json({ success: true });
  }

  /**
   * Add completed session to history
   */
  private async addSession(data: SessionSummary): Promise<Response> {
    const memory = await this.loadMemory();
    
    memory.sessionHistory.push(data);
    
    // Keep only last 50 sessions
    if (memory.sessionHistory.length > 50) {
      memory.sessionHistory = memory.sessionHistory.slice(-50);
    }
    
    await this.saveMemory();
    return Response.json({ success: true });
  }

  /**
   * Get analytics and insights
   */
  private async getAnalytics(): Promise<Response> {
    const memory = await this.loadMemory();
    
    if (memory.sessionHistory.length === 0) {
      return Response.json({
        totalSessions: 0,
        message: 'No session history available',
      });
    }
    
    // Calculate statistics
    const totalSessions = memory.sessionHistory.length;
    const averageScore = memory.sessionHistory.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions;
    
    // Score trend
    const recentSessions = memory.sessionHistory.slice(-5);
    const recentAverage = recentSessions.reduce((sum, s) => sum + s.overallScore, 0) / recentSessions.length;
    const trend = recentAverage > averageScore ? 'improving' : 'declining';
    
    // Most practiced interview types
    const typeCounts = memory.sessionHistory.reduce((acc, s) => {
      acc[s.interviewType] = (acc[s.interviewType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Strengths (consistently good areas)
    const allStrengths = memory.sessionHistory.flatMap(s => s.strengths);
    const strengthCounts = allStrengths.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topStrengths = Object.entries(strengthCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);
    
    // Areas needing work
    const topWeakAreas = memory.weakAreas
      .slice(0, 5)
      .map(wa => ({
        skill: wa.skill,
        severity: wa.severity,
        practiceCount: wa.practiceCount,
      }));
    
    return Response.json({
      totalSessions,
      averageScore: averageScore.toFixed(2),
      recentAverage: recentAverage.toFixed(2),
      trend,
      interviewTypeCounts: typeCounts,
      topStrengths,
      weakAreas: topWeakAreas,
      skillProgress: Array.from(memory.skillProgress.values()),
    });
  }

  /**
   * Get personalized recommendations
   */
  private async getRecommendations(): Promise<Response> {
    const memory = await this.loadMemory();
    
    const recommendations: string[] = [];
    
    // Based on weak areas
    const highPriorityWeakAreas = memory.weakAreas.filter(wa => wa.severity === 'high');
    if (highPriorityWeakAreas.length > 0) {
      recommendations.push(
        `Focus on these critical areas: ${highPriorityWeakAreas.map(wa => wa.skill).join(', ')}`
      );
    }
    
    // Based on practice frequency
    const unpracticedAreas = memory.weakAreas
      .filter(wa => wa.practiceCount === 0)
      .slice(0, 3);
    if (unpracticedAreas.length > 0) {
      recommendations.push(
        `Start practicing: ${unpracticedAreas.map(wa => wa.skill).join(', ')}`
      );
    }
    
    // Based on session history
    if (memory.sessionHistory.length >= 3) {
      const lastThree = memory.sessionHistory.slice(-3);
      const averageRecent = lastThree.reduce((sum, s) => sum + s.overallScore, 0) / 3;
      
      if (averageRecent < 6) {
        recommendations.push('Consider taking a mock interview with longer preparation time');
      } else if (averageRecent > 8) {
        recommendations.push('Great progress! Try more challenging interview levels');
      }
    }
    
    // Based on target role
    if (memory.personalInfo.targetRole && memory.resume) {
      recommendations.push(
        `For ${memory.personalInfo.targetRole}: Focus on system design and scalability questions`
      );
    }
    
    return Response.json({ recommendations });
  }

  // ===== Helper Methods =====

  private async extractSkillsFromResume(resume: any): Promise<void> {
    const memory = await this.loadMemory();
    
    // Extract all skills from resume
    const allSkills = [
      ...(resume.skills?.languages || []),
      ...(resume.skills?.frameworks || []),
      ...(resume.skills?.tools || []),
      ...(resume.skills?.cloud || []),
      ...(resume.skills?.databases || []),
    ];
    
    // Initialize skill progress for each
    for (const skill of allSkills) {
      if (!memory.skillProgress.has(skill)) {
        memory.skillProgress.set(skill, {
          skill,
          category: this.categorizeSkill(skill),
          initialScore: 5, // Neutral starting point
          currentScore: 5,
          historicalScores: [],
          practiceCount: 0,
          lastPracticed: new Date().toISOString(),
          masteryLevel: 'intermediate',
        });
      }
    }
  }

  private categorizeSkill(skill: string): 'technical' | 'behavioral' | 'coding' | 'system_design' {
    const lowerSkill = skill.toLowerCase();
    
    if (lowerSkill.includes('leadership') || lowerSkill.includes('communication')) {
      return 'behavioral';
    }
    if (lowerSkill.includes('algorithm') || lowerSkill.includes('data structure')) {
      return 'coding';
    }
    if (lowerSkill.includes('architecture') || lowerSkill.includes('scalability')) {
      return 'system_design';
    }
    return 'technical';
  }

  private calculateSeverity(detectionCount: number): 'low' | 'medium' | 'high' {
    if (detectionCount >= 3) return 'high';
    if (detectionCount === 2) return 'medium';
    return 'low';
  }

  private calculateMasteryLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (score >= 9) return 'expert';
    if (score >= 7) return 'advanced';
    if (score >= 5) return 'intermediate';
    return 'beginner';
  }

  private async generateImprovementPlan(skill: string): Promise<string[]> {
    // In production, use LLM to generate personalized plan
    return [
      `Practice ${skill} fundamentals`,
      `Complete hands-on projects using ${skill}`,
      `Review common interview questions about ${skill}`,
    ];
  }
}
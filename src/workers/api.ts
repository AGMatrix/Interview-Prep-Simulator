import { Env, InterviewSession, Message } from '../types';
import { LLMService } from '../services/llm';

export class APIWorker {
  constructor(private env: Env) {}

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let response: Response;

      if (path.startsWith('/api/session')) {
        response = await this.handleSession(request, path);
      } else if (path.startsWith('/api/gap-analysis')) {
        response = await this.handleGapAnalysis(request);
      } else if (path.startsWith('/api/resume')) {
        response = await this.handleResume(request, path);
      } else if (path.startsWith('/api/jd')) {
        response = await this.handleJD(request, path);
      } else if (path.startsWith('/api/memory')) {
        response = await this.handleMemory(request, path);
      } else if (path.startsWith('/api/voice')) {
        response = await this.handleVoice(request, path);
      } else {
        response = new Response('Not Found', { status: 404 });
      }

      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('API Error:', error);
      return Response.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  private async handleSession(request: Request, path: string): Promise<Response> {
    if (path === '/api/session/start' && request.method === 'POST') {
      return await this.startSession(request);
    } else if (path.match(/\/api\/session\/[^/]+$/) && request.method === 'GET') {
      const sessionId = path.split('/').pop()!;
      return await this.getSession(sessionId);
    } else if (path.match(/\/api\/session\/[^/]+\/message$/) && request.method === 'POST') {
      const sessionId = path.split('/')[3];
      return await this.sendMessage(request, sessionId);
    } else if (path.match(/\/api\/session\/[^/]+$/) && request.method === 'DELETE') {
      const sessionId = path.split('/').pop()!;
      return await this.endSession(sessionId);
    }

    return new Response('Not Found', { status: 404 });
  }

  private async startSession(request: Request): Promise<Response> {
    const body = await request.json();
    const { userId, interviewType, experienceLevel, rounds, resumeId, jdId } = body;

    // Validate input
    if (!userId || !interviewType || experienceLevel === undefined) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    const existingUser = await this.env.DB
      .prepare('SELECT id FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!existingUser) {
      await this.env.DB
        .prepare('INSERT INTO users (id, created_at, last_login) VALUES (?, ?, ?)')
        .bind(userId, new Date().toISOString(), new Date().toISOString())
        .run();
    } else {
      // Update last login
      await this.env.DB
        .prepare('UPDATE users SET last_login = ? WHERE id = ?')
        .bind(new Date().toISOString(), userId)
        .run();
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const session: InterviewSession = {
      id: sessionId,
      userId,
      interviewType,
      experienceLevel,
      currentRound: rounds?.[0] || 'BEHAVIORAL',
      rounds: rounds || ['BEHAVIORAL', 'TECHNICAL', 'CODING'],
      conversationHistory: [],
      currentQuestion: null,
      evaluations: [],
      status: 'active',
      startedAt: new Date().toISOString(),
    };

    // Get user context from Durable Object
    const userMemory = this.getUserMemoryDO(userId);
    const userContext = await (await userMemory.fetch(new Request('http://internal/memory'))).json();

    // Load resume and JD if provided
    if (resumeId) {
      const resume = await this.env.DB
        .prepare('SELECT parsed_data FROM resumes WHERE id = ?')
        .bind(resumeId)
        .first();
      userContext.resume = resume ? JSON.parse(resume.parsed_data as string) : null;
    }

    if (jdId) {
      const jd = await this.env.DB
        .prepare('SELECT parsed_requirements FROM job_descriptions WHERE id = ?')
        .bind(jdId)
        .first();
      userContext.jdRequirements = jd ? JSON.parse(jd.parsed_requirements as string) : null;
    }

    // Generate first question
    const llm = new LLMService(this.env.AI, this.env);
    const firstQuestion = await llm.generateQuestion(session, userContext);
    session.currentQuestion = firstQuestion;

    // Add first message to history
    const firstMessage: Message = {
      id: crypto.randomUUID(),
      role: 'interviewer',
      content: firstQuestion.text,
      timestamp: new Date().toISOString(),
    };
    session.conversationHistory.push(firstMessage);

    // Store session in D1
    await this.env.DB
      .prepare(`
        INSERT INTO sessions (id, user_id, interview_type, experience_level, status, started_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        sessionId,
        userId,
        interviewType,
        experienceLevel,
        'active',
        session.startedAt
      )
      .run();

    // Store in KV for quick access
    await this.env.SESSION_CACHE.put(
      `session:${sessionId}`,
      JSON.stringify(session),
      { expirationTtl: 3600 } // 1 hour
    );

    return Response.json({
      sessionId,
      firstQuestion: firstQuestion.text,
      session,
    });
  }

  private async sendMessage(request: Request, sessionId: string): Promise<Response> {
    const { message, audio } = await request.json();

    // Get session from KV
    const sessionData = await this.env.SESSION_CACHE.get(`session:${sessionId}`);
    if (!sessionData) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const session: InterviewSession = JSON.parse(sessionData);

    // Add user message to history
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'candidate',
      content: message,
      timestamp: new Date().toISOString(),
      audioUrl: audio ? `audio/${sessionId}/${crypto.randomUUID()}.webm` : undefined,
    };
    session.conversationHistory.push(userMessage);

    // Store audio if provided and bucket is available
    if (audio && this.env.AUDIO_BUCKET) {
      const audioBuffer = Buffer.from(audio, 'base64');
      await this.env.AUDIO_BUCKET.put(userMessage.audioUrl!, audioBuffer);
    }

    // Evaluate answer
    const llm = new LLMService(this.env.AI, this.env);
    const evaluation = await llm.evaluateAnswer(
      session.currentQuestion!,
      message,
      session
    );
    session.evaluations.push(evaluation);

    // Store message and evaluation in D1
    await this.env.DB
      .prepare(`
        INSERT INTO session_messages (id, session_id, role, content, timestamp, evaluation)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        userMessage.id,
        sessionId,
        userMessage.role,
        userMessage.content,
        userMessage.timestamp,
        JSON.stringify(evaluation)
      )
      .run();

    // Determine next action
    let nextQuestion: Question | null = null;
    let sessionComplete = false;

    if (evaluation.needsFollowUp) {
      // Generate follow-up
      nextQuestion = await llm.generateFollowUp(
        session.currentQuestion!,
        message,
        evaluation
      );
    } else {
      // Move to next question or round
      // (Simplified logic - you'd implement more sophisticated progression)
      const userMemory = this.getUserMemoryDO(session.userId);
      const userContext = await (await userMemory.fetch(new Request('http://internal/memory'))).json();
      
      nextQuestion = await llm.generateQuestion(session, userContext);
    }

    session.currentQuestion = nextQuestion;

    // Add interviewer response to history
    const interviewerMessage: Message = {
      id: crypto.randomUUID(),
      role: 'interviewer',
      content: nextQuestion!.text,
      timestamp: new Date().toISOString(),
    };
    session.conversationHistory.push(interviewerMessage);

    // Update session in KV
    await this.env.SESSION_CACHE.put(
      `session:${sessionId}`,
      JSON.stringify(session),
      { expirationTtl: 3600 }
    );

    return Response.json({
      interviewerResponse: nextQuestion!.text,
      evaluation: {
        scores: evaluation.scores,
        feedback: evaluation.feedback,
      },
      sessionComplete,
    });
  }

  private async getSession(sessionId: string): Promise<Response> {
    const sessionData = await this.env.SESSION_CACHE.get(`session:${sessionId}`);
    if (!sessionData) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    return Response.json(JSON.parse(sessionData));
  }

  private async endSession(sessionId: string): Promise<Response> {
    const sessionData = await this.env.SESSION_CACHE.get(`session:${sessionId}`);
    if (!sessionData) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const session: InterviewSession = JSON.parse(sessionData);

    // Generate final evaluation
    const llm = new LLMService(this.env.AI, this.env);
    const finalEvaluation = await llm.generateFinalEvaluation(session);

    // Update session status
    session.status = 'completed';
    session.endedAt = new Date().toISOString();

    // Store final evaluation
    await this.env.DB
      .prepare(`
        UPDATE sessions 
        SET status = ?, ended_at = ?, final_score = ?
        WHERE id = ?
      `)
      .bind('completed', session.endedAt, finalEvaluation.overallScore, sessionId)
      .run();

    // Update user memory with weak areas
    const userMemory = this.getUserMemoryDO(session.userId);
    await userMemory.fetch(new Request('http://internal/update', {
      method: 'POST',
      body: JSON.stringify({
        weakAreas: finalEvaluation.weakAreas,
        sessionSummary: {
          sessionId,
          date: session.endedAt,
          score: finalEvaluation.overallScore,
          interviewType: session.interviewType,
        },
      }),
    }));

    // Clean up KV
    await this.env.SESSION_CACHE.delete(`session:${sessionId}`);

    return Response.json({
      sessionId,
      finalEvaluation,
    });
  }

  private getUserMemoryDO(userId: string): DurableObjectStub {
    const id = this.env.USER_MEMORY.idFromName(userId);
    return this.env.USER_MEMORY.get(id);
  }

  // Resume handling - removed, not used (using paste-only in frontend)
  private async handleResume(request: Request, path: string): Promise<Response> {
    return Response.json({ error: 'Resume upload removed - use paste-only in frontend' }, { status: 404 });
  }

  // Job Description handling - removed, not used (using paste-only in frontend)
  private async handleJD(request: Request, path: string): Promise<Response> {
    return Response.json({ error: 'JD upload removed - use paste-only in frontend' }, { status: 404 });
  }

  // Memory handling
  private async handleMemory(request: Request, path: string): Promise<Response> {
    const userIdMatch = path.match(/\/api\/memory\/([^/]+)/);

    if (!userIdMatch) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    const userId = userIdMatch[1];
    const userMemory = this.getUserMemoryDO(userId);

    // Forward the request to the Durable Object
    const doPath = path.replace(`/api/memory/${userId}`, '');
    const doUrl = `http://internal${doPath || '/memory'}`;

    return await userMemory.fetch(new Request(doUrl, {
      method: request.method,
      body: request.body,
      headers: request.headers,
    }));
  }

  // Voice handling - removed, using Web Speech API in frontend
  private async handleVoice(request: Request, path: string): Promise<Response> {
    return Response.json({ error: 'Voice handling removed - using Web Speech API in frontend' }, { status: 404 });
  }

  // Gap Analysis handling
  private async handleGapAnalysis(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json();
    const { resume, jobDescription } = body;

    if (!resume || !jobDescription) {
      return Response.json({ error: 'Both resume and jobDescription are required' }, { status: 400 });
    }

    const llm = new LLMService(this.env.AI, this.env);
    const analysisPrompt = `
You are an expert career advisor analyzing resume-job description fit.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Analyze the gap between this resume and job description. Return ONLY valid JSON:
{
  "matchingSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "matchPercentage": 75,
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "suggestedInterviewQuestions": [
    "Question about missing skill 1",
    "Question about missing skill 2"
  ]
}`;

    try {
      const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'You are a career advisor. Return only valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      let parsed: any;
      if (typeof response.response === 'object') {
        parsed = response.response;
      } else {
        const responseText = response.response as string;
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          parsed = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
        } else {
          parsed = JSON.parse(responseText);
        }
      }

      return Response.json(parsed);
    } catch (error) {
      console.error('Gap analysis error:', error);
      return Response.json({
        error: 'Failed to analyze gap',
        matchingSkills: [],
        missingSkills: [],
        recommendations: ['Unable to analyze at this time. Please try again.']
      }, { status: 500 });
    }
  }

}
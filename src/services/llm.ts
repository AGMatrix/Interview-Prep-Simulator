import { Ai } from '@cloudflare/ai';
import { Question, Evaluation, InterviewSession, Env } from '../types';
import { INTERVIEWER_PROMPT, EVALUATOR_PROMPT } from '../utils/prompts';
import { NLPService } from './nlp';

export class LLMService {
  private nlpService?: NLPService;

  constructor(private ai: Ai, private env?: Env) {
    if (env) {
      this.nlpService = new NLPService(env);
    }
  }

  async generateQuestion(
    session: InterviewSession,
    userContext: any
  ): Promise<Question> {
    const prompt = this.buildQuestionPrompt(session, userContext);
    
    const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { 
          role: 'system', 
          content: INTERVIEWER_PROMPT(session.interviewType, session.currentRound)
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return this.parseQuestionResponse(response);
  }

  async evaluateAnswer(
    question: Question,
    answer: string,
    session: InterviewSession
  ): Promise<Evaluation> {
    // Run NLP analysis in parallel with LLM evaluation
    const nlpAnalysisPromise = this.nlpService
      ? this.nlpService.analyzeAnswer(answer, question.text)
      : null;

    const prompt = `
Question: ${question.text}
Candidate's Answer: ${answer}
Interview Type: ${session.interviewType}
Experience Level: ${session.experienceLevel} years
Round: ${session.currentRound}

Evaluate this answer according to the criteria provided in the system prompt.
Return a JSON evaluation.
`;

    const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: EVALUATOR_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.3 // Lower temperature for consistent evaluation
    });

    const evaluation = this.parseEvaluationResponse(response);

    // Enhance evaluation with NLP insights
    if (nlpAnalysisPromise) {
      const nlpAnalysis = await nlpAnalysisPromise;

      // Add NLP metrics to feedback
      const nlpInsights = `

NLP Analysis:
- Word count: ${nlpAnalysis.metrics.wordCount}
- Technical terms used: ${nlpAnalysis.metrics.technicalTerms}
- Answer confidence: ${(nlpAnalysis.confidence * 100).toFixed(0)}%
- Sentiment: ${nlpAnalysis.sentiment}
${nlpAnalysis.suggestions.length > 0 ? '\nSuggestions:\n' + nlpAnalysis.suggestions.map(s => `- ${s}`).join('\n') : ''}`;

      evaluation.feedback += nlpInsights;

      // Adjust scores based on NLP confidence
      const confidenceBoost = (nlpAnalysis.confidence - 0.5) * 0.2; // -0.1 to +0.1
      evaluation.scores.clarity = Math.max(
        0,
        Math.min(10, evaluation.scores.clarity + confidenceBoost * 10)
      );
    }

    return evaluation;
  }

  async generateFollowUp(
    question: Question,
    answer: string,
    evaluation: Evaluation
  ): Promise<Question> {
    const prompt = `
Original Question: ${question.text}
Candidate's Answer: ${answer}
Evaluation: ${JSON.stringify(evaluation)}

The evaluation shows these areas need probing: ${evaluation.probeAreas.join(', ')}

Generate a natural follow-up question that:
1. Feels conversational (not robotic)
2. Digs deeper into unclear areas
3. Helps the candidate clarify their thinking
4. Is appropriate for the interview context

Return JSON with the follow-up question.
`;

    const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { 
          role: 'system', 
          content: 'You are conducting a follow-up during an interview. Be natural and conversational.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8
    });

    return this.parseQuestionResponse(response);
  }

  async generateFinalEvaluation(session: InterviewSession): Promise<any> {
    const allEvaluations = session.evaluations;
    const averageScores = this.calculateAverageScores(allEvaluations);
    
    const prompt = `
Interview Summary:
- Type: ${session.interviewType}
- Experience Level: ${session.experienceLevel} years
- Rounds Completed: ${session.rounds.join(', ')}

Performance Scores:
${JSON.stringify(averageScores, null, 2)}

Individual Evaluations:
${JSON.stringify(allEvaluations, null, 2)}

Generate a comprehensive final evaluation that includes:
1. Overall performance summary
2. Top 3 strengths
3. Top 3 areas for improvement
4. Specific action items for each weak area
5. Recommended resources for improvement
6. Overall recommendation (Strong Hire / Hire / No Hire)

Return structured JSON.
`;

    const response = await this.ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert interviewer providing final candidate evaluation.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.5
    });

    return JSON.parse(response.response);
  }

  private getRandomStarterTopics(round: string): string {
    const behavioralTopics = [
      '7. For the FIRST question, choose ONE of these diverse topics: Handling production incidents, Code review practices, Technical debt decisions, Mentoring juniors, Disagreement with manager, Time management under pressure, Learning new technology quickly, API design choices, Performance optimization, Security vulnerability handling',
      '7. For the FIRST question, choose ONE of these diverse topics: Database migration experience, Microservices challenges, Legacy code refactoring, CI/CD pipeline setup, On-call rotation experience, Technical documentation, Cross-team collaboration, Architectural decisions, Scaling challenges, Debugging complex issues',
      '7. For the FIRST question, choose ONE of these diverse topics: Failed project lessons, Tight deadline management, Quality vs speed tradeoffs, Customer-facing bug handling, Team conflict resolution, Process improvement, Technical presentation, Innovation proposal, Resource constraints, Emergency deployment'
    ];

    const technicalTopics = [
      '7. For the FIRST question, choose ONE of these topics: Database indexing, Caching strategies, Message queues, Load balancing, Authentication/Authorization, Rate limiting, Circuit breakers, Event-driven architecture, GraphQL vs REST, Serverless architecture',
      '7. For the FIRST question, choose ONE of these topics: Distributed transactions, CAP theorem, Eventual consistency, Sharding strategies, Connection pooling, Async processing, Websockets, CDN usage, Container orchestration, Service mesh',
      '7. For the FIRST question, choose ONE of these topics: SQL optimization, NoSQL design, API versioning, Data encryption, Backup strategies, Monitoring/Observability, Error handling patterns, Testing strategies, Code organization, Performance profiling'
    ];

    const topics = round === 'BEHAVIORAL' ? behavioralTopics : technicalTopics;
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private buildQuestionPrompt(session: InterviewSession, userContext: any): string {
    const previousQuestions = session.conversationHistory
      .filter(m => m.role === 'interviewer')
      .map((m, idx) => `${idx + 1}. ${m.content}`)
      .join('\n');

    const candidateAnswers = session.conversationHistory
      .filter(m => m.role === 'candidate')
      .slice(-2)
      .map(m => m.content.substring(0, 200))
      .join(' | ');

    // Add variety to first question with random topics
    const isFirstQuestion = session.conversationHistory.filter(m => m.role === 'interviewer').length === 0;
    const randomTopics = isFirstQuestion ? this.getRandomStarterTopics(session.currentRound) : '';

    return `
Generate an interview question with these parameters:

Interview Context:
- Type: ${session.interviewType}
- Experience Level: ${session.experienceLevel} years
- Current Round: ${session.currentRound}
- Questions Asked So Far: ${Math.floor(session.conversationHistory.length / 2)}

Candidate Context:
- Known Skills: ${userContext.skills?.join(', ') || 'Unknown'}
- Weak Areas: ${userContext.weakAreas?.join(', ') || 'None identified'}
- Recent Performance: ${session.evaluations.length > 0 ?
    `Avg score ${(session.evaluations.slice(-3).reduce((sum, e) => sum + (e.scores.correctness + e.scores.depth + e.scores.clarity + e.scores.completeness) / 4, 0) / Math.min(3, session.evaluations.length)).toFixed(1)}/10`
    : 'First question'}
- Target Role Requirements: ${userContext.jdRequirements || 'General interview'}

ALL PREVIOUS QUESTIONS (DO NOT REPEAT ANY OF THESE):
${previousQuestions || 'None yet - this is the first question'}

Recent Candidate Answers (to understand their level):
${candidateAnswers || 'None yet'}

CRITICAL INSTRUCTIONS:
1. Generate a COMPLETELY DIFFERENT question from all previous ones listed above
2. Do NOT ask about the same topic/concept already covered
3. Make sure the question is appropriate for ${session.experienceLevel} years experience
4. For ${session.currentRound} round, focus on relevant skills
5. If performance is low, ask slightly easier questions; if high, increase difficulty
6. Avoid generic questions - be specific and scenario-based
${randomTopics}

Return ONLY this JSON format (no extra text):
{
  "text": "The question text - make it conversational and specific",
  "category": "specific topic/category",
  "difficulty": "easy|medium|hard",
  "followUpHints": ["hint1", "hint2"],
  "evaluationCriteria": {
    "correctness": "what to look for",
    "depth": "what level of understanding",
    "communication": "how they should explain"
  }
}
`;
  }

  private parseQuestionResponse(response: any): Question {
    try {
      let parsed: any;

      // Check if response.response is already an object
      if (typeof response.response === 'object' && response.response !== null) {
        console.log('AI returned object directly:', response.response);
        parsed = response.response;
      } else if (typeof response.response === 'string') {
        let responseText = response.response;
        console.log('AI returned string, parsing:', responseText);

        // Remove markdown code blocks if present
        if (responseText.includes('```')) {
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            responseText = jsonMatch[1];
          }
        }

        // Remove any leading/trailing text
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        parsed = JSON.parse(responseText);
      } else {
        throw new Error('Unexpected response type: ' + typeof response.response);
      }

      console.log('Successfully parsed question:', parsed.text);

      return {
        id: crypto.randomUUID(),
        type: parsed.type || 'TECHNICAL',
        difficulty: parsed.difficulty || 'medium',
        text: parsed.text || parsed,
        category: parsed.category || 'general',
        expectedAnswer: parsed.expectedAnswer,
        followUpHints: parsed.followUpHints || [],
        evaluationCriteria: parsed.evaluationCriteria || {
          correctness: 'Check accuracy',
          depth: 'Assess understanding',
          communication: 'Evaluate clarity'
        }
      };
    } catch (e) {
      console.error('Failed to parse question response:', e);
      console.error('Raw response was:', response.response);
      console.error('Response type:', typeof response.response);

      // Fallback if parsing fails
      return {
        id: crypto.randomUUID(),
        type: 'TECHNICAL',
        difficulty: 'medium',
        text: typeof response.response === 'string' ? response.response : 'Tell me about a time when you had to work with a cross-functional team to resolve a complex data issue. How did you ensure effective collaboration and communication among team members with different backgrounds and expertise?',
        category: 'general',
        evaluationCriteria: {
          correctness: 'Check accuracy',
          depth: 'Assess understanding',
          communication: 'Evaluate clarity'
        }
      };
    }
  }

  private parseEvaluationResponse(response: any): Evaluation {
    try {
      let parsed: any;

      // Check if response.response is already an object
      if (typeof response.response === 'object' && response.response !== null) {
        console.log('AI returned evaluation object directly');
        parsed = response.response;
      } else if (typeof response.response === 'string') {
        let responseText = response.response;
        console.log('AI returned evaluation string, parsing');

        // Remove markdown code blocks if present
        if (responseText.includes('```')) {
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            responseText = jsonMatch[1];
          }
        }

        // Remove any leading/trailing text
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        parsed = JSON.parse(responseText);
      } else {
        throw new Error('Unexpected response type: ' + typeof response.response);
      }

      console.log('Successfully parsed evaluation with scores:', parsed.scores);

      return {
        questionId: parsed.questionId || '',
        scores: parsed.scores,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        feedback: parsed.feedback,
        suggestedImprovement: parsed.suggestedImprovement,
        needsFollowUp: parsed.needsFollowUp || false,
        probeAreas: parsed.probeAreas || []
      };
    } catch (e) {
      console.error('Failed to parse evaluation:', e, 'Response was:', response.response);
      return {
        questionId: '',
        scores: {
          correctness: 5,
          depth: 5,
          clarity: 5,
          completeness: 5
        },
        strengths: [],
        weaknesses: [],
        feedback: 'Unable to evaluate at this time.',
        suggestedImprovement: '',
        needsFollowUp: false,
        probeAreas: []
      };
    }
  }

  private calculateAverageScores(evaluations: Evaluation[]): any {
    if (evaluations.length === 0) return {};
    
    const totals = evaluations.reduce((acc, evaluation) => {
      acc.correctness += evaluation.scores.correctness;
      acc.depth += evaluation.scores.depth;
      acc.clarity += evaluation.scores.clarity;
      acc.completeness += evaluation.scores.completeness;
      return acc;
    }, { correctness: 0, depth: 0, clarity: 0, completeness: 0 });

    const count = evaluations.length;
    return {
      correctness: (totals.correctness / count).toFixed(2),
      depth: (totals.depth / count).toFixed(2),
      clarity: (totals.clarity / count).toFixed(2),
      completeness: (totals.completeness / count).toFixed(2),
      overall: ((totals.correctness + totals.depth + totals.clarity + totals.completeness) / (count * 4)).toFixed(2)
    };
  }
}
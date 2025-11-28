import { Env, Question, RoundType } from '../types';

export class QuestionsService {
  constructor(private env: Env) {}

  /**
   * Add a question to the database
   */
  async addQuestion(question: Omit<Question, 'id'>): Promise<string> {
    const id = crypto.randomUUID();

    try {
      // Store in D1
      await this.env.DB.prepare(
        `INSERT INTO questions (id, type, difficulty, category, text, expected_answer, follow_up_hints, tags, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          question.type.toLowerCase(),
          question.difficulty,
          question.category,
          question.text,
          question.expectedAnswer || null,
          JSON.stringify(question.followUpHints || []),
          question.category, // Use category as tags for now
          new Date().toISOString()
        )
        .run();

      // Generate embedding and store in Vectorize
      await this.addToVectorize(id, question);

      return id;
    } catch (error: any) {
      console.error('Error adding question:', error);
      throw new Error(`Failed to add question: ${error.message}`);
    }
  }

  /**
   * Get question by ID
   */
  async getQuestion(id: string): Promise<Question | null> {
    const result = await this.env.DB.prepare('SELECT * FROM questions WHERE id = ?')
      .bind(id)
      .first();

    if (!result) return null;

    return this.parseQuestionFromDB(result);
  }

  /**
   * Search questions by type and difficulty
   */
  async searchQuestions(filters: {
    type?: RoundType;
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    limit?: number;
  }): Promise<Question[]> {
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params: any[] = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type.toLowerCase());
    }

    if (filters.difficulty) {
      query += ' AND difficulty = ?';
      params.push(filters.difficulty);
    }

    if (filters.category) {
      query += ' AND category LIKE ?';
      params.push(`%${filters.category}%`);
    }

    query += ' ORDER BY RANDOM() LIMIT ?';
    params.push(filters.limit || 10);

    const results = await this.env.DB.prepare(query).bind(...params).all();

    return results.results.map((r) => this.parseQuestionFromDB(r));
  }

  /**
   * Semantic search using Vectorize
   */
  async semanticSearch(
    queryText: string,
    filters: {
      type?: RoundType;
      difficulty?: 'easy' | 'medium' | 'hard';
      topK?: number;
    } = {}
  ): Promise<Question[]> {
    try {
      // Generate embedding for the query
      const embedding = await this.generateEmbedding(queryText);

      // Search Vectorize
      const searchResults = await this.env.VECTORIZE.query(embedding, {
        topK: filters.topK || 5,
        returnMetadata: true,
      });

      // Filter results based on criteria
      const filteredIds = searchResults.matches
        .filter((match) => {
          if (filters.type && match.metadata?.type !== filters.type.toLowerCase()) {
            return false;
          }
          if (filters.difficulty && match.metadata?.difficulty !== filters.difficulty) {
            return false;
          }
          return true;
        })
        .map((match) => match.vectorId);

      // Fetch full questions from D1
      if (filteredIds.length === 0) return [];

      const placeholders = filteredIds.map(() => '?').join(',');
      const results = await this.env.DB.prepare(
        `SELECT * FROM questions WHERE id IN (${placeholders})`
      )
        .bind(...filteredIds)
        .all();

      return results.results.map((r) => this.parseQuestionFromDB(r));
    } catch (error: any) {
      console.error('Semantic search error:', error);
      // Fallback to regular search
      return await this.searchQuestions({
        type: filters.type,
        difficulty: filters.difficulty,
        limit: filters.topK || 5,
      });
    }
  }

  /**
   * Get random question for interview
   */
  async getRandomQuestion(
    type: RoundType,
    difficulty: 'easy' | 'medium' | 'hard',
    excludeIds: string[] = []
  ): Promise<Question | null> {
    let query = 'SELECT * FROM questions WHERE type = ? AND difficulty = ?';
    const params: any[] = [type.toLowerCase(), difficulty];

    if (excludeIds.length > 0) {
      const placeholders = excludeIds.map(() => '?').join(',');
      query += ` AND id NOT IN (${placeholders})`;
      params.push(...excludeIds);
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await this.env.DB.prepare(query).bind(...params).first();

    if (!result) return null;

    return this.parseQuestionFromDB(result);
  }

  /**
   * Bulk import questions
   */
  async bulkImport(questions: Array<Omit<Question, 'id'>>): Promise<{ imported: number; failed: number }> {
    let imported = 0;
    let failed = 0;

    for (const question of questions) {
      try {
        await this.addQuestion(question);
        imported++;
      } catch (error) {
        console.error('Failed to import question:', error);
        failed++;
      }
    }

    return { imported, failed };
  }

  /**
   * Seed initial questions
   */
  async seedQuestions(): Promise<number> {
    const sampleQuestions: Array<Omit<Question, 'id'>> = [
      {
        type: 'BEHAVIORAL',
        difficulty: 'medium',
        text: 'Tell me about a time when you had to deal with a difficult team member.',
        category: 'Leadership & Collaboration',
        evaluationCriteria: {
          correctness: 'Uses STAR method',
          depth: 'Shows conflict resolution skills',
          communication: 'Clear and professional',
        },
      },
      {
        type: 'TECHNICAL',
        difficulty: 'medium',
        text: 'Explain the difference between SQL and NoSQL databases. When would you use each?',
        category: 'Databases',
        evaluationCriteria: {
          correctness: 'Accurate technical knowledge',
          depth: 'Discusses trade-offs and use cases',
          communication: 'Clear explanations with examples',
        },
      },
      {
        type: 'CODING',
        difficulty: 'medium',
        text: 'Write a function to reverse a linked list.',
        category: 'Data Structures',
        evaluationCriteria: {
          correctness: 'Working solution with proper logic',
          depth: 'Considers edge cases, discusses time/space complexity',
          communication: 'Explains approach clearly',
        },
      },
      {
        type: 'SYSTEM_DESIGN',
        difficulty: 'hard',
        text: 'Design a URL shortening service like bit.ly that can handle millions of requests per day.',
        category: 'Scalability',
        evaluationCriteria: {
          correctness: 'Sound architectural decisions',
          depth: 'Addresses scaling, storage, caching, and failure handling',
          communication: 'Structured approach with diagrams/explanations',
        },
      },
    ];

    const result = await this.bulkImport(sampleQuestions);
    return result.imported;
  }

  // ===== Private Helper Methods =====

  /**
   * Generate embedding for text using Workers AI
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response: any = await this.env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [text],
      });

      return response.data[0];
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return zero vector as fallback
      return new Array(768).fill(0);
    }
  }

  /**
   * Add question to Vectorize index
   */
  private async addToVectorize(id: string, question: Omit<Question, 'id'>): Promise<void> {
    try {
      // Generate embedding from question text
      const embedding = await this.generateEmbedding(question.text);

      // Insert into Vectorize
      await this.env.VECTORIZE.insert([
        {
          id,
          values: embedding,
          metadata: {
            type: question.type.toLowerCase(),
            difficulty: question.difficulty,
            category: question.category,
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding to Vectorize:', error);
      // Continue even if Vectorize fails
    }
  }

  /**
   * Parse question from database result
   */
  private parseQuestionFromDB(row: any): Question {
    return {
      id: row.id,
      type: row.type.toUpperCase() as RoundType,
      difficulty: row.difficulty,
      text: row.text,
      category: row.category,
      expectedAnswer: row.expected_answer,
      followUpHints: row.follow_up_hints ? JSON.parse(row.follow_up_hints) : [],
      evaluationCriteria: {
        correctness: 'Check for accuracy',
        depth: 'Assess understanding',
        communication: 'Evaluate clarity',
      },
    };
  }
}

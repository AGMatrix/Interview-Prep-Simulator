import { Env } from '../types';

/**
 * NLP Service for analyzing interview answers
 * Uses sentiment analysis, keyword extraction, and confidence scoring
 */
export class NLPService {
  constructor(private env: Env) {}

  /**
   * Analyze answer sentiment and quality metrics
   */
  async analyzeAnswer(answer: string, question: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keywords: string[];
    metrics: {
      wordCount: number;
      sentenceCount: number;
      avgWordLength: number;
      technicalTerms: number;
      fillerWords: number;
    };
    suggestions: string[];
  }> {
    // Basic metrics
    const words = answer.trim().split(/\s+/);
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;

    // Detect technical terms (common programming/tech keywords)
    const technicalTermsPattern =
      /\b(algorithm|api|database|backend|frontend|server|client|microservice|docker|kubernetes|aws|cloud|sql|nosql|redis|cache|performance|scalability|architecture|pattern|framework|library|async|promise|callback|function|class|interface|type|struct|pointer|memory|cpu|latency|throughput|optimization|refactor|deploy|ci\/cd|test|unit|integration|authentication|authorization|security|encryption|hash|token|jwt|rest|graphql|websocket|http|https|tcp|udp|dns|load balancer|proxy|nginx|apache|node|react|vue|angular|python|java|go|rust|typescript|javascript)\b/gi;

    const technicalMatches = answer.match(technicalTermsPattern) || [];
    const technicalTerms = technicalMatches.length;

    // Detect filler words
    const fillerWordsPattern =
      /\b(um|uh|like|you know|basically|actually|literally|sort of|kind of|i think|i mean|well|so|just|really)\b/gi;
    const fillerMatches = answer.match(fillerWordsPattern) || [];
    const fillerWords = fillerMatches.length;

    // Extract keywords using simple frequency analysis
    const keywords = this.extractKeywords(answer);

    // Calculate confidence score based on metrics
    let confidence = 0.5; // Base confidence

    // Positive indicators
    if (wordCount >= 50) confidence += 0.1;
    if (wordCount >= 100) confidence += 0.1;
    if (sentenceCount >= 3) confidence += 0.1;
    if (technicalTerms >= 3) confidence += 0.15;
    if (avgWordLength > 5) confidence += 0.05;

    // Negative indicators
    if (wordCount < 20) confidence -= 0.2;
    if (fillerWords > 5) confidence -= 0.1;
    if (sentenceCount < 2) confidence -= 0.1;

    // Cap between 0 and 1
    confidence = Math.max(0, Math.min(1, confidence));

    // Determine sentiment using AI
    const sentiment = await this.detectSentiment(answer);

    // Generate suggestions
    const suggestions = this.generateSuggestions({
      wordCount,
      sentenceCount,
      technicalTerms,
      fillerWords,
    });

    return {
      sentiment,
      confidence,
      keywords,
      metrics: {
        wordCount,
        sentenceCount,
        avgWordLength,
        technicalTerms,
        fillerWords,
      },
      suggestions,
    };
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Remove common stop words
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'as',
      'is',
      'was',
      'are',
      'were',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
      'what',
      'which',
      'who',
      'when',
      'where',
      'why',
      'how',
    ]);

    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w))
      .filter((w) => /^[a-z]+$/.test(w)); // Only alphabetic words

    // Count frequencies
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });

    // Get top keywords
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Detect sentiment using Workers AI
   */
  private async detectSentiment(
    text: string
  ): Promise<'positive' | 'neutral' | 'negative'> {
    try {
      // Use LLM for sentiment detection
      const prompt = `Analyze the sentiment of this interview answer. Respond with ONLY ONE WORD: positive, neutral, or negative.

Answer: "${text}"

Sentiment:`;

      const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
      });

      const result = (response as any).response?.toLowerCase() || 'neutral';

      if (result.includes('positive')) return 'positive';
      if (result.includes('negative')) return 'negative';
      return 'neutral';
    } catch (error) {
      console.error('Sentiment detection failed:', error);
      return 'neutral';
    }
  }

  /**
   * Generate suggestions based on metrics
   */
  private generateSuggestions(metrics: {
    wordCount: number;
    sentenceCount: number;
    technicalTerms: number;
    fillerWords: number;
  }): string[] {
    const suggestions: string[] = [];

    if (metrics.wordCount < 30) {
      suggestions.push(
        'Try to provide more detailed answers. Aim for at least 50-100 words to fully explain your thoughts.'
      );
    }

    if (metrics.sentenceCount < 2) {
      suggestions.push(
        'Break your answer into multiple sentences for better clarity and structure.'
      );
    }

    if (metrics.technicalTerms < 2) {
      suggestions.push(
        'Include more technical terms and specific examples to demonstrate your expertise.'
      );
    }

    if (metrics.fillerWords > 5) {
      suggestions.push(
        'Reduce filler words like "um", "like", "actually" to sound more confident and professional.'
      );
    }

    if (metrics.wordCount > 300) {
      suggestions.push(
        'Your answer is quite long. Try to be more concise while maintaining the key points.'
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Great answer! Keep maintaining this level of detail and technical depth.'
      );
    }

    return suggestions;
  }

  /**
   * Compare answer with ideal response patterns
   */
  async compareWithIdeal(
    answer: string,
    question: string,
    category: string
  ): Promise<{
    matchScore: number;
    missingPoints: string[];
    strengths: string[];
  }> {
    try {
      const prompt = `You are an expert interview coach. Compare this candidate's answer to the question and identify:
1. Match score (0-100)
2. Missing key points
3. Answer strengths

Question: ${question}
Category: ${category}
Candidate Answer: ${answer}

Respond in JSON format:
{
  "matchScore": 75,
  "missingPoints": ["point1", "point2"],
  "strengths": ["strength1", "strength2"]
}`;

      const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      });

      const text = (response as any).response || '{}';

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          matchScore: result.matchScore || 50,
          missingPoints: result.missingPoints || [],
          strengths: result.strengths || [],
        };
      }

      return {
        matchScore: 50,
        missingPoints: [],
        strengths: [],
      };
    } catch (error) {
      console.error('Comparison failed:', error);
      return {
        matchScore: 50,
        missingPoints: [],
        strengths: [],
      };
    }
  }
}

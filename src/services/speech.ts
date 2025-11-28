import { Env } from '../types';

export class SpeechService {
  constructor(private env: Env) {}

  /**
   * Convert speech to text using Deepgram or Workers AI Whisper
   */
  async speechToText(audioBlob: ArrayBuffer): Promise<{ text: string; confidence: number }> {
    try {
      // Try Deepgram first if API key is available
      if (this.env.DEEPGRAM_API_KEY) {
        return await this.deepgramSTT(audioBlob);
      }

      // Fallback to Workers AI Whisper
      return await this.workersAIWhisper(audioBlob);
    } catch (error: any) {
      console.error('Speech-to-text error:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  /**
   * Convert text to speech using ElevenLabs or alternative
   */
  async textToSpeech(text: string, voice: string = 'professional'): Promise<ArrayBuffer> {
    try {
      // Try ElevenLabs first if API key is available
      if (this.env.ELEVENLABS_API_KEY) {
        return await this.elevenLabsTTS(text, voice);
      }

      // Fallback to browser-based TTS (handled client-side)
      throw new Error('TTS requires ElevenLabs API key');
    } catch (error: any) {
      console.error('Text-to-speech error:', error);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  /**
   * Deepgram Speech-to-Text implementation
   */
  private async deepgramSTT(audioBlob: ArrayBuffer): Promise<{ text: string; confidence: number }> {
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/webm',
      },
      body: audioBlob,
    });

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const transcript = data.results?.channels?.[0]?.alternatives?.[0];

    return {
      text: transcript?.transcript || '',
      confidence: transcript?.confidence || 0,
    };
  }

  /**
   * Workers AI Whisper implementation (fallback)
   */
  private async workersAIWhisper(audioBlob: ArrayBuffer): Promise<{ text: string; confidence: number }> {
    try {
      // Workers AI Whisper model
      const response: any = await this.env.AI.run('@cf/openai/whisper', {
        audio: Array.from(new Uint8Array(audioBlob)),
      });

      return {
        text: response.text || '',
        confidence: 0.9, // Workers AI doesn't provide confidence scores
      };
    } catch (error) {
      console.error('Workers AI Whisper error:', error);
      throw new Error('Workers AI Whisper failed');
    }
  }

  /**
   * ElevenLabs Text-to-Speech implementation
   */
  private async elevenLabsTTS(text: string, voice: string): Promise<ArrayBuffer> {
    // ElevenLabs voice ID mapping
    const voiceMap: Record<string, string> = {
      professional: '21m00Tcm4TlvDq8ikWAM', // Rachel
      friendly: 'EXAVITQu4vr4xnSDxMaL', // Bella
      authoritative: 'TX3LPaxmHKxFdv7VOQHJ', // Liam
    };

    const voiceId = voiceMap[voice] || voiceMap.professional;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.arrayBuffer();
  }

  /**
   * Stream audio for real-time TTS (optional enhancement)
   */
  async streamTextToSpeech(text: string, voice: string = 'professional'): Promise<ReadableStream> {
    if (!this.env.ELEVENLABS_API_KEY) {
      throw new Error('Streaming requires ElevenLabs API key');
    }

    const voiceMap: Record<string, string> = {
      professional: '21m00Tcm4TlvDq8ikWAM',
      friendly: 'EXAVITQu4vr4xnSDxMaL',
      authoritative: 'TX3LPaxmHKxFdv7VOQHJ',
    };

    const voiceId = voiceMap[voice] || voiceMap.professional;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error(`ElevenLabs streaming error: ${response.statusText}`);
    }

    return response.body;
  }
}

import { useState, useCallback, useRef } from 'react';
import apiClient from '../api/client';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error starting recording:', err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const transcribe = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      const result = await apiClient.speechToText(audioBlob);
      return result.text;
    } catch (err: any) {
      console.warn('API transcription failed, using browser fallback:', err);

      // Fallback to browser Web Speech API if available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        return new Promise((resolve, reject) => {
          const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          const recognition = new SpeechRecognition();

          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
          };

          recognition.onerror = (event: any) => {
            reject(new Error('Browser speech recognition failed: ' + event.error));
          };

          // Convert blob to audio element to trigger recognition
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.play();
          recognition.start();
        });
      }

      setError('Speech recognition not available. Please type your answer.');
      throw new Error('Speech recognition not available');
    }
  }, []);

  const speak = useCallback(async (text: string, voice: string = 'professional'): Promise<void> => {
    setIsPlaying(true);
    setError(null);

    try {
      const audioBlob = await apiClient.textToSpeech(text, voice);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err: any) {
      setError(err.message);
      setIsPlaying(false);
      console.error('Error playing audio:', err);
      
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  }, []);

  const recordAndTranscribe = useCallback(async (): Promise<string> => {
    await startRecording();
    
    // Wait for user to stop (you'd typically have a button for this)
    // This is just a helper - actual implementation would be controlled by UI
    const audioBlob = await stopRecording();
    return await transcribe(audioBlob);
  }, [startRecording, stopRecording, transcribe]);

  return {
    isRecording,
    isPlaying,
    error,
    startRecording,
    stopRecording,
    transcribe,
    speak,
    recordAndTranscribe,
  };
}

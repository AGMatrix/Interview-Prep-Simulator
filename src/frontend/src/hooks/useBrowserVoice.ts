import { useState, useCallback, useRef } from 'react';

/**
 * Browser-based voice recognition using Web Speech API
 * Works in Chrome, Edge, Safari (with prefixes)
 */
export function useBrowserVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  const startRecording = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check browser support
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

      if (!SpeechRecognition) {
        const err = 'Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.';
        setError(err);
        reject(new Error(err));
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      transcriptRef.current = '';

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
        console.log('Voice recognition started');
        resolve(); // Resolve immediately when recording starts
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript) {
          transcriptRef.current += finalTranscript;
          console.log('Final transcript so far:', transcriptRef.current);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);

        let errorMessage = '';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try speaking again.';
        } else if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          errorMessage = 'Microphone access denied. Click the 🔒 in the address bar and allow microphone access, then reload the page.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (event.error === 'aborted') {
          errorMessage = 'Recording was stopped.';
        } else {
          errorMessage = `Speech recognition error: ${event.error}. Please try typing your answer instead.`;
        }

        setError(errorMessage);
        reject(new Error(errorMessage));
      };

      recognition.onend = () => {
        console.log('Voice recognition ended unexpectedly');
        // Only set recording to false if it wasn't manually stopped
        if (recognitionRef.current === recognition) {
          setIsRecording(false);
          // Auto-restart if it stops unexpectedly while we're still "recording"
          setTimeout(() => {
            if (recognitionRef.current === recognition && !error) {
              console.log('Auto-restarting recognition...');
              try {
                recognition.start();
              } catch (e) {
                console.error('Failed to restart:', e);
                setIsRecording(false);
              }
            }
          }, 100);
        }
      };

      try {
        recognition.start();
      } catch (err: any) {
        setError(err.message);
        setIsRecording(false);
        reject(err);
      }
    });
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!recognitionRef.current) {
        resolve('');
        return;
      }

      const recognition = recognitionRef.current;
      const finalText = transcriptRef.current.trim();

      // Clear the ref to prevent auto-restart
      recognitionRef.current = null;

      recognition.onend = () => {
        setIsRecording(false);
        console.log('Stopped. Final text:', finalText);
        resolve(finalText);
        transcriptRef.current = '';
      };

      recognition.stop();
    });
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    setIsPlaying(true);
    setError(null);

    try {
      // Use browser's Speech Synthesis API
      if ('speechSynthesis' in window) {
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);

          // Try to use a professional-sounding voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) => v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Samantha')
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          utterance.rate = 0.95; // Slightly slower for clarity
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          utterance.onend = () => {
            setIsPlaying(false);
            resolve();
          };

          utterance.onerror = (event) => {
            setIsPlaying(false);
            setError(`Speech synthesis error: ${event.error}`);
            reject(new Error(`Speech synthesis error: ${event.error}`));
          };

          window.speechSynthesis.speak(utterance);
        });
      } else {
        throw new Error('Speech synthesis not supported in this browser');
      }
    } catch (err: any) {
      setError(err.message);
      setIsPlaying(false);
      throw err;
    }
  }, []);

  return {
    isRecording,
    isPlaying,
    error,
    startRecording,
    stopRecording,
    speak,
  };
}

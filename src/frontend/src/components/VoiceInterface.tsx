import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceInterfaceProps {
  sessionId: string;
  disabled?: boolean;
  onTranscript: (text: string) => void;
  currentQuestion?: string;
}

export default function VoiceInterface({
  sessionId,
  disabled,
  onTranscript,
  currentQuestion,
}: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play question audio when it changes
  useEffect(() => {
    if (currentQuestion && !isRecording) {
      speakQuestion(currentQuestion);
    }
  }, [currentQuestion]);

  const speakQuestion = async (text: string) => {
    if (isMuted) return;

    try {
      setIsSpeaking(true);

      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = volume;
      
      audioRef.current.onended = () => {
        setIsSpeaking(false);
      };

      await audioRef.current.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsSpeaking(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('Listening...');
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setTranscript('Transcribing...');

      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('sessionId', sessionId);

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const transcriptText = data.transcript;

      setTranscript(transcriptText);
      onTranscript(transcriptText);

      // Auto-clear after 3 seconds
      setTimeout(() => setTranscript(''), 3000);
    } catch (error) {
      console.error('Transcription error:', error);
      setTranscript('Error transcribing audio');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  return (
    <div className="space-y-6">
      {/* Audio Visualization */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center overflow-hidden">
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    height: '40px',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-full opacity-20 animate-ping" />
              <Mic className="relative w-16 h-16 text-red-500" />
            </div>
          </div>
        )}

        {!isRecording && !isSpeaking && (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Ready to answer</p>
            <p className="text-sm text-gray-400">Click the mic to start speaking</p>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Your answer:</p>
          <p className="text-gray-900">{transcript}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isSpeaking}
          className={`flex items-center justify-center w-20 h-20 rounded-full transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>

        {/* Volume Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-gray-600" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-600" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-32"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isRecording
            ? 'Recording your answer... Click to stop'
            : isSpeaking
            ? 'AI is speaking...'
            : 'Click the microphone to start answering'}
        </p>
      </div>
    </div>
  );
}
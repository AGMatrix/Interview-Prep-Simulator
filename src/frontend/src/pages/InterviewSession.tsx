import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import { useVoice } from '../hooks/useVoice';

interface InterviewSessionProps {
  userId: string;
  sessionId?: string;
}

export function InterviewSession({ userId, sessionId }: InterviewSessionProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    session,
    loading: interviewLoading,
    error: interviewError,
    isComplete,
    startInterview,
    sendAnswer,
    endInterview,
  } = useInterview();

  const {
    isRecording,
    isPlaying,
    error: voiceError,
    startRecording,
    stopRecording,
    transcribe,
    speak,
  } = useVoice();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.conversationHistory]);

  const handleStartInterview = async () => {
    try {
      await startInterview({
        userId,
        interviewType: 'SDE',
        experienceLevel: 2,
        rounds: ['BEHAVIORAL', 'TECHNICAL'],
      });
    } catch (err) {
      console.error('Failed to start interview:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const result = await sendAnswer(inputMessage);
      setInputMessage('');

      // Speak the response if voice mode is enabled
      if (useVoiceMode && result.interviewerResponse) {
        await speak(result.interviewerResponse);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      const text = await transcribe(audioBlob);
      setInputMessage(text);
    } else {
      await startRecording();
    }
  };

  const handleEndInterview = async () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      await endInterview();
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">AI Interview Prep Simulator</h1>
          <p className="text-gray-600 mb-6">Ready to start your interview?</p>
          <button
            onClick={handleStartInterview}
            disabled={interviewLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {interviewLoading ? 'Starting...' : 'Start Interview'}
          </button>
          {interviewError && (
            <p className="mt-4 text-red-600 text-sm">{interviewError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              {session.interviewType} Interview - Round: {session.currentRound}
            </h1>
            <p className="text-sm text-gray-600">
              Experience Level: {session.experienceLevel} years
            </p>
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useVoiceMode}
                onChange={(e) => setUseVoiceMode(e.target.checked)}
                className="rounded"
              />
              Voice Mode
            </label>
            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              End Interview
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.conversationHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'candidate' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-2xl p-4 rounded-lg ${
                message.role === 'candidate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="text-xs opacity-70 mb-1">
                {message.role === 'candidate' ? 'You' : 'Interviewer'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your answer here... (Shift+Enter for new line)"
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={interviewLoading || isRecording}
            />
            <div className="flex flex-col gap-2">
              {useVoiceMode && (
                <button
                  onClick={handleVoiceInput}
                  className={`px-6 py-2 rounded-lg ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {isRecording ? '⏹ Stop' : '🎤 Speak'}
                </button>
              )}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || interviewLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {interviewLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
          {(interviewError || voiceError) && (
            <p className="mt-2 text-red-600 text-sm">{interviewError || voiceError}</p>
          )}
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="bg-green-50 border-t border-green-200 p-4 text-center">
          <p className="text-green-800 font-semibold">Interview Complete!</p>
          <p className="text-sm text-gray-600 mt-1">
            Check your final evaluation and analytics.
          </p>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback } from 'react';
import apiClient, { type InterviewSession } from '../api/client';

export function useInterview() {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startInterview = useCallback(async (params: {
    userId: string;
    interviewType: string;
    experienceLevel: number;
    rounds?: string[];
    resumeId?: string;
    jdId?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.startSession(params);
      setSession(result.session);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendAnswer = useCallback(async (message: string, audio?: string) => {
    if (!session) {
      throw new Error('No active session');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.sendMessage(session.id, message, audio);
      const updatedSession = await apiClient.getSession(session.id);
      setSession(updatedSession);

      if (result.sessionComplete) {
        setIsComplete(true);
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const endInterview = useCallback(async () => {
    if (!session) {
      throw new Error('No active session');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.endSession(session.id);
      setIsComplete(true);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  return {
    session,
    loading,
    error,
    isComplete,
    startInterview,
    sendAnswer,
    endInterview,
  };
}

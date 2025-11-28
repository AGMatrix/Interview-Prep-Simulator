import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from './api/client';

type Screen = 'home' | 'interview' | 'results';

interface GrammarError {
	message: string;
	offset: number;
	length: number;
	replacements: string[];
}

interface SessionData {
	sessionId: string;
	currentQuestion: string;
	conversationHistory: Array<{
		role: 'interviewer' | 'candidate';
		content: string;
		timestamp: string;
	}>;
	evaluations: Array<{
		scores: {
			correctness: number;
			depth: number;
			clarity: number;
			completeness: number;
		};
		feedback: string;
	}>;
	round: string;
	status: string;
}

export default function App() {
	const [screen, setScreen] = useState<Screen>('home');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [interviewConfig, setInterviewConfig] = useState({
		userId: '',
		interviewType: 'backend',
		experienceLevel: 3,
	});

	const [sessionData, setSessionData] = useState<SessionData | null>(null);
	const [userAnswer, setUserAnswer] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([]);
	const recognitionRef = useRef<any>(null);
	const [resumeText, setResumeText] = useState('');
	const [jobDescription, setJobDescription] = useState('');
	const [gapAnalysis, setGapAnalysis] = useState<any>(null);
	const [analyzingGap, setAnalyzingGap] = useState(false);

	// Initialize speech recognition
	useEffect(() => {
		const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		if (SpeechRecognition) {
			const recognition = new SpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = 'en-US';

			recognition.onresult = (event: any) => {
				let finalTranscript = '';
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						finalTranscript += transcript + ' ';
					}
				}
				if (finalTranscript) {
					setUserAnswer(prev => prev + finalTranscript);
				}
			};

			recognition.onerror = (event: any) => {
				console.error('Speech recognition error:', event.error);
				setIsRecording(false);
			};

			recognition.onend = () => {
				setIsRecording(false);
			};

			recognitionRef.current = recognition;
		}
	}, []);

	// Check grammar as user types
	useEffect(() => {
		if (!userAnswer.trim()) {
			setGrammarErrors([]);
			return;
		}

		const checkGrammar = async () => {
			try {
				// Simple grammar check using regex patterns
				const errors: GrammarError[] = [];

				// Check for common grammatical errors
				const patterns = [
					{ regex: /\bi\b/g, message: 'Use "I" (capital) instead of "i"', replacement: 'I' },
					{ regex: /\bdont\b/g, message: 'Missing apostrophe', replacement: "don't" },
					{ regex: /\bdidnt\b/g, message: 'Missing apostrophe', replacement: "didn't" },
					{ regex: /\bwont\b/g, message: 'Missing apostrophe', replacement: "won't" },
					{ regex: /\bcant\b/g, message: 'Missing apostrophe', replacement: "can't" },
					{ regex: /\bim\b/gi, message: 'Use "I\'m" or "I am"', replacement: "I'm" },
					{ regex: /\s{2,}/g, message: 'Multiple spaces', replacement: ' ' },
					{ regex: /\.\./g, message: 'Double period', replacement: '.' }
				];

				patterns.forEach(({ regex, message, replacement }) => {
					let match;
					while ((match = regex.exec(userAnswer)) !== null) {
						errors.push({
							message,
							offset: match.index,
							length: match[0].length,
							replacements: [replacement]
						});
					}
				});

				setGrammarErrors(errors);
			} catch (err) {
				console.error('Grammar check error:', err);
			}
		};

		const timeoutId = setTimeout(checkGrammar, 500);
		return () => clearTimeout(timeoutId);
	}, [userAnswer]);

	function toggleRecording() {
		if (!recognitionRef.current) {
			setError('Speech recognition not supported in this browser');
			return;
		}

		if (isRecording) {
			recognitionRef.current.stop();
			setIsRecording(false);
		} else {
			try {
				recognitionRef.current.start();
				setIsRecording(true);
				setError(null);
			} catch (err: any) {
				setError('Microphone permission denied or already in use');
			}
		}
	}

	function fixGrammarError(error: GrammarError) {
		const before = userAnswer.substring(0, error.offset);
		const after = userAnswer.substring(error.offset + error.length);
		setUserAnswer(before + error.replacements[0] + after);
	}

	async function analyzeGap() {
		if (!resumeText.trim() || !jobDescription.trim()) {
			setError('Please provide both resume and job description');
			return;
		}

		setAnalyzingGap(true);
		setError(null);
		try {
			// Call backend to analyze gap using AI
			const response = await fetch('https://interview-prep-simulator.garg-vision.workers.dev/api/gap-analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ resume: resumeText, jobDescription })
			});

			const data = await response.json();
			setGapAnalysis(data);
		} catch (err: any) {
			setError(err?.message || String(err));
		} finally {
			setAnalyzingGap(false);
		}
	}

	async function startInterview() {
		if (!interviewConfig.userId.trim()) {
			setError('Please enter a User ID');
			return;
		}

		setError(null);
		setLoading(true);
		try {
			const resp = await apiClient.startSession(interviewConfig);
			setSessionData({
				sessionId: resp.sessionId,
				currentQuestion: typeof resp.firstQuestion === 'string'
					? resp.firstQuestion
					: resp.firstQuestion?.text || JSON.stringify(resp.firstQuestion),
				conversationHistory: resp.session.conversationHistory,
				evaluations: [],
				round: resp.session.currentRound,
				status: resp.session.status,
			});
			setScreen('interview');
		} catch (err: any) {
			setError(err?.message || String(err));
		} finally {
			setLoading(false);
		}
	}

	async function submitAnswer() {
		if (!userAnswer.trim() || !sessionData) return;

		setError(null);
		setLoading(true);
		try {
			const resp = await apiClient.sendMessage(sessionData.sessionId, userAnswer);

			const nextQuestion = typeof resp.interviewerResponse === 'string'
				? resp.interviewerResponse
				: resp.interviewerResponse?.text || JSON.stringify(resp.interviewerResponse);

			setSessionData({
				...sessionData,
				currentQuestion: nextQuestion,
				conversationHistory: [
					...sessionData.conversationHistory,
					{
						role: 'candidate',
						content: userAnswer,
						timestamp: new Date().toISOString(),
					},
					{
						role: 'interviewer',
						content: nextQuestion,
						timestamp: new Date().toISOString(),
					},
				],
				evaluations: [...sessionData.evaluations, resp.evaluation],
			});

			setUserAnswer('');

			if (resp.sessionComplete) {
				setScreen('results');
			}
		} catch (err: any) {
			setError(err?.message || String(err));
		} finally {
			setLoading(false);
		}
	}

	async function endInterview() {
		if (!sessionData) return;
		setScreen('results');
	}

	// HOME SCREEN
	if (screen === 'home') {
		return (
			<div style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 20,
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
			}}>
				<div style={{
					maxWidth: 500,
					width: '100%',
					background: 'white',
					borderRadius: 20,
					padding: 40,
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
				}}>
					<h1 style={{ fontSize: 32, fontWeight: 700, color: '#1f2937', marginBottom: 10 }}>
						AI Interview Prep
					</h1>
					<p style={{ color: '#6b7280', marginBottom: 30 }}>
						Practice technical interviews with AI-powered feedback
					</p>

					<div style={{ marginBottom: 20 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
							User ID
						</label>
						<input
							type="text"
							value={interviewConfig.userId}
							onChange={(e) => setInterviewConfig({ ...interviewConfig, userId: e.target.value })}
							placeholder="your-name"
							style={{
								width: '100%',
								padding: 12,
								border: '2px solid #e5e7eb',
								borderRadius: 8,
								fontSize: 16,
								outline: 'none',
								transition: 'border 0.2s'
							}}
							onFocus={(e) => e.target.style.borderColor = '#667eea'}
							onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
						/>
					</div>

					<div style={{ marginBottom: 20 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
							Interview Type
						</label>
						<select
							value={interviewConfig.interviewType}
							onChange={(e) => setInterviewConfig({ ...interviewConfig, interviewType: e.target.value })}
							style={{
								width: '100%',
								padding: 12,
								border: '2px solid #e5e7eb',
								borderRadius: 8,
								fontSize: 16,
								outline: 'none',
								background: 'white'
							}}
						>
							<option value="backend">Backend Engineering</option>
							<option value="frontend">Frontend Engineering</option>
							<option value="fullstack">Full Stack</option>
							<option value="devops">DevOps</option>
							<option value="data">Data Science</option>
						</select>
					</div>

					<div style={{ marginBottom: 20 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
							Experience Level: {interviewConfig.experienceLevel} years
						</label>
						<input
							type="range"
							min="0"
							max="10"
							value={interviewConfig.experienceLevel}
							onChange={(e) => setInterviewConfig({ ...interviewConfig, experienceLevel: parseInt(e.target.value) })}
							style={{ width: '100%' }}
						/>
					</div>

					<div style={{ marginBottom: 20 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
							Resume (Optional - for personalized interview prep)
						</label>
						<textarea
							value={resumeText}
							onChange={(e) => setResumeText(e.target.value)}
							placeholder="Paste your resume text here..."
							rows={5}
							style={{
								width: '100%',
								padding: 12,
								border: '2px solid #e5e7eb',
								borderRadius: 8,
								fontSize: 14,
								outline: 'none',
								resize: 'vertical',
								fontFamily: 'inherit'
							}}
							onFocus={(e) => e.target.style.borderColor = '#667eea'}
							onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
						/>
					</div>

					<div style={{ marginBottom: 20 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
							Job Description (Optional - for gap analysis)
						</label>
						<textarea
							value={jobDescription}
							onChange={(e) => setJobDescription(e.target.value)}
							placeholder="Paste the job description here..."
							rows={4}
							style={{
								width: '100%',
								padding: 12,
								border: '2px solid #e5e7eb',
								borderRadius: 8,
								fontSize: 14,
								outline: 'none',
								resize: 'vertical',
								fontFamily: 'inherit'
							}}
							onFocus={(e) => e.target.style.borderColor = '#667eea'}
							onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
						/>
					</div>

					{resumeText && jobDescription && !gapAnalysis && (
						<button
							onClick={analyzeGap}
							disabled={analyzingGap}
							style={{
								width: '100%',
								padding: 12,
								marginBottom: 20,
								background: analyzingGap ? '#9ca3af' : '#f59e0b',
								color: 'white',
								border: 'none',
								borderRadius: 8,
								fontSize: 14,
								fontWeight: 600,
								cursor: analyzingGap ? 'not-allowed' : 'pointer'
							}}
						>
							{analyzingGap ? 'Analyzing Gap...' : '🔍 Analyze Resume vs JD Gap'}
						</button>
					)}

					{gapAnalysis && (
						<div style={{
							marginBottom: 20,
							padding: 16,
							background: '#f0f9ff',
							border: '2px solid #3b82f6',
							borderRadius: 8
						}}>
							<div style={{ fontSize: 14, fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>
								📊 Gap Analysis Results
							</div>
							<div style={{ fontSize: 13, color: '#1e3a8a', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
								<strong>Matching Skills:</strong> {gapAnalysis.matchingSkills?.join(', ') || 'None'}
								{'\n\n'}
								<strong>Missing Skills:</strong> {gapAnalysis.missingSkills?.join(', ') || 'None'}
								{'\n\n'}
								<strong>Recommendations:</strong>
								{gapAnalysis.recommendations?.map((r: string, i: number) => `\n${i + 1}. ${r}`).join('') || 'None'}
							</div>
						</div>
					)}

					{error && (
						<div style={{
							padding: 12,
							background: '#fef2f2',
							color: '#dc2626',
							borderRadius: 8,
							marginBottom: 20,
							fontSize: 14
						}}>
							{error}
						</div>
					)}

					<button
						onClick={startInterview}
						disabled={loading}
						style={{
							width: '100%',
							padding: 16,
							background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							border: 'none',
							borderRadius: 8,
							fontSize: 18,
							fontWeight: 600,
							cursor: loading ? 'not-allowed' : 'pointer',
							transition: 'transform 0.2s'
						}}
						onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
						onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
					>
						{loading ? 'Starting...' : 'Start Interview'}
					</button>
				</div>
			</div>
		);
	}

	// INTERVIEW SCREEN
	if (screen === 'interview' && sessionData) {
		return (
			<div style={{
				minHeight: '100vh',
				background: '#f9fafb',
				padding: 20,
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
			}}>
				<div style={{ maxWidth: 800, margin: '0 auto' }}>
					{/* Header */}
					<div style={{
						background: 'white',
						padding: 20,
						borderRadius: 12,
						marginBottom: 20,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', margin: 0 }}>
									{interviewConfig.interviewType.charAt(0).toUpperCase() + interviewConfig.interviewType.slice(1)} Interview
								</h2>
								<p style={{ color: '#6b7280', margin: 0, marginTop: 4 }}>
									Round: {sessionData.round} • Question {sessionData.conversationHistory.filter(m => m.role === 'candidate').length + 1}
								</p>
							</div>
							<button
								onClick={endInterview}
								style={{
									padding: '10px 20px',
									background: '#ef4444',
									color: 'white',
									border: 'none',
									borderRadius: 6,
									fontWeight: 600,
									cursor: 'pointer'
								}}
							>
								End Interview
							</button>
						</div>
					</div>

					{/* Question */}
					<div style={{
						background: 'white',
						padding: 30,
						borderRadius: 12,
						marginBottom: 20,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<div style={{
							fontSize: 14,
							fontWeight: 600,
							color: '#667eea',
							marginBottom: 10,
							textTransform: 'uppercase',
							letterSpacing: '0.5px'
						}}>
							Interviewer Question
						</div>
						<div style={{ fontSize: 18, color: '#1f2937', lineHeight: 1.6 }}>
							{sessionData.currentQuestion}
						</div>
					</div>

					{/* Answer Input */}
					<div style={{
						background: 'white',
						padding: 30,
						borderRadius: 12,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
							<label style={{
								fontSize: 14,
								fontWeight: 600,
								color: '#374151'
							}}>
								Your Answer
							</label>
							<button
								onClick={toggleRecording}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									padding: '8px 16px',
									background: isRecording ? '#ef4444' : '#667eea',
									color: 'white',
									border: 'none',
									borderRadius: 6,
									fontSize: 14,
									fontWeight: 600,
									cursor: 'pointer',
									transition: 'all 0.2s'
								}}
							>
								<span style={{ fontSize: 18 }}>🎤</span>
								{isRecording ? 'Stop Recording' : 'Voice Input'}
							</button>
						</div>

						<textarea
							value={userAnswer}
							onChange={(e) => setUserAnswer(e.target.value)}
							placeholder="Type or speak your answer..."
							rows={8}
							style={{
								width: '100%',
								padding: 16,
								border: grammarErrors.length > 0 ? '2px solid #f59e0b' : '2px solid #e5e7eb',
								borderRadius: 8,
								fontSize: 16,
								lineHeight: 1.6,
								outline: 'none',
								resize: 'vertical',
								fontFamily: 'inherit'
							}}
							onFocus={(e) => e.target.style.borderColor = grammarErrors.length > 0 ? '#f59e0b' : '#667eea'}
							onBlur={(e) => e.target.style.borderColor = grammarErrors.length > 0 ? '#f59e0b' : '#e5e7eb'}
						/>

						{/* Grammar Errors */}
						{grammarErrors.length > 0 && (
							<div style={{
								marginTop: 12,
								padding: 12,
								background: '#fffbeb',
								border: '1px solid #fbbf24',
								borderRadius: 8
							}}>
								<div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>
									⚠️ Grammar Suggestions ({grammarErrors.length})
								</div>
								{grammarErrors.slice(0, 3).map((error, idx) => (
									<div key={idx} style={{
										fontSize: 13,
										color: '#78350f',
										marginBottom: 6,
										display: 'flex',
										alignItems: 'center',
										gap: 8
									}}>
										<span>• {error.message}</span>
										<button
											onClick={() => fixGrammarError(error)}
											style={{
												padding: '2px 8px',
												background: '#fbbf24',
												color: '#78350f',
												border: 'none',
												borderRadius: 4,
												fontSize: 11,
												fontWeight: 600,
												cursor: 'pointer'
											}}
										>
											Fix
										</button>
									</div>
								))}
							</div>
						)}

						{error && (
							<div style={{
								padding: 12,
								background: '#fef2f2',
								color: '#dc2626',
								borderRadius: 8,
								marginTop: 16,
								fontSize: 14
							}}>
								{error}
							</div>
						)}

						<button
							onClick={submitAnswer}
							disabled={!userAnswer.trim() || loading}
							style={{
								marginTop: 16,
								width: '100%',
								padding: 16,
								background: (!userAnswer.trim() || loading) ? '#9ca3af' : '#667eea',
								color: 'white',
								border: 'none',
								borderRadius: 8,
								fontSize: 16,
								fontWeight: 600,
								cursor: (!userAnswer.trim() || loading) ? 'not-allowed' : 'pointer',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => userAnswer.trim() && !loading && (e.currentTarget.style.background = '#5568d3')}
							onMouseLeave={(e) => userAnswer.trim() && !loading && (e.currentTarget.style.background = '#667eea')}
						>
							{loading ? 'Submitting...' : 'Submit Answer →'}
						</button>
					</div>

					{/* Previous Evaluations */}
					{sessionData.evaluations.length > 0 && (
						<div style={{ marginTop: 20 }}>
							<h3 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 16 }}>
								Previous Feedback
							</h3>
							{sessionData.evaluations.map((evaluation, idx) => (
								<div key={idx} style={{
									background: 'white',
									padding: 20,
									borderRadius: 12,
									marginBottom: 12,
									boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
								}}>
									<div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
										<div style={{ flex: 1, textAlign: 'center' }}>
											<div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Correctness</div>
											<div style={{ fontSize: 20, fontWeight: 700, color: '#667eea' }}>
												{evaluation.scores.correctness}/10
											</div>
										</div>
										<div style={{ flex: 1, textAlign: 'center' }}>
											<div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Depth</div>
											<div style={{ fontSize: 20, fontWeight: 700, color: '#667eea' }}>
												{evaluation.scores.depth}/10
											</div>
										</div>
										<div style={{ flex: 1, textAlign: 'center' }}>
											<div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Clarity</div>
											<div style={{ fontSize: 20, fontWeight: 700, color: '#667eea' }}>
												{evaluation.scores.clarity}/10
											</div>
										</div>
										<div style={{ flex: 1, textAlign: 'center' }}>
											<div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Completeness</div>
											<div style={{ fontSize: 20, fontWeight: 700, color: '#667eea' }}>
												{evaluation.scores.completeness}/10
											</div>
										</div>
									</div>
									<div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
										{evaluation.feedback}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}

	// RESULTS SCREEN
	if (screen === 'results' && sessionData) {
		const avgScore = sessionData.evaluations.length > 0
			? sessionData.evaluations.reduce((sum, e) =>
				sum + (e.scores.correctness + e.scores.depth + e.scores.clarity + e.scores.completeness) / 4, 0
			) / sessionData.evaluations.length
			: 0;

		return (
			<div style={{
				minHeight: '100vh',
				background: '#f9fafb',
				padding: 20,
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
			}}>
				<div style={{ maxWidth: 800, margin: '0 auto' }}>
					<div style={{
						background: 'white',
						padding: 40,
						borderRadius: 12,
						textAlign: 'center',
						marginBottom: 20,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<h1 style={{ fontSize: 32, fontWeight: 700, color: '#1f2937', marginBottom: 10 }}>
							Interview Complete!
						</h1>
						<div style={{ fontSize: 48, fontWeight: 700, color: '#667eea', marginBottom: 10 }}>
							{avgScore.toFixed(1)}/10
						</div>
						<p style={{ color: '#6b7280', fontSize: 16 }}>
							Average Score • {sessionData.evaluations.length} Questions Answered
						</p>
					</div>

					<div style={{
						background: 'white',
						padding: 30,
						borderRadius: 12,
						marginBottom: 20,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<h2 style={{ fontSize: 20, fontWeight: 600, color: '#1f2937', marginBottom: 20 }}>
							Detailed Feedback
						</h2>
						{sessionData.evaluations.map((evaluation, idx) => (
							<div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < sessionData.evaluations.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
								<div style={{ fontSize: 14, fontWeight: 600, color: '#667eea', marginBottom: 12 }}>
									Question {idx + 1}
								</div>
								<div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
									<div style={{ flex: 1, textAlign: 'center', padding: 12, background: '#f9fafb', borderRadius: 6 }}>
										<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Correctness</div>
										<div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>
											{evaluation.scores.correctness}/10
										</div>
									</div>
									<div style={{ flex: 1, textAlign: 'center', padding: 12, background: '#f9fafb', borderRadius: 6 }}>
										<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Depth</div>
										<div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>
											{evaluation.scores.depth}/10
										</div>
									</div>
									<div style={{ flex: 1, textAlign: 'center', padding: 12, background: '#f9fafb', borderRadius: 6 }}>
										<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Clarity</div>
										<div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>
											{evaluation.scores.clarity}/10
										</div>
									</div>
									<div style={{ flex: 1, textAlign: 'center', padding: 12, background: '#f9fafb', borderRadius: 6 }}>
										<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Completeness</div>
										<div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>
											{evaluation.scores.completeness}/10
										</div>
									</div>
								</div>
								<div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
									{evaluation.feedback}
								</div>
							</div>
						))}
					</div>

					<button
						onClick={() => {
							setScreen('home');
							setSessionData(null);
							setUserAnswer('');
							setError(null);
						}}
						style={{
							width: '100%',
							padding: 16,
							background: '#667eea',
							color: 'white',
							border: 'none',
							borderRadius: 8,
							fontSize: 16,
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Start New Interview
					</button>
				</div>
			</div>
		);
	}

	return null;
}

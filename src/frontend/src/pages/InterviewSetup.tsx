import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Link as LinkIcon } from 'lucide-react';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interviewType: 'SDE',
    experienceLevel: 2,
    rounds: ['BEHAVIORAL', 'TECHNICAL', 'CODING'],
    resumeFile: null as File | null,
    jdUrl: '',
    jdText: '',
  });

  const interviewTypes = [
    { value: 'SDE', label: 'Software Engineer' },
    { value: 'SDE_INTERN', label: 'SDE Intern' },
    { value: 'CLOUD_ENGINEER', label: 'Cloud Engineer' },
    { value: 'DATA_ENGINEER', label: 'Data Engineer' },
    { value: 'AI_ML_ENGINEER', label: 'AI/ML Engineer' },
    { value: 'SECURITY', label: 'Security Engineer' },
    { value: 'DEVOPS', label: 'DevOps Engineer' },
  ];

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resumeFile: file });
    }
  };

  const handleSubmit = async () => {
    try {
      // Upload resume if provided
      let resumeId = null;
      if (formData.resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append('resume', formData.resumeFile);

        const resumeResponse = await fetch('/api/resume/upload', {
          method: 'POST',
          body: resumeFormData,
        });
        const resumeData = await resumeResponse.json();
        resumeId = resumeData.resumeId;
      }

      // Analyze JD if provided
      let jdId = null;
      if (formData.jdUrl || formData.jdText) {
        const jdResponse = await fetch('/api/jd/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: formData.jdUrl || undefined,
            text: formData.jdText || undefined,
          }),
        });
        const jdData = await jdResponse.json();
        jdId = jdData.jdId;
      }

      // Start interview session
      const sessionResponse = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-123', // Replace with actual user ID
          interviewType: formData.interviewType,
          experienceLevel: formData.experienceLevel,
          rounds: formData.rounds,
          resumeId,
          jdId,
        }),
      });

      const { sessionId } = await sessionResponse.json();
      navigate(`/interview/${sessionId}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Set Up Your Interview
          </h1>
          <p className="mt-2 text-gray-600">
            Configure your interview settings and upload your materials
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Interview Type */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Choose Interview Type</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {interviewTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, interviewType: type.value })}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.interviewType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium">{type.label}</h3>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={0}>0 years (Intern)</option>
                  <option value={1}>1-2 years</option>
                  <option value={2}>2-5 years</option>
                  <option value={5}>5+ years (Senior)</option>
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Resume & JD */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Upload Resume & Job Description</h2>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (Optional but Recommended)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx"
                          onChange={handleResumeUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                    {formData.resumeFile && (
                      <p className="text-sm text-green-600">
                        ✓ {formData.resumeFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* JD Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      placeholder="Paste job posting URL"
                      value={formData.jdUrl}
                      onChange={(e) => setFormData({ ...formData, jdUrl: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <p className="text-center text-sm text-gray-500">OR</p>
                  
                  <textarea
                    placeholder="Paste job description text..."
                    value={formData.jdText}
                    onChange={(e) => setFormData({ ...formData, jdText: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Start Interview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
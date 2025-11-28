-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  experience_level INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  final_score REAL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Interview Questions
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('behavioral', 'technical', 'coding', 'system_design')),
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  category TEXT,
  text TEXT NOT NULL,
  expected_answer TEXT,
  follow_up_hints TEXT,
  tags TEXT,
  source TEXT,
  company TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session Messages
CREATE TABLE IF NOT EXISTS session_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('interviewer', 'candidate')),
  content TEXT NOT NULL,
  audio_url TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  evaluation TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- User Skills & Progress
CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT,
  proficiency_level REAL DEFAULT 0.0,
  last_practiced TIMESTAMP,
  practice_count INTEGER DEFAULT 0,
  is_weak_area BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Resumes
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  filename TEXT,
  parsed_data TEXT,
  r2_key TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Job Descriptions
CREATE TABLE IF NOT EXISTS job_descriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company TEXT,
  role TEXT,
  url TEXT,
  text TEXT,
  parsed_requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session ON session_messages(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type, difficulty);
CREATE INDEX IF NOT EXISTS idx_skills_user ON user_skills(user_id, is_weak_area);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions(tags);

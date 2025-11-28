# AI Interview Prep Simulator

> **Cloudflare Workers AI Internship Project (Winter 2025)**

A full-stack AI-powered interview preparation platform built entirely on Cloudflare's edge infrastructure. Practice technical, behavioral, coding, and system design interviews with realistic AI feedback, voice interaction, and personalized gap analysis.

---

## How This Project Satisfies Cloudflare Internship Requirements

This project fulfills **all four core requirements** of the Cloudflare Workers AI internship assignment:

### 1. Use Cloudflare Workers AI (LLM)

**Implementation**: Uses **Llama 3.3 70B Instruct FP8 Fast** (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) for multiple AI capabilities:

- **Question Generation** ([src/services/llm.ts:15-34](src/services/llm.ts#L15))
  - Generates diverse, non-repetitive interview questions
  - Adapts difficulty based on candidate performance
  - 30+ topic seeds for variety across behavioral/technical rounds

- **Answer Evaluation** ([src/services/llm.ts:36-93](src/services/llm.ts#L36))
  - Realistic scoring (most answers 5-7, exceptional 8-10)
  - Evaluates correctness, depth, clarity, and completeness
  - NLP-enhanced feedback with grammar and confidence metrics

- **Follow-up Generation** ([src/services/llm.ts:95-129](src/services/llm.ts#L95))
  - Conversational, intelligent follow-ups based on candidate answers
  - Probes unclear areas naturally

- **Final Evaluation** ([src/services/llm.ts:131-171](src/services/llm.ts#L131))
  - Comprehensive summary with strengths, weaknesses, and action items
  - Hiring recommendation (Strong Hire / Hire / No Hire)

- **Resume-JD Gap Analysis** ([src/workers/api.ts:468-540](src/workers/api.ts#L468))
  - AI-powered skill matching
  - Missing skills identification
  - Personalized recommendations

**Prompt Engineering**: Strict, realistic prompts in [src/utils/prompts.ts](src/utils/prompts.ts) ensure varied, high-quality AI responses.

---

### 2. Build a Workflow

**Implementation**: Multi-step interview orchestration using **Cloudflare Workers** as the workflow engine:

**Interview Flow Workflow** ([src/workers/api.ts](src/workers/api.ts)):
1. **Session Start** → User provides interview type, experience level
2. **Context Loading** → Fetch user memory from Durable Object + resume/JD if provided
3. **Question Generation** → LLM generates first question based on context
4. **Answer Submission** → User responds (text or voice)
5. **Evaluation** → LLM evaluates answer, NLP analyzes grammar/confidence
6. **Decision Point** → Follow-up needed? Generate follow-up : Next question
7. **Repeat** → Continue for N rounds (behavioral → technical → coding)
8. **Final Evaluation** → Generate comprehensive feedback
9. **Memory Update** → Store weak areas in Durable Object for future sessions

**Stateful Workflow** uses:
- **Workers** for orchestration logic
- **Durable Objects** for user memory/state persistence
- **D1 Database** for session history storage
- **KV Namespace** for active session caching (1-hour TTL)

**Gap Analysis Workflow** ([src/workers/api.ts:468-540](src/workers/api.ts#L468)):
1. User pastes resume + job description
2. LLM analyzes both documents
3. Extracts matching skills, missing skills, match percentage
4. Generates personalized recommendations and suggested interview questions

---

### 3. Accept User Input

**Implementation**: Multiple input methods for comprehensive user interaction:

**Text Input**:
- Chat-based answer submission ([src/frontend/src/App.tsx:264-270](src/frontend/src/App.tsx#L264))
- Resume paste (plain text) ([src/frontend/src/App.tsx:381-394](src/frontend/src/App.tsx#L381))
- Job description paste ([src/frontend/src/App.tsx:396-409](src/frontend/src/App.tsx#L396))

**Voice Input**:
- **Web Speech API** integration ([src/frontend/src/hooks/useBrowserVoice.ts](src/frontend/src/hooks/useBrowserVoice.ts))
- Browser-native speech recognition (Chrome, Edge, Safari)
- Continuous recording with auto-restart
- Real-time transcription
- Text-to-speech for questions (optional)

**Smart Input Processing**:
- Real-time grammar checking with one-click fixes ([src/frontend/src/App.tsx:87-130](src/frontend/src/App.tsx#L87))
- Input validation and error handling
- Microphone permission management

**User Configuration**:
- Interview type selection (Backend, Frontend, Data, DevOps, etc.)
- Experience level (0-20 years)
- Round selection (Behavioral, Technical, Coding, System Design)

---

### 4. Memory or State Management

**Implementation**: Multi-tier state architecture using Cloudflare's persistence layers:

#### **Durable Objects** - User Memory ([src/durable-objects/user-memory.ts](src/durable-objects/user-memory.ts))
- **Per-user stateful storage** (unique DO per userId)
- Stores:
  - Historical weak areas across all sessions
  - Skills and competencies
  - Past session summaries and scores
  - Learning progress tracking
- **Persistent across sessions** - memory survives browser close/refresh
- Accessed via `USER_MEMORY.idFromName(userId)`

#### **D1 Database** - Relational Storage ([schema.sql](schema.sql))
- **Users table**: User profiles, created_at, last_login
- **Sessions table**: Interview sessions with metadata (type, level, status, scores)
- **Session_messages table**: Full conversation history with evaluations
- **Resumes/JDs tables**: (Legacy, not actively used after paste-only switch)

#### **KV Namespace** - Active Session Cache
- **Fast access** to active interview sessions ([src/workers/api.ts:172-176](src/workers/api.ts#L172))
- **1-hour TTL** - auto-cleanup of abandoned sessions
- Key format: `session:{sessionId}`
- Reduces D1 reads during active interviews

#### **R2 Bucket** - Audio Storage (Optional)
- Stores audio recordings of candidate answers
- Used if `AUDIO_BUCKET` binding exists ([src/workers/api.ts:207-210](src/workers/api.ts#L207))

#### **State Flow Example**:
```
User starts session
  
1. Fetch user memory from Durable Object (past weak areas, skills)
  
2. Create new session in D1 (permanent record)
  
3. Cache session in KV (fast access during interview)
  
[Interview happens - messages stored in D1, session updated in KV]
  
4. Session ends -> Update Durable Object with new weak areas
  
5. Delete from KV (cleanup), keep D1 record (history)
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)              │
│  - Voice Input (Web Speech API)                             │
│  - Grammar Checking (Real-time)                             │
│  - Gap Analysis UI                                          │
│  └─────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers (Hono)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ API Worker (src/workers/api.ts)                       │  │
│  │  - Routes: /api/session, /api/gap-analysis           │  │
│  │  - Session orchestration                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│        ┌─────────────────────┼─────────────────────┐         │
│        ▼                     ▼                     ▼         │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐     │
│  │ Workers  │         │ Durable  │         │    D1    │     │
│  │   AI     │         │ Objects  │         │ Database │     │
│  │ (Llama)  │         │  (User   │         │          │     │
│  │          │         │  Memory) │         │          │     │
│  └──────────┘         └──────────┘         └──────────┘     │
│        │                     │                     │         │
│        └─────────────────────┴─────────────────────┘         │
│                              │                               │
│                              ▼                               │
│                       ┌──────────┐                           │
│                       │    KV    │                           │
│                       │  Cache   │                           │
│                       └──────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

**Request Flow**:
1. Frontend sends `/api/session/start` with userId, interviewType, experienceLevel
2. Worker fetches user context from Durable Object (`USER_MEMORY`)
3. LLM generates first question based on context
4. Session stored in D1 + cached in KV
5. Frontend displays question, user answers (text/voice)
6. Worker evaluates answer via LLM + NLP analysis
7. Next question or follow-up generated
8. Loop continues until session ends
9. Final evaluation generated, Durable Object updated with learnings

---

## Key Features

### Voice-Enabled Interviews
- Browser-native speech recognition (no API keys needed)
- Continuous recording with auto-restart on browser timeout
- Real-time transcription to text
- Text-to-speech for questions (optional)

### Realistic AI Evaluation
- **Varied scores** - not all 5s anymore!
- Short answers (20 words) → 2-4 scores
- Good answers (80+ words) → 6-8 scores
- Exceptional answers (150+ words) → 8-10 scores
- NLP-enhanced feedback (word count, confidence, sentiment)

### Diverse Question Generation
- **30+ topic seeds** prevent question repetition
- Topics rotate: Database indexing, Caching, Message queues, Production incidents, Technical debt, etc.
- Conversation history checked to avoid duplicates
- Difficulty adapts based on candidate performance

### Resume-JD Gap Analysis
- Paste resume + job description (plain text)
- AI identifies matching vs. missing skills
- Match percentage calculation
- Personalized recommendations
- Suggested interview questions for weak areas

### Grammar Checking
- Real-time error detection (apostrophes, capitalization, spacing)
- One-click fix buttons
- 8 common error patterns

### Persistent Memory
- User weak areas tracked across sessions
- Performance history stored
- Skills database updated
- Recommendations improve over time

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Cloudflare account (free tier works)
- Wrangler CLI (`npm install -g wrangler`)

### 1. Clone and Install
```bash
git clone https://github.com/AGMatrix/interview-prep-simulator.git
cd interview-prep-simulator
npm install
```

### 2. Set Up Cloudflare Resources

#### Login to Cloudflare
```bash
wrangler login
```

#### Create D1 Database
```bash
wrangler d1 create interview-prep-db
```

Copy the `database_id` from output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "interview-prep-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

#### Initialize Database Schema
```bash
wrangler d1 execute interview-prep-db --file=./schema.sql
```

#### Create KV Namespace
```bash
wrangler kv:namespace create SESSION_CACHE
```

Update `wrangler.toml` with the KV namespace ID:
```toml
[[kv_namespaces]]
binding = "SESSION_CACHE"
id = "YOUR_KV_NAMESPACE_ID_HERE"
```

#### (Optional) Create R2 Bucket for Audio Storage
```bash
wrangler r2 bucket create interview-audio
```

Add to `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "AUDIO_BUCKET"
bucket_name = "interview-audio"
```

### 3. Deploy Backend
```bash
wrangler deploy
```

Note the deployment URL (e.g., `https://interview-prep-simulator.YOUR_SUBDOMAIN.workers.dev`)

### 4. Configure Frontend
Update `src/frontend/src/App.tsx` with your Worker URL:
```typescript
const API_URL = 'https://interview-prep-simulator.YOUR_SUBDOMAIN.workers.dev';
```

### 5. Run Frontend Locally
```bash
cd src/frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### 6. Deploy Frontend to Cloudflare Pages (Optional)
```bash
cd src/frontend
npm run build
npx wrangler pages deploy dist
```

---

## Usage Guide

### Starting an Interview
1. Select **Interview Type** (Backend, Frontend, Data Engineer, etc.)
2. Enter **Years of Experience** (0-20)
3. Choose **Interview Round** (Behavioral, Technical, Coding, System Design)
4. Click **Start Interview**

### Answering Questions
**Text Input**:
- Type your answer in the text area
- Grammar errors appear as red highlights
- Click **Fix** buttons to auto-correct
- Click **Submit Answer**

**Voice Input**:
- Click **Start Recording**
- Speak your answer (browser will show microphone permission prompt first time)
- Click **⏹ Stop Recording** when done
- Review transcribed text
- Click **Submit Answer**

### Viewing Feedback
After each answer:
- **Scores** (0-10 for correctness, depth, clarity, completeness)
- **Strengths** (what you did well)
- **Weaknesses** (what to improve)
- **Feedback** (detailed explanation)
- **NLP Analysis** (word count, confidence, sentiment)

### Gap Analysis
1. Click **Gap Analysis** tab
2. Paste your resume (plain text)
3. Paste job description
4. Click **Analyze Gap**
5. Review:
   - Matching skills 
   - Missing skills
   - Match percentage
   - Recommendations
   - Suggested interview questions

### Ending Interview
1. Click **End Interview**
2. Receive **Final Evaluation**:
   - Overall performance summary
   - Top 3 strengths
   - Top 3 areas for improvement
   - Action items
   - Recommended resources
   - Hiring recommendation

---

## Project Structure

```
interview-prep-simulator/
├── src/
│   ├── index.ts                    # Main Hono app entry
│   ├── types.ts                    # TypeScript interfaces
│   ├── workers/
│   │   └── api.ts                  # API router & session orchestration
│   ├── services/
│   │   ├── llm.ts                  # LLM service (question gen, eval)
│   │   └── nlp.ts                  # NLP analysis service
│   ├── utils/
│   │   └── prompts.ts              # AI prompts (interviewer, evaluator)
│   ├── durable-objects/
│   │   └── user-memory.ts          # User memory Durable Object
│   └── frontend/
│       ├── src/
│       │   ├── App.tsx             # Main React component
│       │   └── hooks/
│       │       └── useBrowserVoice.ts  # Voice input hook
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── wrangler.toml                   # Cloudflare Worker config
├── schema.sql                      # D1 database schema
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables
None required! All configuration in `wrangler.toml`.

### Bindings (`wrangler.toml`)
```toml
[ai]
binding = "AI"

[[d1_databases]]
binding = "DB"
database_name = "interview-prep-db"
database_id = "YOUR_DATABASE_ID"

[[kv_namespaces]]
binding = "SESSION_CACHE"
id = "YOUR_KV_ID"

[[durable_objects.bindings]]
name = "USER_MEMORY"
class_name = "UserMemoryDO"
script_name = "interview-prep-simulator"

# Optional:
[[r2_buckets]]
binding = "AUDIO_BUCKET"
bucket_name = "interview-audio"
```

### Customizing AI Behavior
Edit [src/utils/prompts.ts](src/utils/prompts.ts):
- `INTERVIEWER_PROMPT`: Question generation style
- `EVALUATOR_PROMPT`: Scoring strictness and criteria
- Adjust temperature/max_tokens in [src/services/llm.ts](src/services/llm.ts)

---

## 🧪 Testing

### Local Development
```bash
# Backend (with remote Cloudflare bindings)
wrangler dev

# Frontend
cd src/frontend && npm run dev
```

### Testing API Endpoints
```bash
# Start a session
curl -X POST 'http://localhost:8787/api/session/start' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "test-user-1",
    "interviewType": "backend",
    "experienceLevel": 3
  }'

# Submit an answer
curl -X POST 'http://localhost:8787/api/session/{SESSION_ID}/message' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "I would use Redis for caching because it provides fast in-memory access with TTL support and persistence options."
  }'

# Gap analysis
curl -X POST 'http://localhost:8787/api/gap-analysis' \
  -H 'Content-Type: application/json' \
  -d '{
    "resume": "Full stack developer with 3 years experience in React, Node.js, MongoDB...",
    "jobDescription": "Looking for backend engineer with 5+ years Python, Django, PostgreSQL..."
  }'
```

---

## 🐛 Known Issues & Limitations

1. **Voice Recognition**:
   - Requires Chrome/Edge/Safari (Firefox not supported)
   - Microphone permission must be granted
   - May auto-stop after 60 seconds (auto-restarts)

2. **AI Responses**:
   - Occasional JSON parsing errors (handled with fallbacks)
   - Response time ~2-5 seconds per question/evaluation

3. **Resume Parsing**:
   - Plain text only (PDF upload removed due to complexity)
   - Users must manually format resume as text

4. **Session Persistence**:
   - KV cache expires after 1 hour of inactivity
   - D1 stores permanent history

---

## 🚧 Future Enhancements

- [ ] **Code execution** for coding round (Judge0 API integration)
- [ ] **System design whiteboarding** (Excalidraw embed)
- [ ] **Video recording** for behavioral interviews
- [ ] **Mock interview scheduling** with calendar integration
- [ ] **Peer review** feature (share sessions with mentors)
- [ ] **Analytics dashboard** (progress tracking, weak area trends)
- [ ] **Multi-language support** (Spanish, Hindi, etc.)
- [ ] **Resume upload** with proper PDF parsing (pdf.js)
- [ ] **Job scraping** (auto-fetch JDs from LinkedIn/Indeed)

---

## 🤝 Contributing

This is a Cloudflare internship submission project. Not accepting external contributions at this time.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**Akanksha Garg**

Built for Cloudflare Workers AI Internship (Winter/Summer 2026)

---

## Acknowledgments

- **Cloudflare** for Workers AI platform and internship opportunity
- **Meta** for Llama 3.3 70B model
- **Hono** for elegant Workers framework
- **React + Vite** for frontend tooling
- **Web Speech API** for browser-native voice capabilities

---

## Technical Deep Dive

### Why Llama 3.3 70B Instruct FP8 Fast?
- **70B parameters**: Best balance of quality vs. speed for interview questions
- **FP8 quantization**: Faster inference without significant quality loss
- **Instruct-tuned**: Follows JSON format instructions reliably
- **Fast variant**: ~2-3 second response time vs. 5-10s for full precision

### Why Durable Objects for User Memory?
- **Per-user isolation**: Each user gets dedicated DO instance
- **Strong consistency**: No stale reads when fetching weak areas
- **Automatic persistence**: State survives Worker restarts
- **Location hints**: Co-locate DO with user's region for low latency

### Why KV for Session Cache?
- **Global edge cache**: Fast reads from 300+ locations
- **Automatic TTL**: No manual cleanup of abandoned sessions
- **Eventually consistent**: Acceptable for non-critical session data

### Why D1 for Session History?
- **Relational queries**: Easy to fetch "all sessions by user" or "sessions in date range"
- **SQL familiarity**: Standard queries for analytics
- **Cost-effective**: Free tier includes 5M reads/day

---

## Performance Metrics

- **Question Generation**: ~2-3 seconds
- **Answer Evaluation**: ~2-4 seconds (includes NLP analysis)
- **Gap Analysis**: ~3-5 seconds (larger context)
- **Session Start**: ~3 seconds (includes user memory fetch + first question)
- **Frontend Load**: <500ms (Vite optimized)

---

## Security & Privacy

- **No API keys stored**: Workers AI uses binding (no exposed credentials)
- **User data isolation**: Durable Objects ensure per-user data separation
- **CORS enabled**: Frontend can run on any domain
- **No PII required**: userId can be anonymous identifier
- **Audio storage optional**: R2 bucket binding not required

---

**Built with ❤️ on Cloudflare's Edge** 

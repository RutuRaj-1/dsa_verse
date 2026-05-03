# FSDU4.md — Unit 4: Backend Development with Node.js & Express.js
### Full Stack Development | VIT | DSA Verse Project Codebase Mapping
---

## 4.1 Introduction to Node.js — Environment Setup

**File: `backend/package.json`**
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "commonjs",       // Node.js CommonJS module system (require/module.exports)
  "scripts": {
    "start": "node server.js",    // production: npm start
    "dev":   "node server.js"     // development: npm run dev
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",  // Google Gemini AI SDK
    "axios":      "^1.15.2",             // HTTP client
    "cors":       "^2.8.6",              // Cross-Origin Resource Sharing
    "dotenv":     "^17.4.2",             // environment variables
    "express":    "^5.2.1",              // web framework
    "node-fetch": "^3.3.2"              // fetch API for Node
  }
}
```

**File: `backend/server.js`, Lines 1-8 — require() imports**
```js
require("dotenv").config();                            // load .env variables first
const express = require("express");                    // web framework
const cors    = require("cors");                       // middleware
const fs      = require("fs");                         // built-in: file system
const path    = require("path");                       // built-in: path utilities
const axios   = require("axios");                      // HTTP requests
const crypto  = require("crypto");                     // built-in: cryptography
const { GoogleGenerativeAI } = require("@google/generative-ai"); // AI SDK
```

---

## 4.2 Node.js Built-in Modules

### `fs` — File System Module

**File: `backend/server.js`, Lines 49-90**
```js
// Reading a file synchronously at startup
const CONTEXT_PATH = path.join(__dirname, "context.md");
const CACHE_PATH   = path.join(__dirname, "cache.json");

let FULL_CONTEXT = "";
try {
  FULL_CONTEXT = fs.readFileSync(CONTEXT_PATH, "utf-8"); // sync read — blocks until done
  logger.success(`Loaded context.md (${Math.round(FULL_CONTEXT.length / 1024)}KB)`);
} catch (e) {
  logger.error("context.md not found", e);
}

// Reading cache.json (async-style)
function getCache(key) {
  if (!fs.existsSync(CACHE_PATH)) return null;  // check if file exists
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")); // read + parse JSON
    return cache[key] || null;
  } catch (e) { return null; }
}

// Writing to cache.json
function setCache(key, value) {
  try {
    let cache = {};
    if (fs.existsSync(CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")); // read existing cache
    }
    cache[key] = value;
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2)); // write updated cache
  } catch (e) {
    logger.error("Failed to write cache", e);
  }
}
```

### `path` — Path Module

**File: `backend/server.js`, Lines 50-51**
```js
const CONTEXT_PATH = path.join(__dirname, "context.md");
// path.join — safely combines directory path with filename
// __dirname — Node.js global: absolute path to current file's directory
// Result: "/absolute/path/to/backend/context.md"

const CACHE_PATH = path.join(__dirname, "cache.json");
```

### `crypto` — Cryptography Module

**File: `backend/server.js`, Lines 93-96**
```js
function generateKey(type, payload) {
  const str = type + JSON.stringify(payload);
  // MD5 hash — creates a unique key from the prompt content
  return crypto.createHash("md5").update(str).digest("hex");
}
// Used for: cache keys so same prompt always maps to same cached response
```

### `http` — (Used indirectly via Express)

Express.js wraps Node's built-in `http` module internally:
```js
// Under the hood, app.listen() creates:
// const server = http.createServer(app);
// server.listen(PORT);

// File: backend/server.js, Lines 501-508
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 DSA Intelligence API running on http://localhost:${PORT}`);
});
```

---

## 4.3 Node.js Events

Node.js is event-driven. Express routes respond to HTTP events:

**File: `backend/server.js`**
```js
// HTTP Event: GET /
app.get("/", (req, res) => {              // fires when GET / event received
  res.send(`<h1>DSA Intelligence API</h1>`);
});

// HTTP Event: POST /api/analyze
app.post("/api/analyze", async (req, res) => {  // fires on POST /api/analyze
  // req = request event data
  // res = response object to send back
});

// Process event — fires when environment is bad
if (!process.env.GEMINI_API_KEY) {
  process.exit(1);  // Node.js process event — terminates the process
}
```

---

## 4.4 Express.js — Introduction, Routing, Middleware

### Express App Setup

**File: `backend/server.js`, Lines 16-32**
```js
const app = express();   // create express application instance

// === MIDDLEWARE STACK ===
// 1. CORS middleware — handles cross-origin browser security
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);                          // allow
    } else {
      callback(new Error("Not allowed by CORS"));    // deny
    }
  }
}));

// 2. JSON body parser middleware — parses req.body as JSON
app.use(express.json());
```

### Express Routing — All 4 Endpoints

**File: `backend/server.js`**

```js
// === ROUTE 1: Root — GET / ===
app.get("/", (req, res) => {                        // Line 362
  res.send(`<h1 style="color:#3b82f6">DSA Intelligence API</h1>`);
});

// === ROUTE 2: Health Check — GET /api/health ===
app.get("/api/health", (req, res) => {              // Line 497
  res.json({
    status: "ok",
    model: MODEL_NAME,
    contextLoaded: FULL_CONTEXT.length > 0
  });
});

// === ROUTE 3: Main Analysis — POST /api/analyze ===
app.post("/api/analyze", async (req, res) => {      // Line 376
  const { topic, problem } = req.body;              // extract from request body

  // Input validation
  const validation = validateInput(req.body, ["topic", "problem"]);
  if (!validation.valid) {
    return res.status(400).json({                   // 400 Bad Request
      error: "Validation failed",
      details: validation.errors
    });
  }

  try {
    const context    = retrieveContext(topic, problem);
    const systemPrompt = buildSystemPrompt(context);
    const rawText    = await generateAIResponse("analyze", systemPrompt, userPrompt, MOCK_ANALYSIS);
    const parsed     = JSON.parse(extractJSON(rawText));
    res.json({ success: true, data: parsed });      // 200 OK with JSON
  } catch (err) {
    res.json({ success: true, data: MOCK_ANALYSIS }); // graceful fallback
  }
});

// === ROUTE 4: Hints — POST /api/hint ===
app.post("/api/hint", async (req, res) => {         // Line 465
  const { problem, topic, step = 1 } = req.body;   // destructure with default
  try {
    const hint = await generateAIResponse(`hint-${step}`, sys, userPrompt, mockHints[0]);
    res.json({ hint: hint.trim() });
  } catch (err) {
    res.status(500).json({ error: "Hint failed" }); // 500 Internal Server Error
  }
});

// === ROUTE 5: Similar Problems — POST /api/similar ===
app.post("/api/similar", async (req, res) => {      // Line 480
  const { problem, topic } = req.body;
  try {
    const raw  = await generateAIResponse("similar", sys, userPrompt, mockSimilar);
    const clean = extractJSON(raw);
    res.json({ problems: JSON.parse(clean) });
  } catch (err) {
    res.json({ problems: mockSimilar });            // fallback to mock data
  }
});
```

### Middleware — Validation Helper

**File: `backend/server.js`, Lines 349-359**
```js
// Custom validation middleware (called inside routes)
function validateInput(data, required = []) {
  const errors = [];
  required.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  return { valid: errors.length === 0, errors };
}
```

---

## 4.5 Creating APIs — AI Orchestration Layer

### API Design: 3-tier Fallback Chain

**File: `backend/server.js`, Lines 175-221**
```js
// Unified AI Orchestrator — the core API logic
async function generateAIResponse(type, systemPrompt, userPrompt, mockData) {
  // TIER 1: Check cache first (instant response)
  const cacheKey = generateKey(type, { systemPrompt, userPrompt });
  const cached   = getCache(cacheKey);
  if (cached) {
    logger.info(`Cache Hit [${type}]`);
    return cached;
  }

  // TIER 2: Call Gemini AI (primary API)
  try {
    const result = await callGemini(systemPrompt, userPrompt);
    setCache(cacheKey, result);   // cache for future requests
    return result;
  } catch (err) {
    logger.error(`Gemini Error [${type}]`, err);

    // TIER 3: Fallback to Ollama (local AI)
    try {
      const localResult = await callOllama(systemPrompt, userPrompt, isJsonType);
      setCache(cacheKey, localResult);
      return localResult;
    } catch (ollamaErr) {
      // TIER 4: Return mock data (graceful degradation)
      logger.warn(`Using mock fallback for [${type}]`);
      return typeof mockData === "string" ? mockData : JSON.stringify(mockData);
    }
  }
}
```

### Gemini AI API Call

**File: `backend/server.js`, Lines 99-135**
```js
async function callGemini(systemInstruction, userText, retries = 2, timeout = 30000) {
  // Get a model instance from the Gemini SDK
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,           // "gemini-1.5-flash"
    systemInstruction: systemInstruction  // sets AI behavior
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Race between API call and timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), timeout)
      );

      const result = await Promise.race([
        model.generateContent(userText),  // actual API call
        timeoutPromise                     // cancel if too slow
      ]);

      return (await result.response).text() || "";

    } catch (err) {
      const isRateLimit = err.message.includes("quota") || err.message.includes("429");
      const isTimeout   = err.message.includes("TIMEOUT");

      if ((isRateLimit || isTimeout) && attempt < retries) {
        const waitTime = isRateLimit ? 2000 : 1000;
        await new Promise(r => setTimeout(r, waitTime)); // wait then retry
        continue;
      }
      throw new Error(isRateLimit ? "QUOTA_EXCEEDED" : err.message);
    }
  }
}
```

### Ollama Local AI Fallback

**File: `backend/server.js`, Lines 138-172**
```js
async function callOllama(systemInstruction, userText, forceJson = false, timeout = 120000) {
  const OLLAMA_URL = "http://localhost:11434/api/generate"; // local Ollama server
  const prompt = `System: ${systemInstruction}\n\nUser: ${userText}`;

  try {
    const payload = {
      model: "llama3",           // local LLM model
      prompt: prompt,
      stream: false,
      options: { temperature: 0.1 }  // low temp = deterministic output
    };
    if (forceJson) payload.format = "json";  // force JSON output

    const response = await axios.post(OLLAMA_URL, payload, { timeout });

    if (!response.data?.response) throw new Error("Ollama returned empty response");
    return response.data.response;

  } catch (err) {
    if (err.code === "ECONNREFUSED") logger.warn("Ollama not available");
    throw new Error("OLLAMA_FAILED");
  }
}
```

### RAG (Retrieval Augmented Generation) — Context Retrieval

**File: `backend/server.js`, Lines 309-320**
```js
// Retrieves relevant sections from context.md based on the query topic
function retrieveContext(topic, problem) {
  // Split knowledge base into sections by ## headings
  const sections = FULL_CONTEXT.split(/^##\s+/m);

  // Extract keywords from topic + problem
  const keywords = [
    topic.toLowerCase(),
    ...problem.toLowerCase().split(/\s+/).filter(w => w.length > 4)
  ];

  // Score each section by keyword frequency
  const scored = sections.map(s => {
    let score = 0;
    keywords.forEach(kw => { if (s.toLowerCase().includes(kw)) score++; });
    return { text: s, score };
  });

  // Sort by score descending, take top 3 sections
  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.slice(0, 3).map(s => s.text).join("\n\n---\n\n");

  return relevant.slice(0, 8000); // limit to 8KB for token budget
}
```

### System Prompt Builder

**File: `backend/server.js`, Lines 323-346**
```js
function buildSystemPrompt(context) {
  return `You are an expert DSA teaching assistant for university-level CS students.

KNOWLEDGE CONTEXT (use this as your primary reference):
${context}

CRITICAL INSTRUCTIONS:
1. Always respond with ONLY valid JSON — no markdown, no explanation outside JSON
2. Generate code that is syntactically correct and functional
3. A "complexity" field must be EXACTLY one of: brute, optimized, optimal
4. The recommended approach must have "recommended": true
5. Ensure all JSON keys and string values are in double quotes.
6. Ensure there are no trailing commas.`;
}
```

---

## 4.6 Database Integration — Firebase (NoSQL)

**File: `src/firebase.js`, Lines 1-20**
```js
import { initializeApp }             from "firebase/app";      // Firebase core
import { getAuth, GoogleAuthProvider } from "firebase/auth";   // Authentication
import { getFirestore }              from "firebase/firestore"; // NoSQL Database

// Firebase config from environment variables
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);    // initialize Firebase app

export const auth           = getAuth(app);   // Auth service instance
export const db             = getFirestore(app);  // Firestore DB instance
export const googleProvider = new GoogleAuthProvider(); // OAuth provider
export default app;
```

### Firestore CRUD Operations

**File: `src/contexts/AuthContext.jsx`, Lines 23-53**
```js
// CREATE — Write user document to Firestore on signup
async function signup(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });

  // setDoc — CREATE or REPLACE document (like SQL INSERT)
  await setDoc(doc(db, "users", result.user.uid), {
    uid:         result.user.uid,
    displayName,
    email,
    createdAt:   serverTimestamp(),  // Firebase server-generated timestamp
    progress:    {},                 // empty object for future tracking
  });
  return result;
}

// READ + CONDITIONAL CREATE — Google Sign-In
async function loginWithGoogle() {
  const result  = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, "users", result.user.uid);
  const snap    = await getDoc(userRef);       // READ: check if user exists

  if (!snap.exists()) {                         // if new user
    await setDoc(userRef, {                     // CREATE document
      uid:         result.user.uid,
      displayName: result.user.displayName,
      email:       result.user.email,
      createdAt:   serverTimestamp(),
      progress:    {},
    });
  }
  return result;
}
```

---

## 4.7 Frontend + Backend Integration

### Complete Data Flow

```
User types problem → React state updates → fetch() POST to /api/analyze
  → Express receives JSON body → validates input → retrieves RAG context
  → calls Gemini AI → receives JSON response → sends to React
  → React renders analysis UI
```

**File: `src/pages/PracticePage.jsx`, Lines 352-370**
```js
// FRONTEND: Sends HTTP POST to backend
const analyze = async () => {
  setLoading(true);
  try {
    const r = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, problem })        // → backend receives this
    });
    const d = await r.json();                         // parse JSON response
    if (!d.success) throw new Error(d.error);
    setAnalysis(d.data);                              // update React state with AI result
  } catch (e) {
    setError(e.message);
  }
  setLoading(false);
};
```

### Health Check — Backend Status Monitoring

**File: `src/pages/PracticePage.jsx`, Lines 341-346**
```js
// On component mount — checks if backend is online
useEffect(() => {
  fetch(`${API_BASE}/health`)              // GET /api/health
    .then(r  => r.json())
    .then(d  => setBackendOk(d.status === "ok"))  // true if online
    .catch(() => setBackendOk(false));             // false if offline
}, []);
```

**File: `backend/server.js`, Lines 497-499**
```js
// Backend responds
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: MODEL_NAME, contextLoaded: FULL_CONTEXT.length > 0 });
});
```

---

## 4.8 npm Scripts & Task Managers

**File: `package.json` (frontend), Lines 6-12**
```json
"scripts": {
  "dev":      "vite",              // start Vite dev server (hot reload)
  "build":    "vite build",        // production build
  "build:dev":"vite build --mode development",
  "lint":     "eslint .",          // run ESLint for code quality
  "preview":  "vite preview"       // preview production build locally
}
```

**File: `backend/package.json`, Lines 6-9**
```json
"scripts": {
  "start": "node server.js",   // npm start — production
  "dev":   "node server.js"    // npm run dev — development
}
```

> The syllabus also mentions **nodemon** and **PM2**. These can be added easily:
> - `nodemon server.js` — auto-restarts server on file save
> - `pm2 start server.js` — production process manager

---

## Summary Table — Unit 4 Concepts vs Files

| Concept | File | Lines |
|---------|------|-------|
| Node.js environment setup | `backend/package.json` | All |
| `require()` / CommonJS | `backend/server.js` | 1–8 |
| `fs` module (readFileSync, writeFileSync, existsSync) | `backend/server.js` | 49–90 |
| `path` module (join, __dirname) | `backend/server.js` | 50–51 |
| `crypto` module (createHash, MD5) | `backend/server.js` | 93–96 |
| Node.js events (HTTP events, process.exit) | `backend/server.js` | 362, 10–13 |
| Express setup | `backend/server.js` | 16 |
| CORS middleware | `backend/server.js` | 17–30 |
| JSON body parser middleware | `backend/server.js` | 32 |
| GET routes | `backend/server.js` | 362, 497 |
| POST routes | `backend/server.js` | 376, 465, 480 |
| HTTP status codes (400, 500) | `backend/server.js` | 381, 475 |
| Input validation | `backend/server.js` | 349–359 |
| Gemini AI API integration | `backend/server.js` | 99–135 |
| Ollama local fallback | `backend/server.js` | 138–172 |
| RAG context retrieval | `backend/server.js` | 309–320 |
| File-based caching | `backend/server.js` | 63–91 |
| Firebase NoSQL DB | `src/firebase.js` | All |
| Firestore setDoc (CREATE) | `src/contexts/AuthContext.jsx` | 26–32 |
| Firestore getDoc (READ) | `src/contexts/AuthContext.jsx` | 43–44 |
| Frontend fetch() API calls | `src/pages/PracticePage.jsx` | 356, 224, 267 |
| Health check endpoint | `backend/server.js` | 497 |
| npm scripts | `package.json` | 6–12 |

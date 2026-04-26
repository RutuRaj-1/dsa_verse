require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Validate Environment ──────────────────────────────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL: GEMINI_API_KEY not set in .env");
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-1.5-flash";

// ── Logger Helper ─────────────────────────────────────────────────
const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️ ${msg}`),
  error: (msg, err = null) => {
    console.error(`❌ ${msg}`);
    if (err) console.error(`   Details: ${err.message || err}`);
  }
}; 

// ── Load context.md once at startup ──────────────────────────────
const CONTEXT_PATH = path.join(__dirname, "context.md");
const CACHE_PATH = path.join(__dirname, "cache.json");

let FULL_CONTEXT = "";
try {
  FULL_CONTEXT = fs.readFileSync(CONTEXT_PATH, "utf-8");
  logger.success(`Loaded context.md (${Math.round(FULL_CONTEXT.length / 1024)}KB)`);
} catch (e) {
  logger.error("context.md not found", e);
  logger.warn("System will operate without DSA context");
}

// ── Cache Helper ──────────────────────────────────────────────────
function getCache(key) {
  if (!fs.existsSync(CACHE_PATH)) return null;
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    return cache[key] || null;
  } catch (e) {
    logger.warn(`Cache read error: ${e.message}`);
    return null;
  }
}

function setCache(key, value) {
  try {
    let cache = {};
    if (fs.existsSync(CACHE_PATH)) {
      try {
        cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
      } catch (e) {
        logger.warn(`Corrupted cache file, resetting: ${e.message}`);
        cache = {};
      }
    }
    cache[key] = value;
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    logger.info(`Cached result for key: ${key.slice(0, 8)}...`);
  } catch (e) {
    logger.error("Failed to write cache", e);
  }
}

function generateKey(type, payload) {
  const str = type + JSON.stringify(payload);
  return crypto.createHash("md5").update(str).digest("hex");
}

// ── Gemini API call ──────────────────────────────────────────────
async function callGemini(systemInstruction, userText, retries = 2, timeout = 30000) {
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: systemInstruction 
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("TIMEOUT: Gemini request exceeded " + timeout + "ms")), timeout)
      );
      
      const result = await Promise.race([
        model.generateContent(userText),
        timeoutPromise
      ]);
      
      const response = await result.response;
      return response.text() || "";
    } catch (err) {
      const errorMsg = err.message || "";
      const isRateLimit = errorMsg.toLowerCase().includes("quota") || errorMsg.includes("429");
      const isTimeout = errorMsg.includes("TIMEOUT");

      if ((isRateLimit || isTimeout) && attempt < retries) {
        const waitTime = isRateLimit ? 2000 : 1000;
        logger.warn(`${isRateLimit ? "Rate Limit" : "Timeout"} on attempt ${attempt}. Retrying in ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      
      const finalError = isRateLimit ? "QUOTA_EXCEEDED" : isTimeout ? "TIMEOUT" : errorMsg;
      throw new Error(finalError);
    }
  }
}

// ── Ollama Local Fallback ─────────────────────────────────────────
async function callOllama(systemInstruction, userText, forceJson = false, timeout = 120000) {
  const OLLAMA_URL = "http://localhost:11434/api/generate";
  // Prepend a strict JSON reminder to help Ollama respond correctly
  const jsonReminder = forceJson
    ? "\n\nIMPORTANT: Respond with ONLY raw valid JSON. No markdown, no code fences, no explanation."
    : "";
  const prompt = `System: ${systemInstruction}${jsonReminder}\n\nUser: ${userText}`;
  
  try {
    logger.info("Attempting Local Ollama fallback...");
    const payload = {
      model: "llama3",
      prompt: prompt,
      stream: false,
      options: { temperature: 0.1 } // Lower temp for more deterministic JSON
    };
    // Use Ollama's native JSON format enforcement when requested
    if (forceJson) payload.format = "json";
    
    const response = await axios.post(OLLAMA_URL, payload, { timeout });
    if (!response.data || !response.data.response) {
      throw new Error("Ollama returned empty response");
    }
    return response.data.response;
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      logger.warn("Ollama not available (connection refused)");
    } else if (err.code === "ENOTFOUND") {
      logger.warn("Ollama host not found");
    } else {
      logger.error("Ollama request failed", err);
    }
    throw new Error("OLLAMA_FAILED");
  }
}

// ── Unified AI Orchestrator ───────────────────────────────────────
async function generateAIResponse(type, systemPrompt, userPrompt, mockData) {
  const cacheKey = generateKey(type, { systemPrompt, userPrompt });
  const cached = getCache(cacheKey);
  
  if (cached) {
    logger.info(`Cache Hit [${type}]`);
    // Basic check: if it looks like JSON, try to parse it. If it fails, ignore cache.
    if (type === "analyze" || type === "similar") {
      try {
        JSON.parse(extractJSON(cached));
        return cached;
      } catch (e) {
        logger.warn(`Invalid JSON in cache [${type}]. Regenerating...`);
      }
    } else {
      return cached;
    }
  }

  const isJsonType = (type === "analyze" || type === "similar");

  try {
    const result = await callGemini(systemPrompt, userPrompt);
    setCache(cacheKey, result);
    return result;
  } catch (err) {
    logger.error(`Gemini Error [${type}]`, err);
    
    // For ANY Gemini failure (quota, model not found, network), try Ollama
    try {
      const localResult = await callOllama(systemPrompt, userPrompt, isJsonType);
      
      // Validate before caching if it's a JSON type
      if (isJsonType) {
        JSON.parse(extractJSON(localResult)); // Will throw if bad
      }
      
      logger.success(`Ollama fallback succeeded for [${type}]`);
      setCache(cacheKey, localResult);
      return localResult;
    } catch (ollamaErr) {
      logger.error(`Ollama fallback failed [${type}]`, ollamaErr);
      logger.warn(`Using mock fallback for [${type}]`);
      return typeof mockData === "string" ? mockData : JSON.stringify(mockData);
    }
  }
}

function extractJSON(text) {
  // 1. Remove Markdown code blocks if they exist
  let cleanText = text.replace(/```json\s?([\s\S]*?)```/g, '$1');
  cleanText = cleanText.replace(/```\s?([\s\S]*?)```/g, '$1');
  
  // 2. Find the first occurrence of '{' or '[' and the last occurrence of '}' or ']'
  const firstBrace = cleanText.indexOf('{');
  const firstBracket = cleanText.indexOf('[');
  
  let start = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    start = Math.min(firstBrace, firstBracket);
  } else {
    start = firstBrace !== -1 ? firstBrace : firstBracket;
  }
  
  const lastBrace = cleanText.lastIndexOf('}');
  const lastBracket = cleanText.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);

  if (start === -1 || end === -1) return cleanText.trim();
  
  let json = cleanText.substring(start, end + 1).trim();
  
  // 3. Simple fixes for common LLM JSON mistakes
  json = json.replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas
  
  // 4. Try to fix missing quotes around keys (very common with some models)
  // This is a risky regex but can help with simple cases
  // json = json.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

  return json;
}

// ── Mock Fallback for Demo Purposes ───────────────────────────────
const MOCK_ANALYSIS = {
  "understanding": {
    "pattern": "Stack / LIFO Pattern",
    "keyInsight": "Every closing bracket must match the most recently seen unmatched opening bracket.",
    "constraints": ["String consists only of brackets", "Input length can be up to 10^4"],
    "edgeCases": ["Empty string", "Odd length string", "String starting with closing bracket"],
    "realWorldAnalogy": "Like verifying that every open tag like <div> in HTML is properly closed with a </div> in the correct nested order."
  },
  "approaches": [
    {
      "name": "String Replacement (Brute Force)",
      "complexity": "brute",
      "timeComplexity": "O(n^2)",
      "spaceComplexity": "O(n)",
      "description": "Repeatedly find and replace matched pairs '()', '{}', '[]' inside the string until no more replacements can be made. If the string becomes empty, it is balanced.",
      "whenToUse": "Never recommended for production. Only for understanding the problem mechanics.",
      "tradeoff": "Extremely slow for deep nesting due to repeated string modification.",
      "recommended": false
    },
    {
      "name": "Stack-Based Verification",
      "complexity": "optimal",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "description": "Iterate through the string. Push opening brackets to a Stack. For closing brackets, pop the stack and check if it matches the corresponding opening bracket type.",
      "whenToUse": "Standard optimal solution for bracket verification problems.",
      "tradeoff": "Requires O(n) additional memory for the stack in the worst-case scenario (all open brackets).",
      "recommended": true
    }
  ],
  "code": {
    "pseudocode": "function isValid(s):\n  stack = []\n  map = {')': '(', '}': '{', ']': '['}\n  \n  for char in s:\n    if char in map:\n      topElement = stack.pop() if stack is not empty else '#'\n      if map[char] != topElement:\n        return false\n    else:\n      stack.push(char)\n      \n  return stack is empty",
    "cpp": "bool isValid(string s) {\n    stack<char> st;\n    for(char c : s) {\n        if(c == '(' || c == '{' || c == '[') {\n            st.push(c);\n        } else {\n            if(st.empty()) return false;\n            if(c == ')' && st.top() != '(') return false;\n            if(c == '}' && st.top() != '{') return false;\n            if(c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}",
    "java": "public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(') stack.push(')');\n        else if (c == '{') stack.push('}');\n        else if (c == '[') stack.push(']');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}",
    "python": "def isValid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    \n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else '#'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n            \n    return not stack"
  },
  "flowSteps": [
    { "step": "START — Check Valid Parentheses", "type": "start" },
    { "step": "Initialize empty Stack", "type": "process" },
    { "step": "Read next character from string", "type": "process" },
    { "step": "Is it an opening bracket?", "type": "decision" },
    { "step": "Push to Stack", "type": "process" },
    { "step": "Matches top of Stack?", "type": "decision" },
    { "step": "Pop from Stack", "type": "process" },
    { "step": "END — Return True if Stack is empty", "type": "end" }
  ],
  "complexity": {
    "time": "O(n)",
    "space": "O(n)",
    "explanation": "We iterate through the string of length n exactly once. In the worst case (all opening brackets), the stack will push n characters."
  },
  "vizType": "generic",
  "sampleInput": "s = \"{[]}\"",
  "sampleOutput": "true"
};

// ── Context Retriever ─────────────────────────────────────────────
function retrieveContext(topic, problem) {
  const sections = FULL_CONTEXT.split(/^##\s+/m);
  const keywords = [topic.toLowerCase(), ...problem.toLowerCase().split(/\s+/).filter(w => w.length > 4)];
  const scored = sections.map(s => {
    let score = 0;
    keywords.forEach(kw => { if (s.toLowerCase().includes(kw)) score++; });
    return { text: s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.slice(0, 3).map(s => s.text).join("\n\n---\n\n");
  return relevant.slice(0, 8000);
}

// ── System Prompt Builder ─────────────────────────────────────────
function buildSystemPrompt(context) {
  return `You are an expert DSA (Data Structures & Algorithms) teaching assistant for university-level computer science students.

You specialize in:
- Explaining complex algorithmic problems clearly
- Providing multiple solution approaches from brute force to optimal
- Writing clean, correct code in multiple languages  
- Breaking down solutions into understandable steps

KNOWLEDGE CONTEXT (use this as your primary reference):
${context}

CRITICAL INSTRUCTIONS:
1. Always respond with ONLY valid JSON — no markdown code fences, no explanation outside JSON
2. Generate code that is syntactically correct and functional
3. Generate pseudocode in clear, language-independent notation using indentation
4. For flowSteps, use clear action verbs: START, SET, CHECK, RETURN, REPEAT, etc.
5. Decision steps must end with "?" 
6. vizType must be EXACTLY one of: sorting, searching, graph, tree, dp, backtracking, array, linked_list, heap, string, generic
7. A "complexity" field in each approach must be EXACTLY one of: brute, optimized, optimal
8. The recommended approach must have "recommended": true
9. DO NOT include any text before or after the JSON. DO NOT include markdown code blocks.
10. Ensure all JSON keys and string values are enclosed in double quotes.
11. Ensure there are no trailing commas.`;
}

// ── Validation Helper ────────────────────────────────────────────────
function validateInput(data, required = []) {
  const errors = [];
  
  required.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// ── Root Endpoint ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 100px; background: #0f172a; color: white; height: 100vh;">
      <h1 style="color: #3b82f6;">🚀 DSA Intelligence API</h1>
      <p>The backend is running successfully.</p>
      <p style="color: #94a3b8;">Frontend URL: ${process.env.FRONTEND_URL || 'Not Set'}</p>
      <div style="margin-top: 20px; padding: 20px; background: #1e293b; display: inline-block; border-radius: 8px;">
        <code>GET /api/health</code> - Check status
      </div>
    </div>
  `);
});

// ── Main Analysis Endpoint ────────────────────────────────────────
app.post("/api/analyze", async (req, res) => {
  const { topic, problem } = req.body;
  
  const validation = validateInput(req.body, ["topic", "problem"]);
  if (!validation.valid) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: validation.errors 
    });
  }

  try {
    const context = retrieveContext(topic, problem);
    const systemPrompt = buildSystemPrompt(context);
    const userPrompt = `Topic: ${topic}
Problem Statement: "${problem}"

Analyze this DSA problem and respond with ONLY valid JSON (no markdown, no backticks). The JSON MUST follow this exact flat structure:

{
  "understanding": {
    "pattern": "Identify the algorithmic pattern",
    "keyInsight": "The single most important realization",
    "constraints": ["Constraint 1", "Constraint 2"],
    "edgeCases": ["Edge case 1", "Edge case 2"],
    "realWorldAnalogy": "A simple analogy"
  },
  "approaches": [
    {
      "name": "Brute Force",
      "complexity": "brute",
      "timeComplexity": "O(?)",
      "spaceComplexity": "O(?)",
      "description": "Step-by-step logic",
      "whenToUse": "Scenario",
      "tradeoff": "Why it's bad",
      "recommended": false
    },
    {
      "name": "Optimal Solution",
      "complexity": "optimal",
      "timeComplexity": "O(?)",
      "spaceComplexity": "O(?)",
      "description": "Step-by-step logic",
      "whenToUse": "Production scenario",
      "tradeoff": "Why it's good",
      "recommended": true
    }
  ],
  "code": {
    "pseudocode": "GENERATE ACTUAL PSEUDOCODE HERE",
    "cpp": "GENERATE ACTUAL C++ CODE HERE",
    "java": "GENERATE ACTUAL JAVA CODE HERE",
    "python": "GENERATE ACTUAL PYTHON CODE HERE"
  },
  "flowSteps": [
    { "step": "START — description", "type": "start" },
    { "step": "Action step", "type": "process" },
    { "step": "Condition check?", "type": "decision" },
    { "step": "END — result", "type": "end" }
  ],
  "complexity": {
    "time": "Final optimal time",
    "space": "Final optimal space",
    "explanation": "Brief explanation"
  },
  "vizType": "sorting",
  "sampleInput": "example input",
  "sampleOutput": "expected output"
}

IMPORTANT:
1. Replace "GENERATE ACTUAL ..." with real, working code.
2. Ensure flowSteps is an array at the TOP level.
3. Ensure complexity is an object at the TOP level.
4. vizType MUST be one of: sorting, searching, graph, tree, dp, backtracking, array, linked_list, heap, string, generic.`;

    const rawText = await generateAIResponse("analyze", systemPrompt, userPrompt, MOCK_ANALYSIS);
    const jsonText = extractJSON(rawText);
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("❌ JSON Parse Error. Snippet:", jsonText.slice(0, 200) + "...");
      console.error("Error Detail:", parseErr.message);
      throw parseErr; // Let the catch block handle it
    }
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("Endpoint error:", err.message);
    // If parsing failed even after extraction, return mock but don't crash
    res.json({ success: true, data: MOCK_ANALYSIS, note: "Fallback due to response format error" });
  }
});

// ── Hint Endpoint ─────────────────────────────────────────────────
app.post("/api/hint", async (req, res) => {
  const { problem, topic, step = 1 } = req.body;
  try {
    const sys = "You are a DSA tutor. Give progressive, Socratic hints — guide thinking without revealing the full solution.";
    const userPrompt = `Give hint ${step} of 3 for this DSA problem. Topic: ${topic}, Problem: "${problem}". Write a concise paragraph.`;
    
    const mockHints = ["Hint 1 fallback", "Hint 2 fallback", "Hint 3 fallback"];
    const hint = await generateAIResponse(`hint-${step}`, sys, userPrompt, mockHints[step-1] || mockHints[0]);
    res.json({ hint: hint.trim() });
  } catch (err) {
    res.status(500).json({ error: "Hint failed", detail: err.message });
  }
});

// ── Similar Problems Endpoint ─────────────────────────────────────
app.post("/api/similar", async (req, res) => {
  const { problem, topic } = req.body;
  try {
    const sys = "You are a DSA problem recommender. Return exactly 4 similar problems as a JSON array.";
    const userPrompt = `List 4 LeetCode/GFG problems similar to: ${topic}, ${problem}.`;
    
    const mockSimilar = [{"title": "Mock Problem", "difficulty": "Medium", "platform": "LeetCode", "pattern": "Mock"}];
    const raw = await generateAIResponse("similar", sys, userPrompt, mockSimilar);
    const clean = extractJSON(raw);
    res.json({ problems: JSON.parse(clean) });
  } catch (err) {
    const mockSimilar = [{"title": "Valid Parentheses", "difficulty": "Easy", "platform": "LeetCode", "pattern": "Stack"}];
    res.json({ problems: mockSimilar });
  }
});

// ── Health Check ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: MODEL_NAME, contextLoaded: FULL_CONTEXT.length > 0 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 DSA Intelligence API running on http://localhost:${PORT}`);
  console.log(`   Model: ${MODEL_NAME}`);
  console.log(`   POST /api/analyze — Full PS Analysis`);
  console.log(`   POST /api/hint    — Progressive Hints`);
  console.log(`   POST /api/similar — Similar Problems`);
});

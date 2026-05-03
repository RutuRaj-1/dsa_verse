# FSDU2.md — Unit 2: JavaScript Development
### Full Stack Development | VIT | DSA Verse Project Codebase Mapping
---

## 2.1 JavaScript Fundamentals — Syntax, Variables, Datatypes

### Variables: let, const, var

**File: `backend/server.js`, Lines 34-36**
```js
const API_KEY = process.env.GEMINI_API_KEY; // const — never reassigned
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-1.5-flash";       // const string

let FULL_CONTEXT = "";  // let — reassigned after file read (Line 53)
```

**File: `src/pages/ArrayVisualization.jsx`, Lines 213-215**
```js
let left = 0;           // let — changes during binary search
let right = array.length - 1;
let step = 1;
```

### Datatypes

| Type | Example in Code | File |
|------|----------------|------|
| `string` | `"gemini-1.5-flash"` | `server.js` L36 |
| `number` | `port: 3001`, `width: 64` | `server.js`, JSX files |
| `boolean` | `isRunning`, `loading`, `backendOk` | All pages |
| `null` | `useState(null)` | `PracticePage.jsx` L331 |
| `undefined` | Default param `step = 1` | `server.js` L466 |
| `object` | `{ topic, problem }` | `server.js` L377 |
| `array` | `[64, 34, 25, 12, 22, 11, 90]` | `ArrayVisualization.jsx` L136 |

**File: `src/pages/PracticePage.jsx`, Lines 329-337**
```js
const [topic, setTopic]             = useState("");      // string
const [analysis, setAnalysis]       = useState(null);    // null → object
const [loading, setLoading]         = useState(false);   // boolean
const [selectedApproach, set...]    = useState(0);       // number
const [charCount, setCharCount]     = useState(0);       // number
const textareaRef                   = useRef(null);      // null → DOM ref
```

### Operators

**File: `src/pages/ArrayVisualization.jsx`**
```js
// Arithmetic
let mid = Math.floor((left + right) / 2);   // +, /, Math.floor

// Comparison
if (array[mid] === target) { ... }           // strict equality
if (array[mid] < target)  { ... }           // less-than
if (arr[j] > arr[j + 1])  { ... }           // greater-than

// Logical
if (!isNaN(v)) { ... }                      // logical NOT
if (!searchVal || isRunning) { ... }        // OR

// Ternary
let bg = state === "current"
  ? "rgba(99,102,241,0.4)"                 // ternary operator
  : "rgba(59,130,246,0.15)";

// Spread
const arr = [...array];                     // spread operator
setSearchLog(prev => [...prev, msg]);       // append via spread
```

### Conditionals

**File: `src/pages/Login.jsx`, Lines 30-32**
```js
setError(
  err.message.includes("invalid-credential") ||
  err.message.includes("wrong-password")
    ? "Invalid email or password."         // if-else via ternary
    : "Failed to sign in. Please try again."
);
```

**File: `src/pages/Signup.jsx`, Lines 26-27**
```js
if (password !== confirm) return setError("Passwords do not match.");
if (password.length < 6)  return setError("Password must be at least 6 characters.");
```

### Loops — for, while, for...of

**File: `src/pages/ArrayVisualization.jsx`**
```js
// Standard for loop — Bubble Sort (Lines 255-268)
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // destructuring swap
    }
  }
}

// while loop — Binary Search (Lines 217-237)
while (left <= right) {
  let mid = Math.floor((left + right) / 2);
  if (array[mid] === target) { break; }
  else if (array[mid] < target) left = mid + 1;
  else right = mid - 1;
}

// while loop — Insertion Sort (Lines 314-321)
while (j >= 0 && arr[j] > key) {
  arr[j + 1] = arr[j];
  j = j - 1;
}
```

### Functions — Declaration, Expression, Arrow

**File: `backend/server.js`**
```js
// Function Declaration
function getCache(key) { ... }         // Line 63
function setCache(key, value) { ... }  // Line 74
function generateKey(type, payload) {  // Line 93
  return crypto.createHash("md5").update(JSON.stringify(payload)).digest("hex");
}

// Async Function Declaration
async function callGemini(systemInstruction, userText, retries = 2) { // Line 99
  // ...
}

// Arrow Function Expression
const sleep = ms => new Promise(r => setTimeout(r, ms)); // Line 167
const addToLog = (msg) => {
  setSearchLog(prev => [...prev, msg]);
};
```

---

## 2.2 Objects and Arrays

### Objects — Literal Creation, Access, Shorthand

**File: `backend/server.js`, Lines 258-306**
```js
// Object literal — Mock analysis data
const MOCK_ANALYSIS = {
  "understanding": {
    "pattern": "Stack / LIFO Pattern",
    "keyInsight": "Every closing bracket must match...",
    "constraints": ["String consists only of brackets"],
    "edgeCases": ["Empty string", "Odd length string"],
  },
  "approaches": [
    {
      "name": "Stack-Based Verification",
      "complexity": "optimal",
      "timeComplexity": "O(n)",
      "recommended": true
    }
  ],
  "complexity": { "time": "O(n)", "space": "O(n)" }
};
```

**File: `src/pages/Dashboard.jsx`, Lines 4-11**
```js
// Array of Objects
const DS_TOPICS = [
  { route: "/array",       title: "Arrays",        icon: "🗃️", diff: "Beginner", color: "#3b82f6" },
  { route: "/linked-list", title: "Linked Lists",  icon: "🔗", diff: "Beginner", color: "#06b6d4" },
  { route: "/tree",        title: "Trees / BST",   icon: "🌳", diff: "Advanced", color: "#f59e0b" },
];
```

### Arrays — Methods: map, filter, find, every, join, indexOf

**File: `src/pages/ArrayVisualization.jsx`**
```js
// .map() — render each element as JSX component
array.map((v, i) => <ArrayBox value={v} index={i} state={getState(i)} />)

// .filter() — remove element at index
setArray(prev => prev.filter((_, idx) => idx !== i));  // Line 343

// .every() — check if array is sorted
const isSorted = array.every((val, i, arr) => !i || (val >= arr[i-1])); // Line 206

// .join() — convert array to string for log
addToLog(`Starting Bubble Sort on [${array.join(", ")}]`); // Line 245

// Math.max / Math.min with spread
Math.max(...nums)  // Line 365
Math.min(...nums)  // Line 366
nums.indexOf(Math.max(...nums))  // Line 365
```

**File: `backend/server.js`, Lines 309-318**
```js
// .split() — split context into sections
const sections = FULL_CONTEXT.split(/^##\s+/m);

// .filter() — remove short words
const keywords = problem.toLowerCase().split(/\s+/).filter(w => w.length > 4);

// .map() + .sort() — score and rank sections
const scored = sections.map(s => ({ text: s, score: 0 }));
scored.sort((a, b) => b.score - a.score);

// .slice() — take top 3
const relevant = scored.slice(0, 3).map(s => s.text).join("\n\n---\n\n");
```

---

## 2.3 Built-in Objects — Math, String, Date

### Math Object

**File: `src/pages/ArrayVisualization.jsx`**
```js
Math.floor((left + right) / 2)   // Math.floor — Binary Search mid (L218)
Math.max(...nums)                 // Math.max — largest element (L365)
Math.min(...nums)                 // Math.min — smallest element (L366)
```

**File: `src/pages/PracticePage.jsx`, Line 231**
```js
setStep(s => Math.min(s + 1, 3));  // Math.min — cap hints at 3
```

### String Methods — includes(), split(), toLowerCase(), slice(), trim()

**File: `backend/server.js`**
```js
// .includes() — check error type (Line 121)
const isRateLimit = errorMsg.toLowerCase().includes("quota") ||
                    errorMsg.includes("429");

// .toLowerCase() — case-insensitive keyword matching (Line 311)
topic.toLowerCase()

// .slice() — truncate long text (Line 318)
return relevant.slice(0, 8000);

// .trim() — remove whitespace (Line 473)
res.json({ hint: hint.trim() });

// Template literals (String interpolation)
logger.info(`Cached result for key: ${key.slice(0, 8)}...`); // Line 87
```

**File: `src/pages/Signup.jsx`, Line 34**
```js
// String .includes() for error parsing
if (err.message.includes("email-already-in-use")) {
  setError("An account with this email already exists.");
}
```

**File: `backend/server.js`, Lines 224-254**
```js
// String regex replace — extractJSON function
let cleanText = text.replace(/```json\s?([\s\S]*?)```/g, '$1'); // remove markdown fences
cleanText = cleanText.replace(/```\s?([\s\S]*?)```/g, '$1');
// String indexOf / lastIndexOf
const firstBrace   = cleanText.indexOf('{');
const lastBrace    = cleanText.lastIndexOf('}');
// String substring
let json = cleanText.substring(start, end + 1).trim();
// Trailing comma fix via regex replace
json = json.replace(/,\s*([}\]])/g, '$1');
```

### Crypto Module (Built-in Node object)

**File: `backend/server.js`, Lines 93-96**
```js
function generateKey(type, payload) {
  const str = type + JSON.stringify(payload);
  return crypto.createHash("md5").update(str).digest("hex"); // MD5 hash
}
```

---

## 2.4 ES6 Modern JavaScript Features

### Arrow Functions

```js
// Single expression (implicit return)
const sleep = ms => new Promise(r => setTimeout(r, ms));  // ArrayVisualization.jsx L167

// With body
const addToLog = (msg) => {
  setSearchLog(prev => [...prev, msg]);
};

// As callback
array.map((v, i) => <ArrayBox value={v} index={i} />)
array.filter((_, idx) => idx !== i)
scored.sort((a, b) => b.score - a.score)
```

### Spread / Rest Operator

**File: `src/pages/ArrayVisualization.jsx`**
```js
// Spread — clone array (immutable copy)
const arr = [...array];            // Line 253

// Spread — append to array state
setSearchLog(prev => [...prev, msg]);  // Line 170

// Spread — find max/min
Math.max(...nums)  // spread array as args to Math.max
Math.min(...nums)
```

**File: `backend/server.js`, Line 466**
```js
// Rest — default parameter acts like rest
const { problem, topic, step = 1 } = req.body;  // destructuring with default
```

### Destructuring

**File: `src/pages/ArrayVisualization.jsx`, Line 262**
```js
// Array destructuring swap (ES6)
[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  // Bubble sort swap
```

**File: `backend/server.js`, Line 377**
```js
// Object destructuring from request body
const { topic, problem } = req.body;

// Destructuring with default
const { problem, topic, step = 1 } = req.body;  // Line 466
```

**File: `src/components/Navbar.jsx`, Line 16**
```js
// Destructuring from custom hook
const { currentUser, logout } = useAuth();
```

### Promises & async/await

**File: `src/pages/ArrayVisualization.jsx`**
```js
// Promise-based delay
const sleep = ms => new Promise(r => setTimeout(r, ms));

// async/await in action — Linear Search
async function linearSearch(target) {
  for (let i = 0; i < array.length; i++) {
    setCurrentIndex(i);
    await sleep(800);          // PAUSE execution, wait 800ms
    if (array[i] === target) {
      setFoundIndex(i);
      return;                  // exit async function
    }
  }
}
```

**File: `backend/server.js`, Lines 104-134**
```js
// Promise.race — timeout vs API call
const result = await Promise.race([
  model.generateContent(userText),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), timeout)
  )
]);

// try/catch with async/await
try {
  const result = await callGemini(systemPrompt, userPrompt);
  setCache(cacheKey, result);
  return result;
} catch (err) {
  const localResult = await callOllama(systemPrompt, userPrompt);
  return localResult;
}
```

### for...of Loop

**File: `backend/server.js`, Lines 105, 350-357**
```js
// for...of with retries
for (let attempt = 1; attempt <= retries; attempt++) {
  try {
    const result = await callGemini(...);
    return result;
  } catch(err) {
    if (attempt < retries) continue;
    throw err;
  }
}
```

**File: `backend/server.js`, Lines 351-357**
```js
// forEach on required fields
required.forEach(field => {
  if (!data[field]) errors.push(`Missing required field: ${field}`);
});
```

### Classes

**File: `backend/server.js`, Line 35**
```js
// Using a class from the SDK
const genAI = new GoogleGenerativeAI(API_KEY);  // instantiating a class

// Getting a model instance (class method)
const model = genAI.getGenerativeModel({ model: MODEL_NAME });
```

**File: `src/firebase.js`, Lines 16-19**
```js
const app = initializeApp(firebaseConfig);    // class instantiation
export const auth = getAuth(app);             // returns Auth class instance
export const db   = getFirestore(app);        // returns Firestore class instance
export const googleProvider = new GoogleAuthProvider();  // new class instance
```

### Default Parameters

**File: `backend/server.js`**
```js
async function callGemini(systemInstruction, userText, retries = 2, timeout = 30000) { // L99
async function callOllama(systemInstruction, userText, forceJson = false, timeout = 120000) { // L138
const { problem, topic, step = 1 } = req.body;  // destructuring default (L466)
```

### Template Literals

```js
// backend/server.js
logger.info(`Cached result for key: ${key.slice(0, 8)}...`);         // L87
console.log(`🚀 DSA Intelligence API running on http://localhost:${PORT}`); // L503

// src/pages/ArrayVisualization.jsx
addToLog(`Step ${i + 1}: Checking array[${i}] = ${array[i]}`);       // L190
addToLog(`✅ SUCCESS: Found ${target} at index ${i}!`);               // L194

// src/pages/PracticePage.jsx
const r = await fetch(`${API_BASE}/analyze`, { ... });                 // L356
```

### Symbols, Map, Set — Referenced Concepts

**Syllabus mentions Map & Set. Project uses them indirectly:**

**File: `src/pages/HashingVisualization.jsx`**
```js
// Hash table concept — implemented manually, mirrors ES6 Map behavior
const [table, setTable] = useState(() => Array.from({ length: 10 }, () => []));
// Array.from is ES6 — creates array from iterable

// Collision detection mirrors what ES6 Map handles internally
```

---

## 2.5 DOM Manipulation — via React Virtual DOM

### Selecting and Modifying Elements

React abstracts raw DOM, but direct DOM access is done via `useRef`:

**File: `src/pages/ArrayVisualization.jsx`, Lines 158-165**
```js
const logEndRef = useRef(null);  // creates a ref to a DOM element

useEffect(() => {
  if (logEndRef.current) {
    // Direct DOM method — scrolls actual DOM element
    logEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [searchLog]);

// Attaching ref to JSX element
<div ref={logEndRef} />   // Line 450 — React assigns DOM node to ref
```

**File: `src/pages/PracticePage.jsx`, Line 338**
```js
const textareaRef = useRef(null);  // ref to <textarea> DOM element
// Used for programmatic focus on the textarea
```

### Event Handling — click, change, submit, hover, keyboard

**File: `src/pages/ArrayVisualization.jsx`**
```js
// onClick event
<button onClick={runSearch} disabled={!searchVal || isRunning}>🔍</button>
<button onClick={addElement} disabled={!newVal || isRunning}>+</button>
<div onClick={() => removeElement(i)}>...</div>   // inline arrow function

// onChange event
<input onChange={e => setSearchVal(e.target.value)} />
<select onChange={e => setSortAlgo(e.target.value)} />
```

**File: `src/pages/Login.jsx`, Lines 21-22**
```js
// onSubmit — form event
async function handleSubmit(e) {
  e.preventDefault();   // prevent default browser form submission
  // ... handle with JS
}
<form onSubmit={handleSubmit}>
```

**File: `src/components/Navbar.jsx`, Lines 49-50**
```js
// onMouseEnter / onMouseLeave — hover events
<div
  onMouseEnter={() => setDsMenuOpen(true)}
  onMouseLeave={() => setDsMenuOpen(false)}
>
```

**File: `src/pages/PracticePage.jsx`, Lines 454-455**
```js
// onFocus / onBlur — keyboard/focus events
onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
```

### Modifying CSS Dynamically

**File: `src/pages/ArrayVisualization.jsx`, Lines 113-119**
```js
// CSS is computed dynamically based on state variable
function ArrayBox({ value, index, state }) {
  let bg     = "rgba(59,130,246,0.15)";   // default
  let border = "#3b82f6";
  let scale  = "scale(1)";

  if (state === "current") { bg = "rgba(99,102,241,0.4)"; border = "#818cf8"; scale = "scale(1.08)"; }
  if (state === "compare") { bg = "rgba(245,158,11,0.35)"; border = "#fbbf24"; scale = "scale(1.05)"; }
  if (state === "found")   { bg = "rgba(52,211,153,0.35)"; border = "#34d399"; scale = "scale(1.12)"; }

  return (
    <div style={{
      background: bg,         // dynamically modified CSS
      border: `2px solid ${border}`,
      transform: scale,       // CSS transform changes on state
    }}>
```

**File: `src/pages/PracticePage.jsx`, Lines 454-455**
```js
// Direct style property mutation on DOM element via event
e.target.style.borderColor = "rgba(99,102,241,0.4)";  // onFocus
e.target.style.borderColor = "rgba(255,255,255,0.1)";  // onBlur
```

### DOM Tree Traversal (React equivalent)

**File: `src/App.jsx`, Lines 29-34**
```jsx
// PageWrapper traverses location to decide layout
function PageWrapper({ children }) {
  const location = useLocation();    // reads current URL (DOM-aware)
  const isFullWidth = FULL_WIDTH_PATHS.includes(location.pathname);
  if (isFullWidth) return children; // conditionally wraps children
  return <div className="main-content">{children}</div>;
}
```

**File: `src/components/Navbar.jsx`, Line 22**
```js
// Optional chaining — safe traversal of nested object properties
const initial = currentUser?.displayName?.[0]?.toUpperCase()
             || currentUser?.email?.[0]?.toUpperCase()
             || "U";
```

---

## Summary Table — Unit 2 Concepts vs Files

| Concept | File | Lines |
|---------|------|-------|
| `let` / `const` | `server.js`, `ArrayVisualization.jsx` | 34–36, 213 |
| Datatypes (all) | `PracticePage.jsx`, `server.js` | 329–337 |
| Arithmetic/Comparison/Logical Operators | `ArrayVisualization.jsx` | 218, 206, 262 |
| Ternary Operator | `ArrayVisualization.jsx` | 117–119 |
| Conditionals (if/else) | `Login.jsx`, `Signup.jsx` | 30–32, 26–27 |
| for loop | `ArrayVisualization.jsx` | 255–268 |
| while loop | `ArrayVisualization.jsx` | 217–237, 314–321 |
| Functions (declaration/expression/arrow) | `server.js`, `ArrayVisualization.jsx` | 63, 93, 167 |
| Objects literal | `server.js`, `Dashboard.jsx` | 258, 4–11 |
| Array methods (map/filter/find/every) | `ArrayVisualization.jsx`, `server.js` | 206, 343 |
| Math object | `ArrayVisualization.jsx`, `PracticePage.jsx` | 218, 231 |
| String methods (includes/slice/trim/split) | `server.js`, `Login.jsx` | 121, 224, 34 |
| Arrow functions | All files | — |
| Spread operator | `ArrayVisualization.jsx` | 170, 253 |
| Destructuring | `ArrayVisualization.jsx`, `server.js` | 262, 377 |
| Default parameters | `server.js` | 99, 138, 466 |
| Template literals | `server.js`, `ArrayVisualization.jsx` | 87, 190 |
| Promises / async/await | `ArrayVisualization.jsx`, `server.js` | 167, 104 |
| Promise.race | `server.js` | 112–115 |
| Array.from (ES6) | `HashingVisualization.jsx` | 169 |
| `useRef` → direct DOM | `ArrayVisualization.jsx` | 158–165 |
| Event handling (click/change/submit/hover) | `Login.jsx`, `Navbar.jsx` | 21, 49 |
| Modifying CSS dynamically | `ArrayVisualization.jsx` | 113–119 |
| DOM traversal (optional chaining) | `Navbar.jsx` | 22 |

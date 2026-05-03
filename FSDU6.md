# FSDU6.md — Unit 6: Frontend Framework: React.js
### Full Stack Development | VIT | DSA Verse Project Codebase Mapping
---

## 6.1 Introduction to React — What and Why

React is a JavaScript library for building **component-based UIs**. This project uses React 18 with Vite as the build tool.

**File: `src/main.jsx`, Lines 1-9** — React Entry Point
```jsx
import React    from "react";
import ReactDOM from "react-dom/client";
import App      from "./App.jsx";

// ReactDOM.createRoot = React 18 concurrent mode entry point
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>    {/* StrictMode: shows extra warnings in development */}
    <App />             {/* Root component */}
  </React.StrictMode>
);
```

**How the app starts:**
1. Browser loads `index.html`
2. `<div id="root">` is the DOM mount point
3. `main.jsx` runs → `ReactDOM.createRoot(#root)` → React takes over
4. React renders `<App />` as the first component

---

## 6.2 React Components — Functional Components

**File: `src/pages/LandingPage.jsx`, Lines 58-227**
```jsx
// Default export — page-level functional component (no class needed)
export default function LandingPage() {
  // No state needed — purely presentational

  return (
    <div className="landing">
      <section className="landing-hero">
        <h1 className="landing-title">Master Data Structures</h1>
      </section>
    </div>
  );
}
```

**File: `src/pages/Dashboard.jsx`, Lines 29-44** — Reusable Child Component
```jsx
// Reusable component — receives data via props
function TopicCard({ topic }) {        // destructured props
  const dc = DIFF_COLORS[topic.diff]; // uses prop data

  return (
    <Link to={topic.route} className="topic-card">
      <span className="topic-icon">{topic.icon}</span>
      <h3>{topic.title}</h3>
      <p>{topic.desc}</p>
    </Link>
  );
}
```

**File: `src/pages/PracticePage.jsx`, Lines 76-117** — Multiple helper components
```jsx
// ApproachCard — sub-component for one analysis approach
function ApproachCard({ a, idx, onSelect, selected }) {  // multiple props
  return (
    <div onClick={() => onSelect(idx)}
      style={{ background: selected ? "rgba(99,102,241,0.1)" : "..." }}>
      <span>{a.name}</span>
      <span>T: {a.timeComplexity}</span>
    </div>
  );
}

// FlowchartSVG — renders SVG diagram from data
function FlowchartSVG({ steps = [] }) {   // default prop value
  if (!steps?.length) return null;        // early return pattern
  return <svg>...</svg>;
}
```

---

## 6.3 JSX — JavaScript XML

JSX lets you write HTML-like syntax in JavaScript files. It compiles to `React.createElement()` calls.

**JSX Rules demonstrated in project:**

**File: `src/pages/ArrayVisualization.jsx`, Lines 113-132**
```jsx
// Rule 1: Use className instead of class
<div className="array-box">...</div>

// Rule 2: Self-closing tags required
<input type="text" />
<br />

// Rule 3: JavaScript expressions in {}
<span>{value}</span>                         // variable
<span>{64 * 2}</span>                        // expression
<span>{value > 50 ? "big" : "small"}</span>  // ternary

// Rule 4: Inline styles use camelCase and objects
<div style={{ backgroundColor: "blue", fontSize: 16 }}>...</div>
// NOT: style="background-color: blue"

// Rule 5: Single root element (or Fragment)
return (
  <>                    {/* React Fragment — avoids extra <div> */}
    <nav>...</nav>
    <div>...</div>
  </>
);

// Rule 6: Comments inside JSX
{/* This is a JSX comment */}
```

**File: `src/pages/LandingPage.jsx`, Lines 97-109**
```jsx
// JSX allows full JS expressions inside lists
{[
  { num: "12", label: "DSA Units" },
  { num: "20+", label: "Algorithms" },
  { num: "7",  label: "Visualizers" },
].map((s) => (
  <div key={s.label} className="stats-bar-item">  {/* key is required! */}
    <strong>{s.num}</strong>
    <span>{s.label}</span>
  </div>
))}
```

---

## 6.4 Render Function — How React Renders

React's render cycle:
1. State/props change → component function re-executes
2. Returns new JSX → React diffs with Virtual DOM
3. Only changed real DOM nodes are updated (reconciliation)

**File: `src/pages/ArrayVisualization.jsx`**
```jsx
// Every time ANY state changes, this function re-runs
export default function ArrayVisualization() {
  const [array, setArray]             = useState([64, 34, 25, 12, 22]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex]   = useState(-1);

  // Re-renders trigger this JSX to be re-evaluated
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {array.map((v, i) => (
        <ArrayBox
          key={i}
          value={v}
          index={i}
          state={getState(i)}   // computed from state — changes trigger re-render
        />
      ))}
    </div>
  );
}
```

---

## 6.5 Component API — Props

### Passing Data from Parent to Child

**File: `src/pages/Dashboard.jsx`, Lines 102-103**
```jsx
// Parent passes "topic" object as prop to each TopicCard
{DS_TOPICS.map((t) => (
  <TopicCard
    key={t.route + t.title}   // key prop (required for lists)
    topic={t}                  // "topic" prop — the data
  />
))}
```

**File: `src/pages/Dashboard.jsx`, Lines 29-44** — Child receives props
```jsx
function TopicCard({ topic }) {        // receives "topic" prop
  return (
    <Link to={topic.route}>           // uses topic.route
      <h3>{topic.title}</h3>          // uses topic.title
      <p>{topic.desc}</p>             // uses topic.desc
    </Link>
  );
}
```

### Passing Data from Child to Parent (via callback props)

**File: `src/pages/PracticePage.jsx`, Lines 648-651**
```jsx
{/* Parent passes onSelect callback to child */}
{analysis.approaches?.map((a, i) => (
  <ApproachCard
    key={i}
    a={a}
    idx={i}
    selected={selectedApproach === i}
    onSelect={setSelectedApproach}    {/* function prop = child-to-parent communication */}
  />
))}
```

**File: `src/pages/PracticePage.jsx`, Lines 81-82**
```jsx
function ApproachCard({ a, idx, onSelect, selected }) {
  return (
    <div onClick={() => onSelect(idx)}>  {/* calls parent's setSelectedApproach(idx) */}
      ...
    </div>
  );
}
```

### Passing Children as Props

**File: `src/App.jsx`, Lines 60-68**
```jsx
{/* AuthProvider receives all route components as "children" */}
<AuthProvider>
  <Navbar />
  <Routes>...</Routes>
</AuthProvider>
```

**File: `src/contexts/AuthContext.jsx`, Lines 104-108**
```jsx
// AuthProvider renders its children inside the context
export function AuthProvider({ children }) {  // "children" is a special React prop
  return (
    <AuthContext.Provider value={value}>
      {children}   {/* renders Navbar + Routes passed from App.jsx */}
    </AuthContext.Provider>
  );
}
```

---

## 6.6 Component State — useState Hook

**File: `src/pages/ArrayVisualization.jsx`, Lines 136-159**
```jsx
// useState returns [currentValue, setterFunction]
const [array,         setArray]         = useState([64, 34, 25, 12, 22, 11, 90]);
const [currentIndex,  setCurrentIndex]  = useState(-1);    // number state
const [compareIndex,  setCompareIndex]  = useState(-1);
const [foundIndex,    setFoundIndex]    = useState(-1);
const [searchLog,     setSearchLog]     = useState([]);    // array state
const [isRunning,     setIsRunning]     = useState(false); // boolean state
const [sortAlgo,      setSortAlgo]      = useState("bubble"); // string state
const [newVal,        setNewVal]        = useState("");
const [searchVal,     setSearchVal]     = useState("");
const logEndRef = useRef(null);                            // ref (mutable, no re-render)
```

**How state update triggers re-render:**
```jsx
// When setIsRunning(true) is called:
// 1. React schedules re-render
// 2. ArrayVisualization() runs again
// 3. isRunning = true now
// 4. Button becomes disabled={true}
// This is fundamentally different from jQuery's imperative DOM manipulation
```

**Functional state update pattern:**
**File: `src/pages/ArrayVisualization.jsx`, Line 170**
```jsx
// Using previous state — safe for async updates
setSearchLog(prev => [...prev, msg]);   // prev = guaranteed current value
setArray(prev => [...prev, newElement]); // append to array
setStep(s => Math.min(s + 1, 3));       // increment with max cap
```

---

## 6.7 Component Lifecycle — useEffect Hook

### Mount (componentDidMount equivalent)

**File: `src/pages/PracticePage.jsx`, Lines 341-346**
```jsx
useEffect(() => {
  // Runs ONCE when component first appears on screen
  fetch(`${API_BASE}/health`)
    .then(r => r.json())
    .then(d => setBackendOk(d.status === "ok"))
    .catch(() => setBackendOk(false));
}, []);  // ← empty array = run only on mount
```

### Update (componentDidUpdate equivalent)

**File: `src/pages/ArrayVisualization.jsx`, Lines 160-165**
```jsx
useEffect(() => {
  // Runs EVERY TIME searchLog array changes
  if (logEndRef.current) {
    logEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [searchLog]);  // ← dependency array = run when searchLog changes
```

**File: `src/pages/Login.jsx`, Lines 15-19**
```jsx
useEffect(() => {
  // Runs every time currentUser changes
  if (currentUser) {
    navigate("/dashboard");  // redirect if already logged in
  }
}, [currentUser, navigate]);  // ← two dependencies
```

### Unmount (componentWillUnmount equivalent)

**File: `src/contexts/AuthContext.jsx`, Lines 60-76**
```jsx
useEffect(() => {
  // SETUP: Subscribe to Firebase auth changes
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setLoading(false);
  });

  const timer = setTimeout(() => setLoading(false), 5000);

  // CLEANUP: This runs when component unmounts
  return () => {
    unsubscribe();       // Stop listening to Firebase
    clearTimeout(timer); // Cancel pending timer
  };
}, []);
```

---

## 6.8 Refs — useRef Hook

**File: `src/pages/ArrayVisualization.jsx`, Lines 158-165**
```jsx
const logEndRef = useRef(null);  // create ref object: { current: null }

// Attach ref to DOM element
<div ref={logEndRef} />          // React sets logEndRef.current = actual DOM node

// Use ref to call DOM methods directly
useEffect(() => {
  if (logEndRef.current) {
    logEndRef.current.scrollIntoView({ behavior: "smooth" }); // native DOM method
  }
}, [searchLog]);
```

**File: `src/pages/PracticePage.jsx`, Line 338**
```jsx
const textareaRef = useRef(null);
// Later: textareaRef.current.focus() — programmatically focus textarea
<textarea ref={textareaRef} ... />
```

---

## 6.9 Keys — List Rendering

**File: `src/pages/LandingPage.jsx`, Line 104**
```jsx
// key must be unique and stable — helps React track which items changed
{stats.map((s) => (
  <div key={s.label} className="stats-bar-item">  // s.label is unique key
    {s.num}
  </div>
))}
```

**File: `src/pages/ArrayVisualization.jsx`**
```jsx
{array.map((v, i) => (
  <ArrayBox
    key={i}         // index as key (ok for static lists)
    value={v}
    index={i}
    state={getState(i)}
  />
))}
```

---

## 6.10 Component Styling — All Methods

### 1. External CSS File (imported)

**File: `src/App.jsx`, Lines 23-24**
```jsx
import "./index.css";  // applies globally to all components
import "./auth.css";   // applies globally
```

### 2. CSS Modules (concept used via Tailwind classes)

**File: `src/pages/Dashboard.jsx`, Lines 29-44**
```jsx
<Link to={topic.route} className="topic-card">  // class defined in index.css
  <div className="topic-card-header">
    <span className="topic-badge">Beginner</span>
  </div>
</Link>
```

### 3. Inline Styles

**File: `src/pages/PracticePage.jsx`, Lines 83-88**
```jsx
<div onClick={() => onSelect(idx)}
  style={{
    background: selected ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${selected ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 14,
    padding: "16px 18px",
    cursor: "pointer",
    transition: "all 0.2s",
  }}>
```

### 4. Conditional Classes

**File: `src/components/Navbar.jsx`, Lines 43-45**
```jsx
<NavLink
  to="/dashboard"
  className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
>
  Dashboard
</NavLink>
```

### 5. Tailwind CSS Utility Classes

**File: `src/pages/ArrayVisualization.jsx`**
```jsx
<div className="page-container">      // custom class (defined via Tailwind)
  <div className="page-header">
    <h1 className="page-title">Arrays & Searching</h1>
  </div>
</div>
```

---

## 6.11 useCallback Hook

**File: `src/pages/PracticePage.jsx`, Line 1**
```jsx
import { useState, useRef, useEffect, useCallback } from "react";
// useCallback memoizes a function reference so it doesn't recreate on every render
// Used to optimize child component re-renders when passing callbacks as props
```

---

## 6.12 Complete Algorithm Animation Flow (Core Feature)

This is the most important feature of the project — shows how React state drives visualizations:

**File: `src/pages/ArrayVisualization.jsx`, Lines 167-209**
```jsx
// Helper: pauses execution for animation timing
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Helper: adds message to search log
const addToLog = (msg) => setSearchLog(prev => [...prev, msg]);

// === LINEAR SEARCH ANIMATION ===
async function linearSearch(target) {
  setIsRunning(true);    // disable buttons during animation
  setFoundIndex(-1);     // reset previous results
  addToLog(`🔍 Starting Linear Search for ${target}`);

  for (let i = 0; i < array.length; i++) {
    setCurrentIndex(i);   // highlight current element → triggers re-render
    addToLog(`Step ${i + 1}: Checking array[${i}] = ${array[i]}`);

    await sleep(800);     // pause 800ms → React renders highlighted element

    if (array[i] === target) {
      setFoundIndex(i);   // highlight found element → re-render with "found" state
      addToLog(`✅ Found ${target} at index ${i}!`);
      setIsRunning(false);
      return;
    }
  }

  addToLog(`❌ ${target} not found in array.`);
  setCurrentIndex(-1);
  setIsRunning(false);
}

// === BINARY SEARCH ANIMATION ===
async function binarySearch(target) {
  setIsRunning(true);
  let left = 0, right = array.length - 1, step = 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);   // Math.floor
    setCurrentIndex(mid);                         // highlight mid → re-render
    setCompareIndex(left);                        // show search range
    addToLog(`Step ${step}: mid=${mid}, arr[mid]=${array[mid]}, range=[${left}..${right}]`);

    await sleep(900);   // pause for animation

    if (array[mid] === target) {
      setFoundIndex(mid);
      addToLog(`✅ Found at index ${mid}!`);
      break;
    } else if (array[mid] < target) {
      addToLog(`${array[mid]} < ${target}, search RIGHT half`);
      left = mid + 1;   // eliminate left half
    } else {
      addToLog(`${array[mid]} > ${target}, search LEFT half`);
      right = mid - 1;  // eliminate right half
    }
    step++;
  }
  setIsRunning(false);
}
```

---

## 6.13 React Router — Complete Usage

**File: `src/App.jsx`, Lines 1-73**
```jsx
import {
  BrowserRouter as Router,  // HTML5 History API router
  Routes,                   // container for Route definitions
  Route,                    // maps URL path to component
  Navigate,                 // programmatic redirect
  useLocation,              // hook: access current URL
  Link,                     // anchor tag that doesn't reload page
  NavLink,                  // Link with active state
} from "react-router-dom";

// Route definitions
<Routes>
  <Route path="/"          element={<LandingPage />} />
  <Route path="/login"     element={<Login />} />
  <Route path="/signup"    element={<Signup />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/array"     element={<ArrayVisualization />} />
  <Route path="/stack-queue" element={<StackQueueVisualization />} />
  <Route path="/tree"      element={<TreeVisualization />} />
  <Route path="/heap"      element={<HeapVisualization />} />
  <Route path="/hashing"   element={<HashingVisualization />} />
  <Route path="/graph"     element={<GraphVisualization />} />
  <Route path="/algorithms" element={<AlgorithmsPage />} />
  <Route path="/practice"  element={<PracticePage />} />
  <Route path="*"          element={<Navigate to="/" replace />} />  {/* 404 redirect */}
</Routes>
```

**`useNavigate` hook — programmatic navigation:**
**File: `src/pages/Login.jsx`, Lines 13, 28**
```jsx
const navigate = useNavigate();
// After successful login:
navigate("/dashboard");  // redirect without page reload
```

**`useLocation` hook — reading current URL:**
**File: `src/App.jsx`, Lines 27-35**
```jsx
function PageWrapper({ children }) {
  const location = useLocation();  // { pathname: "/array", search: "", hash: "" }

  const FULL_WIDTH_PATHS = ["/", "/login", "/signup"];
  const isFullWidth = FULL_WIDTH_PATHS.includes(location.pathname);

  // Don't wrap landing/auth pages in the content div
  if (isFullWidth) return children;
  return <div className="main-content">{children}</div>;
}
```

---

## Summary Table — Unit 6 Concepts vs Files

| React Concept | File | Lines |
|--------------|------|-------|
| ReactDOM.createRoot (entry point) | `src/main.jsx` | 5–8 |
| React.StrictMode | `src/main.jsx` | 6 |
| Functional Components | `src/pages/LandingPage.jsx` | 58 |
| Reusable Child Component | `src/pages/Dashboard.jsx` | 29–44 |
| Component sub-functions | `src/pages/PracticePage.jsx` | 76–117 |
| JSX className | `ArrayVisualization.jsx` | 113 |
| JSX expressions `{}` | `LandingPage.jsx` | 75–78 |
| JSX ternary | `ArrayVisualization.jsx` | 117 |
| JSX inline style | `PracticePage.jsx` | 83–88 |
| JSX Fragment `<>` | `Navbar.jsx` | 32 |
| JSX comments `{/* */}` | All files | — |
| Render function (re-render on state change) | `ArrayVisualization.jsx` | 395–435 |
| useState (number) | `ArrayVisualization.jsx` | 137–145 |
| useState (boolean) | `ArrayVisualization.jsx` | 146 |
| useState (string) | `PracticePage.jsx` | 329 |
| useState (array) | `ArrayVisualization.jsx` | 136 |
| useState (null → object) | `PracticePage.jsx` | 331 |
| Functional state update | `ArrayVisualization.jsx` | 170 |
| useEffect on mount `[]` | `PracticePage.jsx` | 341–346 |
| useEffect on update `[dep]` | `ArrayVisualization.jsx` | 160–165 |
| useEffect cleanup (unmount) | `AuthContext.jsx` | 72–75 |
| useRef (DOM access) | `ArrayVisualization.jsx` | 158–165 |
| useRef (textarea focus) | `PracticePage.jsx` | 338 |
| useCallback | `PracticePage.jsx` | 1 |
| Props (parent→child) | `Dashboard.jsx` | 102, 29–44 |
| Callback props (child→parent) | `PracticePage.jsx` | 649, 81 |
| children prop | `AuthContext.jsx` | 104–108 |
| key prop | `LandingPage.jsx` | 104 |
| Conditional rendering `&&` | `Navbar.jsx` | 58 |
| List rendering `.map()` | `Dashboard.jsx` | 102 |
| External CSS import | `App.jsx` | 23–24 |
| Inline CSS styles | `PracticePage.jsx` | 83–88 |
| Tailwind CSS classes | `ArrayVisualization.jsx` | 461 |
| Conditional classes | `Navbar.jsx` | 43 |
| BrowserRouter | `App.jsx` | 38 |
| Routes + Route | `App.jsx` | 44–68 |
| Navigate (redirect) | `App.jsx` | 67 |
| Link (no reload) | `Dashboard.jsx` | 32 |
| NavLink (active state) | `Navbar.jsx` | 43 |
| useNavigate (programmatic) | `Login.jsx` | 13, 28 |
| useLocation (current path) | `App.jsx` | 27 |
| ProtectedRoute (auth guard) | `ProtectedRoute.jsx` | All |
| Async animations with state | `ArrayVisualization.jsx` | 167–237 |
| Context API (createContext) | `AuthContext.jsx` | 13 |
| Context Provider | `AuthContext.jsx` | 104 |
| useContext consumption | `Navbar.jsx` | 16 |

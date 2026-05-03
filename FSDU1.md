# FSDU1.md — Unit 1: Web Essentials
### Full Stack Development | VIT | DSA Verse Project Codebase Mapping
---

## 1.1 Introduction to the Web — Web 1.0, 2.0, 3.0

| Version | Description | Project Relevance |
|---------|-------------|-------------------|
| Web 1.0 | Static read-only pages | `index.html` is a static HTML shell |
| Web 2.0 | Dynamic, interactive, user-generated content | React SPA with real-time visualizations |
| Web 3.0 | Decentralized, AI-driven apps | Firebase backend + Gemini AI integration |

> This project is a **Web 2.0/3.0 hybrid**: dynamic React SPA + AI-powered problem analyser.

---

## 1.2 Internet Basics — Clients, Servers, IP, DNS, Hosting

- **Client:** The browser running the React app (`http://localhost:8080`)
- **Server:** Node.js/Express backend running at `http://localhost:3001`
- **DNS:** Firebase hosting resolves domain → IP for deployed version
- **IP:** The Vite dev server binds to all interfaces:

**File: `vite.config.ts`, Lines 7-10**
```ts
server: {
  host: "::",   // binds to all IPv4 and IPv6 interfaces
  port: 8080,
},
```

---

## 1.3 HTTP & HTTPS — Request/Response, Methods, Status Codes, URL Structure

### HTTP Methods Used

**File: `backend/server.js`**
```js
// GET — Health check endpoint (Line 497)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: MODEL_NAME });
});

// POST — Main analysis endpoint (Line 376)
app.post("/api/analyze", async (req, res) => {
  const { topic, problem } = req.body; // reading from HTTP request body
  // ...
});

// POST — Hint endpoint (Line 465)
app.post("/api/hint", async (req, res) => {
  const { problem, topic, step = 1 } = req.body;
});

// POST — Similar problems endpoint (Line 480)
app.post("/api/similar", async (req, res) => {
  const { problem, topic } = req.body;
});
```

### HTTP Status Codes Used

**File: `backend/server.js`, Lines 379-385**
```js
const validation = validateInput(req.body, ["topic", "problem"]);
if (!validation.valid) {
  return res.status(400).json({   // 400 Bad Request
    error: "Validation failed",
    details: validation.errors
  });
}
res.json({ success: true, data: parsed }); // 200 OK (implicit)
```

### URL Structure — API Base URL

**File: `src/pages/PracticePage.jsx`, Line 3**
```js
// URL with protocol + host + port + path
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
//               └─ from .env file              └─ fallback URL
```

### HTTP Request from Frontend (fetch API)

**File: `src/pages/PracticePage.jsx`, Lines 356-364**
```js
const r = await fetch(`${API_BASE}/analyze`, {
  method: "POST",                                    // HTTP Method
  headers: { "Content-Type": "application/json" },  // HTTP Header
  body: JSON.stringify({ topic, problem })           // HTTP Request Body
});
const d = await r.json();  // parsing HTTP Response body
```

---

## 1.4 Browser Architecture & Rendering Process

- The browser fetches `index.html` → loads `main.jsx` via `<script type="module">` → React renders the Virtual DOM → browser paints the real DOM.
- **CORS (Cross-Origin Resource Sharing):** Browser enforces same-origin policy. Backend must allow frontend origin.

**File: `backend/server.js`, Lines 17-30**
```js
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    // Allow if no origin (server-to-server) OR origin is whitelisted
    if (!origin || allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost")) {
      callback(null, true);   // ALLOW
    } else {
      callback(new Error("Not allowed by CORS")); // BLOCK
    }
  }
}));
```

---

## 1.5 Developer Tools — Console, Network Tab, Debugging

The backend implements a **custom logger** that mirrors what a developer sees in the browser console's Network tab:

**File: `backend/server.js`, Lines 39-47**
```js
const logger = {
  info:    (msg) => console.log(`ℹ️ ${msg}`),       // blue info
  success: (msg) => console.log(`✅ ${msg}`),       // green success
  warn:    (msg) => console.warn(`⚠️ ${msg}`),      // yellow warning
  error:   (msg, err = null) => {
    console.error(`❌ ${msg}`);                     // red error
    if (err) console.error(`   Details: ${err.message || err}`);
  }
};
```

---

## 1.6 Web Project Structure — Folder Organization

```
Data_Visualizer/              ← project root
├── index.html                ← HTML entry point
├── package.json              ← npm scripts and dependencies
├── vite.config.ts            ← build tool config
├── tailwind.config.ts        ← CSS framework config
├── .env                      ← environment variables (secrets)
├── .env.example              ← template for other devs
├── src/                      ← all frontend source code
│   ├── main.jsx              ← React DOM entry point
│   ├── App.jsx               ← Root component + router
│   ├── index.css             ← Global styles + design tokens
│   ├── auth.css              ← Auth page specific styles
│   ├── firebase.js           ← Firebase SDK config
│   ├── pages/                ← One file per route/page
│   ├── components/           ← Reusable UI components
│   ├── contexts/             ← React Context (global state)
│   ├── hooks/                ← Custom React hooks
│   ├── lib/                  ← Utility functions
│   └── theory/               ← TypeScript data files for DSA theory
└── backend/                  ← Node.js/Express server
    ├── server.js             ← Main backend file
    ├── context.md            ← DSA knowledge base (RAG context)
    ├── cache.json            ← AI response cache
    └── package.json          ← Backend dependencies
```

**File: `index.html` — Linking external files**
```html
<!-- Linking external JS module (scripts) -->
<script type="module" src="/src/main.jsx"></script>
```
CSS is linked inside React via imports:
```js
// src/App.jsx, Lines 23-24
import "./index.css";   // external stylesheet
import "./auth.css";    // external stylesheet
```

---

## 1.7 HTML5 Basics — Elements, Headings, Fonts, Links, Images, Forms, Tables

### HTML5 Document Structure

**File: `index.html`, Lines 1-19**
```html
<!doctype html>              <!-- HTML5 doctype declaration -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DSA Visualizer - Interactive Algorithm Learning Platform</title>
    <meta name="description" content="Master data structures..." />
    <meta name="author" content="DSA Visualizer" />
    <meta name="keywords" content="data structures, algorithms..." />
    <!-- Open Graph tags for social sharing -->
    <meta property="og:title" content="DSA Visualizer" />
  </head>
  <body>
    <div id="root"></div>    <!-- React mount point -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Headings (h1–h3)

**File: `src/pages/LandingPage.jsx`, Lines 75-78**
```jsx
<h1 className="landing-title">   {/* Single h1 per page — SEO best practice */}
  Master Data Structures & Algorithms
</h1>
<h2>Everything you need to ace DSA</h2>  {/* Section headings */}
<h3>{f.title}</h3>                       {/* Feature card headings */}
```

### Tables (HTML5 `<table>`, `<thead>`, `<tbody>`)

**File: `src/pages/ArrayVisualization.jsx`, Lines 28-41**
```jsx
<table className="theory-table">
  <thead>
    <tr><th>Operation</th><th>Time</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Access arr[i]</td><td>O(1)</td><td>Direct index calculation</td></tr>
    <tr><td>Search (unsorted)</td><td>O(n)</td><td>Linear search</td></tr>
    <tr><td>Search (sorted)</td><td>O(log n)</td><td>Binary search</td></tr>
    <tr><td>Insertion at end</td><td>O(1) amort.</td><td>Dynamic array</td></tr>
    <tr><td>Deletion at i</td><td>O(n)</td><td>Shift elements left</td></tr>
  </tbody>
</table>
```

### Forms & Default Validation

**File: `src/pages/Login.jsx`, Lines 68-92**
```jsx
<form onSubmit={handleSubmit} className="auth-form">
  <label>Email Address</label>
  <input
    type="email"            {/* HTML5 email type — auto-validates format */}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="you@example.com"
    required                {/* HTML5 default validation attribute */}
  />
  <input
    type="password"         {/* HTML5 password type — masks input */}
    value={password}
    required
  />
  <button type="submit" disabled={loading}>Sign In</button>
</form>
```

**File: `src/pages/Signup.jsx`, Lines 75-119**
```jsx
<form onSubmit={handleSubmit} className="auth-form">
  <input type="text"     required />   {/* Full Name */}
  <input type="email"    required />   {/* Email */}
  <input type="password" required />   {/* Password */}
  <input type="password" required />   {/* Confirm Password */}
</form>
```

### Lists (used extensively for theory content)

**File: `src/pages/ArrayVisualization.jsx`, Lines 11-16**
```jsx
<ul>
  <li>Fixed size (static) or dynamic (e.g., ArrayList)</li>
  <li>Elements accessed by index in <strong>O(1)</strong> time</li>
  <li>All elements are of the same type</li>
  <li>Memory layout: Base address + index × element_size</li>
</ul>
<ol>
  <li><strong>Triplet/COO Format:</strong> Store only (row, col, value)</li>
  <li><strong>Compressed Row Storage (CSR):</strong> 3 arrays</li>
</ol>
```

### Semantic HTML5 Elements

**File: `src/pages/LandingPage.jsx`**
```jsx
<section className="landing-hero">     {/* <section> — semantic grouping */}
  ...
</section>
<section className="landing-features">
  ...
</section>
<footer className="landing-footer">    {/* <footer> — semantic footer */}
  <p>Built with ❤️ for VIT students</p>
</footer>
```
**File: `src/components/Navbar.jsx`, Line 33**
```jsx
<nav className="dsa-navbar">           {/* <nav> — semantic navigation */}
  ...
</nav>
```

### Block vs Inline Elements

- **Block elements** used: `<div>`, `<section>`, `<nav>`, `<footer>`, `<h1>`–`<h3>`, `<p>`, `<ul>`, `<table>`
- **Inline elements** used: `<span>`, `<strong>`, `<code>`, `<a>` (via `<Link>`)

**File: `src/pages/ArrayVisualization.jsx`, Lines 13-14**
```jsx
<li>Elements accessed by index in <strong>O(1)</strong> time</li>
{/* <strong> is inline — bolds text without breaking flow */}
```

---

## 1.8 CSS Basics — Types, Selectors, Properties, Box Model

### Types of CSS Applied

| Type | Where Used | Example |
|------|-----------|---------|
| **External CSS** | `src/index.css`, `src/auth.css` | Imported in `App.jsx` |
| **Internal CSS** | `<style>` tag inside JSX | `PracticePage.jsx` Line 748 |
| **Inline CSS** | `style={{ }}` in JSX | Throughout all page components |

**External CSS — File: `src/index.css`, Lines 1-5**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter...');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Internal CSS — File: `src/pages/PracticePage.jsx`, Line 748**
```jsx
<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
```

**Inline CSS — File: `src/pages/ArrayVisualization.jsx`, Lines 122-131**
```jsx
<div style={{
  width: 64,
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: bg,              // dynamic background
  border: `2px solid ${border}`, // dynamic border
  borderRadius: 10,
  fontWeight: 800,
  transition: "all 0.3s",      // CSS transition
}}>
```

### CSS Custom Properties (Variables) — Design Tokens

**File: `src/index.css`, Lines 9-76**
```css
:root {
  /* Colors */
  --background: 222 47% 4%;
  --primary: 217 91% 60%;          /* Electric blue */
  --accent: 180 100% 50%;          /* Cyan accent */
  --neon-purple: 270 100% 70%;

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, hsl(217 91% 60%), hsl(270 100% 70%));

  /* Shadows with glow */
  --shadow-neon: 0 0 25px hsl(217 91% 60% / 0.25);

  /* Animations */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Border radius */
  --radius: 0.85rem;
}
```

### CSS Selectors — Classes, Nested (Child), Pseudo

**File: `src/index.css`, Lines 130-160**
```css
/* Class Selector */
.theory-rich-content {
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
}

/* Nested/Child Selector */
.theory-rich-content h4 {
  color: #60a5fa;
  font-weight: 800;
}

/* Child pseudo-element selector */
.theory-rich-content ul li::before {
  content: "→";
  position: absolute;
  left: -28px;
  color: #60a5fa;
}

/* Pseudo-class selectors */
.log-line:hover {
  background: rgba(255,255,255,0.04);
}
.ctrl-select:focus, .ctrl-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
/* Custom scrollbar pseudo-elements */
.thin-scroll::-webkit-scrollbar { width: 6px; }
.thin-scroll::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground) / 0.3); }
```

### Box Model — Margin, Padding, Border, Background

**File: `src/index.css`, Lines 306-318**
```css
.algo-card {
  background: rgba(0,0,0,0.25);        /* background */
  border: 1px solid rgba(255,255,255,0.08); /* border */
  padding: 20px;                        /* padding (inner space) */
  border-radius: 12px;                  /* border-radius */
  margin-top: 12px;                     /* margin (outer space) */
  transition: var(--transition-smooth); /* CSS transition */
}
.algo-card:hover {
  border-color: rgba(59, 130, 246, 0.3); /* border changes on hover */
}
```

### Text, Colors, Fonts

**File: `src/index.css`, Lines 107-119**
```css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 17px;
  line-height: 1.65;
  /* Radial gradient background */
  background-image:
    radial-gradient(1400px 700px at -20% -20%, hsl(var(--primary) / 0.1), transparent 50%),
    radial-gradient(1400px 700px at 120% 0%, hsl(var(--accent) / 0.1), transparent 50%);
  background-attachment: fixed;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif;  /* Different font for headings */
  font-weight: bold;
  letter-spacing: -0.02em;            /* tracking-tight */
}
```

**Google Fonts import — `src/index.css`, Line 1**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900
  &family=Outfit:wght@400;500;600;700;800;900
  &family=JetBrains+Mono:wght@400;500;700&display=swap');
/* Three font families: Inter (body), Outfit (headings), JetBrains Mono (code) */
```

---

## 1.9 Layout + Animation — Flex, Grid, CSS Animation & Transition

### Flexbox Layout

**File: `src/pages/ArrayVisualization.jsx`, Lines 421-424**
```jsx
<div style={{
  display: "flex",          /* Flexbox container */
  flexWrap: "wrap",         /* wrap to next line if overflow */
  gap: 16,                  /* space between items */
  justifyContent: "center", /* horizontal center */
}}>
```

**File: `src/components/Navbar.jsx`, Lines 42-82**
```jsx
<div className="navbar-links">
  {/* Flexbox row used for all navbar items */}
  <NavLink to="/dashboard">Dashboard</NavLink>
  <NavLink to="/algorithms">Algorithms</NavLink>
</div>
```

### CSS Grid Layout

**File: `src/pages/PracticePage.jsx`, Line 410**
```jsx
<div style={{
  display: "grid",
  gridTemplateColumns: "340px 1fr",  /* sidebar + main */
  gap: 22,
  alignItems: "start"
}}>
```

**File: `tailwind.config.ts`, Lines 17-21**
```ts
theme: {
  container: {
    center: true,
    padding: "2rem",
    screens: { "2xl": "1400px" },  /* responsive breakpoint */
  },
```

### CSS Keyframe Animations (Defined in Tailwind Config)

**File: `tailwind.config.ts`, Lines 99-128**
```ts
keyframes: {
  "fade-in": {
    "0%":   { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "scale-in": {
    "0%":   { transform: "scale(0.95)", opacity: "0" },
    "100%": { transform: "scale(1)",   opacity: "1" },
  },
  float: {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%":      { transform: "translateY(-10px)" },
  },
  "glow-pulse": {
    "0%, 100%": { boxShadow: "var(--shadow-neon)" },
    "50%":      { boxShadow: "var(--shadow-accent)" },
  },
},
animation: {
  "fade-in":    "fade-in 0.3s ease-out",
  float:        "float 3s ease-in-out infinite",
  "glow-pulse": "glow-pulse 2s ease-in-out infinite",
},
```

### CSS @keyframes Inline (spin animation)

**File: `src/contexts/AuthContext.jsx`, Lines 96-99**
```jsx
<div style={{
  animation: "spin 1s linear infinite",  /* referencing keyframe */
}} />
<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
```

### CSS Transitions

**File: `src/index.css`, Lines 65-66**
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**File: `src/pages/ArrayVisualization.jsx`, Line 127**
```jsx
style={{
  transform: scale,           /* dynamically changing transform */
  transition: "all 0.3s",     /* smooth transition on state change */
  boxShadow: state !== "normal" ? `0 0 15px ${border}80` : "none"
}}
```

---

## 1.10 Environment Variables & .env Files

**File: `.env` (frontend)**
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_API_URL=http://localhost:3001/api
```

**File: `backend/.env`**
```
GEMINI_API_KEY=...
FRONTEND_URL=http://localhost:8080
PORT=3001
```

Environment variables are accessed in two different ways:
- **Frontend (Vite):** `import.meta.env.VITE_*` 
- **Backend (Node.js):** `process.env.*`

**File: `src/firebase.js`, Lines 5-13**
```js
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};
```

**File: `backend/server.js`, Lines 10-14**
```js
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ FATAL: GEMINI_API_KEY not set in .env");
  process.exit(1);   // crash server if critical env var is missing
}
```

---

## Summary Table — Unit 1 Concepts vs Files

| Syllabus Concept | File | Lines |
|-----------------|------|-------|
| Web 1.0/2.0/3.0 | `index.html`, `firebase.js` | All |
| HTTP Methods (GET/POST) | `backend/server.js` | 362, 376, 465, 480, 497 |
| HTTP Status Codes | `backend/server.js` | 381 |
| URL Structure | `src/pages/PracticePage.jsx` | 3 |
| CORS / Browser Architecture | `backend/server.js` | 17–30 |
| Developer Tools / Console | `backend/server.js` | 39–47 |
| Project Folder Structure | Entire project | Root |
| HTML5 Doctype, Meta Tags | `index.html` | 1–19 |
| HTML5 Headings h1-h3 | `src/pages/LandingPage.jsx` | 75–78 |
| HTML5 Tables | `src/pages/ArrayVisualization.jsx` | 28–41 |
| HTML5 Forms & Validation | `src/pages/Login.jsx` | 68–92 |
| HTML5 Lists ul/ol | `src/pages/ArrayVisualization.jsx` | 11–16 |
| Semantic Elements (nav, section, footer) | `src/components/Navbar.jsx`, `LandingPage.jsx` | 33, 62 |
| Block vs Inline Elements | All JSX files | — |
| External CSS | `src/App.jsx` | 23–24 |
| Internal CSS (`<style>`) | `src/pages/PracticePage.jsx` | 748 |
| Inline CSS (`style={{}}`) | All page components | — |
| CSS Variables (Custom Properties) | `src/index.css` | 9–76 |
| CSS Selectors (class, nested, pseudo) | `src/index.css` | 130–160 |
| Box Model (margin, padding, border) | `src/index.css` | 306–318 |
| Google Fonts | `src/index.css` | 1 |
| Flexbox Layout | All JSX files | — |
| CSS Grid Layout | `src/pages/PracticePage.jsx` | 410 |
| CSS Animations (@keyframes) | `tailwind.config.ts`, `AuthContext.jsx` | 99–128, 99 |
| CSS Transitions | `src/index.css`, `ArrayVisualization.jsx` | 65–66, 127 |
| Environment Variables | `.env`, `firebase.js`, `server.js` | — |

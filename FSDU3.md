# FSDU3.md — Unit 3: jQuery and Bootstrap
### Full Stack Development | VIT | DSA Verse Project Codebase Mapping
---

## Important Note — Modern Equivalents

> This project does **NOT** use jQuery or Bootstrap directly. These are **legacy tools** from the early Web 2.0 era. In modern professional development, they have been replaced by better alternatives. Your project uses industry-standard modern replacements. If your teacher asks, you must be able to explain this confidently.

| Syllabus Tool | Why Replaced | Modern Equivalent Used in Project |
|---------------|-------------|----------------------------------|
| **jQuery** | React handles DOM and events far more efficiently | **React.js** (Virtual DOM, state-driven UI) |
| **Bootstrap** | Heavy, opinionated CSS with bloat | **Tailwind CSS** (utility-first, purged CSS) |
| **Bootstrap Grid** | 12-column grid system | **CSS Flexbox + CSS Grid** (native browser) |
| **Bootstrap Components** | Pre-built opinionated UI | **Radix UI + shadcn/ui** (accessible, headless) |

---

## 3.1 Why jQuery? — and How React Replaces It

### jQuery Need: DOM Traversal & Selection
jQuery was needed because raw DOM APIs were verbose:
```js
// jQuery style (NOT in project)
$("#my-element").addClass("active").fadeIn();

// Modern React equivalent — state-driven (ArrayVisualization.jsx)
const [isRunning, setIsRunning] = useState(false);
// DOM updates automatically when state changes — no manual traversal needed
<button disabled={isRunning}>Run</button>
```

### jQuery DOM Manipulation → React State

**jQuery style (for comparison):**
```js
// jQuery (NOT used — shown for comparison only)
$(".array-box").css("background", "rgba(99,102,241,0.4)");
$(".array-box").show();
$(".array-box").hide();
```

**React equivalent in project:**

**File: `src/pages/ArrayVisualization.jsx`, Lines 113-132**
```jsx
// React dynamically computes CSS based on state — no jQuery needed
function ArrayBox({ value, index, state }) {
  let bg = "rgba(59,130,246,0.15)";  // default style
  if (state === "current") bg = "rgba(99,102,241,0.4)";  // active style
  if (state === "found")   bg = "rgba(52,211,153,0.35)"; // success style

  // JSX renders with computed styles — equivalent to jQuery .css()
  return (
    <div style={{ background: bg, transition: "all 0.3s" }}>
      {value}
    </div>
  );
}

// Parent controls state — equivalent to jQuery selectors targeting elements
function getState(i) {
  if (i === foundIndex)   return "found";
  if (i === currentIndex) return "current";
  if (i === compareIndex) return "compare";
  return "normal";
}
```

### jQuery Selectors → React Props & State

```js
// jQuery selector (NOT in project)
$(".navbar-link.active")

// React NavLink with active class (src/components/Navbar.jsx, Line 43)
<NavLink
  to="/dashboard"
  className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
>
  Dashboard
</NavLink>
// NavLink automatically applies "active" class — matches jQuery .hasClass()
```

### jQuery Adding/Removing Elements → React Conditional Rendering

**File: `src/components/Navbar.jsx`, Lines 58-73**
```jsx
// React conditional rendering (equivalent to jQuery .show()/.hide())
{dsMenuOpen && (
  <div style={{
    position: "absolute",
    background: "rgba(8,14,30,0.98)",
    // ... dropdown styles
  }}>
    {DS_LINKS.map(l => (
      <Link key={l.to} to={l.to}>{l.label}</Link>
    ))}
  </div>
)}
// dsMenuOpen = true → element added to DOM (jQuery .show())
// dsMenuOpen = false → element removed from DOM (jQuery .hide())
```

**File: `src/pages/ArrayVisualization.jsx`, Lines 331-345**
```jsx
// Adding elements — equivalent to jQuery .append()
function addElement() {
  const v = parseInt(newVal);
  if (!isNaN(v)) {
    setArray(prev => [...prev, v]);  // adds element to end of array
    setNewVal("");
  }
}

// Removing elements — equivalent to jQuery .remove()
function removeElement(i) {
  if (isRunning) return;
  setArray(prev => prev.filter((_, idx) => idx !== i)); // removes at index i
}
```

### jQuery Modifying CSS & Attributes → React Inline Styles

**File: `src/pages/PracticePage.jsx`, Lines 454-455**
```jsx
// Direct attribute/style modification — like jQuery .attr() and .css()
onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
// e.target is the raw DOM element — same as jQuery $(this)
```

### jQuery Event Handling → React Synthetic Events

| jQuery Event | React Equivalent | File & Line |
|-------------|-----------------|-------------|
| `.click()` | `onClick={handler}` | `ArrayVisualization.jsx` L485 |
| `.change()` | `onChange={handler}` | `ArrayVisualization.jsx` L477 |
| `.submit()` | `onSubmit={handler}` | `Login.jsx` L68 |
| `.hover()` | `onMouseEnter/Leave` | `Navbar.jsx` L49–50 |
| `.keyup()` | `onChange` on inputs | `Signup.jsx` L81 |
| `.focus()` | `onFocus={handler}` | `PracticePage.jsx` L454 |
| `.blur()` | `onBlur={handler}` | `PracticePage.jsx` L455 |

**File: `src/components/Navbar.jsx`, Lines 49-50**
```jsx
// jQuery: $(".dropdown").hover(showFn, hideFn)
// React equivalent:
<div
  onMouseEnter={() => setDsMenuOpen(true)}   // hover in
  onMouseLeave={() => setDsMenuOpen(false)}  // hover out
>
```

### jQuery Effects & Animations → CSS Transitions + @keyframes

**jQuery Effects (NOT in project — shown for comparison):**
```js
// jQuery (NOT used)
$("#element").fadeIn(300);
$("#element").slideDown(400);
$("#element").animate({ left: "100px" }, 500);
```

**Modern CSS equivalent in project:**

**File: `src/index.css`, Lines 65-66**
```css
/* Fade effect — CSS transition */
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Slide effect — @keyframes */
```

**File: `tailwind.config.ts`, Lines 108-127**
```ts
keyframes: {
  "fade-in": {                                    // jQuery .fadeIn() equivalent
    "0%":   { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "accordion-down": {                             // jQuery .slideDown() equivalent
    from: { height: "0", opacity: "0" },
    to:   { height: "var(--radix-accordion-content-height)", opacity: "1" },
  },
  float: {                                        // jQuery .animate() equivalent
    "0%, 100%": { transform: "translateY(0px)" },
    "50%":      { transform: "translateY(-10px)" },
  },
},
animation: {
  "fade-in": "fade-in 0.3s ease-out",            // usage: className="animate-fade-in"
  float:     "float 3s ease-in-out infinite",
}
```

---

## 3.2 Bootstrap → Tailwind CSS

### Why Bootstrap? CSS vs Bootstrap

**Bootstrap (NOT in project — for comparison):**
```html
<!-- Bootstrap Grid (NOT used) -->
<div class="container">
  <div class="row">
    <div class="col-md-6">Left</div>
    <div class="col-md-6">Right</div>
  </div>
</div>
<button class="btn btn-primary">Click me</button>
<div class="card">...</div>
```

**Why this project uses Tailwind instead:**
- Bootstrap loads ~150KB CSS; Tailwind purges unused classes — only ships what's used
- Bootstrap forces opinionated design; Tailwind is utility-first and fully custom
- No Bootstrap JavaScript dependency needed

### Bootstrap Grid → CSS Grid / Flexbox in Project

**File: `src/pages/PracticePage.jsx`, Line 410**
```jsx
{/* Bootstrap would use: <div class="row"> / <div class="col-4">  */}
{/* Tailwind/CSS Grid equivalent: */}
<div style={{
  display: "grid",
  gridTemplateColumns: "340px 1fr",   // sidebar (340px) + main (rest)
  gap: 22,
  alignItems: "start"
}}>
  {/* Input Panel (sidebar) */}
  <div style={{ position: "sticky", top: 20 }}>...</div>
  {/* Analysis Panel (main area) */}
  <div>...</div>
</div>
```

**File: `src/pages/Dashboard.jsx` uses Tailwind classes for grid:**
```jsx
<div className="topics-grid">   {/* defined in CSS as CSS Grid */}
  {DS_TOPICS.map(t => <TopicCard key={t.route} topic={t} />)}
</div>
```

**File: `tailwind.config.ts`, Line 6**
```ts
const config: Config = {
  darkMode: ["class"],  // dark mode via class toggle — matches Bootstrap's data-bs-theme
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",  // Tailwind scans these files and purges unused classes
  ],
```

### Bootstrap Responsive Design → Tailwind Responsive Breakpoints

**File: `tailwind.config.ts`, Lines 17-21**
```ts
container: {
  center: true,
  padding: "2rem",
  screens: { "2xl": "1400px" },  // responsive breakpoint — like Bootstrap's .container-xl
},
```

**In JSX — flexWrap for responsive behavior:**
```jsx
{/* Bootstrap: d-flex flex-wrap */}
{/* Tailwind equivalent: */}
<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
  {/* items wrap to next line on small screens */}
</div>
```

### Bootstrap Components → Radix UI + Custom Components

**File: `package.json`, Lines 15-41**
```json
{
  "@radix-ui/react-accordion":    "^1.2.11",  // Bootstrap collapse
  "@radix-ui/react-dialog":       "^1.1.14",  // Bootstrap modal
  "@radix-ui/react-dropdown-menu":"^2.1.15",  // Bootstrap dropdown
  "@radix-ui/react-tabs":         "^1.1.12",  // Bootstrap tabs
  "@radix-ui/react-tooltip":      "^1.2.7",   // Bootstrap tooltip
  "@radix-ui/react-select":       "^2.2.5",   // Bootstrap select
  "@radix-ui/react-progress":     "^1.1.7",   // Bootstrap progress bar
}
```

### Bootstrap Buttons → Custom styled buttons

**File: `src/index.css` (defined in auth.css and index.css)**
```css
/* Custom button — equivalent to Bootstrap's .btn .btn-primary */
.btn-hero-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  transition: all 0.3s;
}
```

**File: `src/pages/ArrayVisualization.jsx`, Lines 501-504**
```jsx
{/* Bootstrap: <button class="btn btn-primary"> */}
{/* Custom equivalent: */}
<button className="btn-primary" onClick={runSort} disabled={isRunning}>
  {isRunning ? "⏳ Sorting..." : "▶ Start Sort"}
</button>
```

### Bootstrap Cards → Custom Card Components

**File: `src/pages/Dashboard.jsx`, Lines 29-44**
```jsx
{/* Bootstrap: <div class="card"> <div class="card-body"> */}
{/* Custom equivalent: */}
function TopicCard({ topic }) {
  return (
    <Link to={topic.route} className="topic-card">   {/* card container */}
      <div className="topic-card-header">             {/* card header */}
        <span className="topic-icon">{topic.icon}</span>
        <span className="topic-badge">{topic.diff}</span>
      </div>
      <h3 className="topic-title">{topic.title}</h3>  {/* card title */}
      <p className="topic-desc">{topic.desc}</p>       {/* card text */}
      <div className="topic-cta">Explore →</div>      {/* card footer */}
    </Link>
  );
}
```

### Bootstrap Tables → Custom styled HTML tables

**File: `src/pages/StackQueueVisualization.jsx`, Lines 78-85**
```jsx
{/* Bootstrap: <table class="table table-striped table-dark"> */}
{/* Custom equivalent: */}
<table className="theory-table">
  <thead>
    <tr><th>Operation</th><th>Stack</th><th>Queue</th></tr>
  </thead>
  <tbody>
    <tr><td>Insert</td><td>O(1) push</td><td>O(1) enqueue</td></tr>
    <tr><td>Delete</td><td>O(1) pop</td><td>O(1) dequeue</td></tr>
  </tbody>
</table>
```

**File: `src/index.css`, Lines 174-207**
```css
/* Custom table styling — replaces Bootstrap .table */
.theory-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}
.theory-table th {
  background: rgba(255, 255, 255, 0.05);
  color: #60a5fa;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.theory-table td {
  color: rgba(255,255,255,0.8);
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
```

### Bootstrap Navbar → Custom Navbar Component

**File: `src/components/Navbar.jsx`, Lines 31-147**
```jsx
{/* Bootstrap: <nav class="navbar navbar-expand-lg navbar-dark bg-dark"> */}
{/* Custom React Navbar: */}
<nav className="dsa-navbar">
  <div className="navbar-inner">
    {/* Brand — Bootstrap: .navbar-brand */}
    <Link to="/" className="navbar-brand">
      <div className="navbar-logo-icon">🧠</div>
      <span className="navbar-brand-text">DSA Verse</span>
    </Link>

    {/* Links — Bootstrap: .navbar-nav .nav-link */}
    <div className="navbar-links">
      <NavLink className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
        Dashboard
      </NavLink>
    </div>

    {/* Hamburger — Bootstrap: .navbar-toggler */}
    <button className="navbar-hamburger" onClick={() => setMobileOpen(o => !o)}>
      <span></span><span></span><span></span>  {/* three lines icon */}
    </button>
  </div>

  {/* Mobile menu — Bootstrap: .navbar-collapse */}
  {mobileOpen && (
    <div className="navbar-mobile">
      {DS_LINKS.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
    </div>
  )}
</nav>
```

---

## 3.3 Cross-Platform UI

**File: `src/index.css`, Lines 101-114**
```css
/* Cross-platform font stack */
body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  /* Falls back through: Inter → system-ui → Apple system font → Blinkmax (Chrome) → any sans-serif */
}

/* Cross-platform scrollbar styling */
.thin-scroll::-webkit-scrollbar { width: 6px; }          /* Chrome/Safari/Edge */
.thin-scroll::-webkit-scrollbar-thumb { border-radius: 999px; }
/* Firefox uses scrollbar-width: thin (in separate rule) */
```

---

## Summary Table — Unit 3 Concepts vs Files

| Syllabus Concept | jQuery/Bootstrap | Modern Replacement | File | Lines |
|-----------------|-----------------|-------------------|------|-------|
| Need for jQuery | DOM manipulation | React Virtual DOM | `ArrayVisualization.jsx` | 113–132 |
| Selectors / filters | `$(".class")` | Props + className | `Navbar.jsx` | 43 |
| DOM traversal | `$.find()` | `useRef`, `useContext` | `ArrayVisualization.jsx` | 158–165 |
| Adding elements | `.append()` | `setArray(prev=>[...prev, v])` | `ArrayVisualization.jsx` | 331 |
| Removing elements | `.remove()` | `.filter()` | `ArrayVisualization.jsx` | 343 |
| Modifying CSS | `.css()` | `style={{ }}` | `ArrayVisualization.jsx` | 113–119 |
| Modifying attributes | `.attr()` | JSX props | All JSX files | — |
| Click event | `.click()` | `onClick` | `ArrayVisualization.jsx` | 485 |
| Hover event | `.hover()` | `onMouseEnter/Leave` | `Navbar.jsx` | 49–50 |
| Form events | `.submit()` | `onSubmit` | `Login.jsx` | 68 |
| Keyboard events | `.keyup()` | `onChange` | `Signup.jsx` | 81 |
| hide/show effects | `.fadeIn()`, `.show()` | Conditional render | `Navbar.jsx` | 58–73 |
| fade effect | `.fadeIn()` | `fade-in` keyframe | `tailwind.config.ts` | 108 |
| slide effect | `.slideDown()` | `accordion-down` keyframe | `tailwind.config.ts` | 100 |
| Bootstrap Grid | `.row .col-md-6` | CSS Grid / Flexbox | `PracticePage.jsx` | 410 |
| Responsive design | breakpoints | Tailwind screens | `tailwind.config.ts` | 20 |
| Bootstrap Button | `.btn .btn-primary` | Custom `.btn-primary` | `index.css` | — |
| Bootstrap Table | `.table` | `.theory-table` | `index.css` | 174–207 |
| Bootstrap Card | `.card .card-body` | `TopicCard` component | `Dashboard.jsx` | 29–44 |
| Bootstrap Navbar | `.navbar` | Custom `Navbar.jsx` | `Navbar.jsx` | 31–147 |
| Bootstrap Modal | `.modal` | `@radix-ui/react-dialog` | `package.json` | 22 |
| Cross-platform UI | Bootstrap default | Custom CSS + Radix UI | `index.css`, `package.json` | — |

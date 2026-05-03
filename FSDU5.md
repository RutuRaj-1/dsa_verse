# FSDU5.md — Unit 5: Frontend Framework: Angular (TypeScript Context)
### Full Stack Development | VIT | DSA Verse Project Codebase Mapping
---

## Important Note — Angular vs React Choice

> This project uses **React.js** (Unit 6) not Angular. However, the Angular syllabus covers **TypeScript** extensively, and this project fully implements TypeScript. The Angular architectural concepts (Components, Routing, Services, Dependency Injection, Lifecycle, Data Binding) are **all present** in React equivalents.

---

## 5.1 TypeScript — Type Annotations & Inference

**File: `vite.config.ts`** — `.ts` extension means TypeScript

**File: `tailwind.config.ts`, Lines 1-6**
```ts
// TypeScript import with type
import type { Config } from "tailwindcss";  // type-only import

// Type annotation on variable
const config: Config = {    // ": Config" is the type annotation
  darkMode: ["class"],
  // ...
};
export default config;
```

**File: `tsconfig.app.json`** — TypeScript compiler configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",           // compile to ES2020 JavaScript
    "lib": ["ES2020", "DOM"],     // include DOM types
    "module": "ESNext",           // use ES modules
    "strict": true,               // enable all strict type checks
    "jsx": "react-jsx"            // JSX transformation mode
  }
}
```

### TypeScript Basic Types

**File: `src/theory/sorting/index.ts`, Lines 1-20**
```ts
// TypeScript interface definition
export interface SortAlgorithm {
  name:        string;   // string type
  timeWorst:   string;   // string type
  timeBest:    string;   // string type
  timeAvg:     string;   // string type
  space:       string;   // string type
  stable:      string;   // string type
  description: string;
  steps:       string[]; // array type
  useCases:    string[]; // array type
  notes?:      string[]; // optional (?) string array
}
```

**File: `src/theory/searching/index.ts`**
```ts
// Reusing interface for searching algorithms
export interface SearchAlgorithm {
  name:        string;
  timeWorst:   string;
  timeAvg:     string;
  space:       string;
  stable:      string;
  description: string;
  steps:       string[];
  notes?:      string[];
}
```

### TypeScript Classes & Inheritance

**File: `src/components/TheoryPanel.tsx`**
```tsx
// TypeScript function component with typed props
interface TheoryPanelProps {
  title:     string;
  algorithm: SortAlgorithm | SearchAlgorithm;  // union type
}

// React component with TypeScript props
export function TheoryPanel({ title, algorithm }: TheoryPanelProps) {
  return (
    <div>
      <h3>{title}</h3>
      {algorithm.steps.map((step, i) => (
        <p key={i}>{step}</p>
      ))}
    </div>
  );
}
```

### TypeScript Enums & Generics (via Tailwind config)

**File: `tailwind.config.ts`**
```ts
import type { Config } from "tailwindcss";

// TypeScript generics — Config<T> type enforces correct config shape
const config: Config = { ... };
// If any property is wrong type, TypeScript shows error at compile time
```

---

## 5.2 Angular Architecture → React Equivalents

### Angular Modules & Components → React Components

| Angular Concept | React Equivalent | File |
|----------------|-----------------|------|
| `@NgModule` | No equivalent — React has no modules | — |
| `@Component` | `function ComponentName()` | All JSX files |
| `template` | `return (<JSX>)` | All JSX files |
| `styles` | `import "./styles.css"` or `style={{}}` | `App.jsx` |
| `selector` | Component name (auto-resolved by import) | All files |

**Angular Component (for comparison):**
```ts
// Angular (NOT in project — shown for comparison)
@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.css']
})
export class ArrayComponent implements OnInit {
  array: number[] = [64, 34, 25];
  ngOnInit() { ... }  // lifecycle hook
}
```

**React equivalent (actual code):**
**File: `src/pages/ArrayVisualization.jsx`, Lines 135-165**
```jsx
// React component — no decorator needed
export default function ArrayVisualization() {
  // State — equivalent to Angular class properties
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);

  // useEffect with empty [] = ngOnInit
  useEffect(() => {
    // runs once on mount — like ngOnInit
  }, []);

  // useEffect with deps = ngOnChanges
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchLog]);  // runs when searchLog changes — like ngOnChanges

  // Template — return JSX
  return (
    <div className="page-container">...</div>
  );
}
```

### Angular Lifecycle → React Hooks Mapping

| Angular Lifecycle | React Hook Equivalent | File & Line |
|------------------|----------------------|-------------|
| `ngOnInit()` | `useEffect(() => {}, [])` | `PracticePage.jsx` L341 |
| `ngOnChanges()` | `useEffect(() => {}, [dep])` | `ArrayVisualization.jsx` L161 |
| `ngOnDestroy()` | Return cleanup from `useEffect` | `AuthContext.jsx` L72 |
| `ngDoCheck()` | Automatic in React | — |

**ngOnDestroy equivalent — Cleanup Function:**
**File: `src/contexts/AuthContext.jsx`, Lines 60-76**
```js
useEffect(() => {
  // Setup: subscribe to auth state changes
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setLoading(false);
  });

  const timer = setTimeout(() => setLoading(false), 5000);

  // Cleanup function = Angular's ngOnDestroy
  return () => {
    unsubscribe();      // unsubscribe from Firebase listener
    clearTimeout(timer); // clear timeout — prevent memory leak
  };
}, []);  // empty array = runs once on mount, cleanup on unmount
```

### Angular Data Binding → React Equivalents

| Angular Binding | Description | React Equivalent | Example |
|----------------|-------------|-----------------|---------|
| `{{ expression }}` | Interpolation | `{expression}` | `{array.length}` |
| `[property]="value"` | Property binding | `prop={value}` | `disabled={isRunning}` |
| `(event)="handler()"` | Event binding | `onEvent={handler}` | `onClick={runSort}` |
| `[(ngModel)]` | Two-way binding | `value + onChange` | Login inputs |

**Interpolation:**
**File: `src/pages/ArrayVisualization.jsx`, Line 417**
```jsx
{/* Angular: {{ array.length }} */}
{/* React: */}
<span>Length: {array.length}</span>
```

**Property Binding:**
**File: `src/pages/ArrayVisualization.jsx`, Line 501**
```jsx
{/* Angular: [disabled]="isRunning" */}
{/* React: */}
<button disabled={isRunning}>▶ Start Sort</button>
```

**Event Binding:**
**File: `src/pages/ArrayVisualization.jsx`, Line 485**
```jsx
{/* Angular: (click)="runSearch()" */}
{/* React: */}
<button onClick={runSearch}>🔍</button>
```

**Two-way binding (Angular `ngModel` → React controlled input):**
**File: `src/pages/Login.jsx`, Lines 73-77**
```jsx
{/* Angular: [(ngModel)]="email" */}
{/* React two-way binding equivalent: */}
<input
  value={email}                                 {/* read: property binding */}
  onChange={(e) => setEmail(e.target.value)}    {/* write: event binding */}
/>
```

### Angular Directives → React Equivalents

| Angular Directive | React Equivalent | File |
|------------------|-----------------|------|
| `*ngIf="condition"` | `{condition && <JSX>}` | All JSX |
| `*ngFor="let x of arr"` | `{arr.map(x => <JSX>)}` | All JSX |
| `[ngClass]="condition"` | `className={cond ? "a" : "b"}` | `Navbar.jsx` |
| `[ngStyle]="styleObj"` | `style={{ ... }}` | All JSX |

**`*ngIf` equivalent:**
**File: `src/components/Navbar.jsx`, Lines 58-73**
```jsx
{/* Angular: *ngIf="dsMenuOpen" */}
{dsMenuOpen && (
  <div className="dropdown-menu">
    {DS_LINKS.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
  </div>
)}
```

**`*ngFor` equivalent:**
**File: `src/pages/Dashboard.jsx`, Line 102**
```jsx
{/* Angular: *ngFor="let topic of DS_TOPICS" */}
{DS_TOPICS.map((t) => <TopicCard key={t.route + t.title} topic={t} />)}
```

**`[ngClass]` equivalent:**
**File: `src/components/Navbar.jsx`, Line 43**
```jsx
{/* Angular: [ngClass]="{'active': isActive}" */}
<NavLink className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
  Dashboard
</NavLink>
```

### Angular Services & Dependency Injection → React Context API

**Angular Service pattern (for comparison):**
```ts
// Angular (NOT in project)
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$ = new BehaviorSubject(null);
  login(email, password) { return this.afAuth.signInWithEmailAndPassword(email, password); }
}
// Inject in component:
constructor(private authService: AuthService) {}
```

**React Context equivalent:**
**File: `src/contexts/AuthContext.jsx`, Lines 13-109**
```js
// Step 1: Create Context (Angular: @Injectable service)
const AuthContext = createContext(null);

// Step 2: Custom hook (Angular: inject service)
export function useAuth() {
  return useContext(AuthContext);  // equivalent to Angular DI
}

// Step 3: Provider (Angular: providedIn: 'root')
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Service methods
  async function signup(email, password, displayName) { ... }
  function login(email, password) { return signInWithEmailAndPassword(auth, email, password); }
  async function loginWithGoogle() { ... }
  function logout() { return signOut(auth); }

  // Provide value to all children — equivalent to Angular DI container
  return (
    <AuthContext.Provider value={{ currentUser, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Consuming the "service" in components:**
**File: `src/components/Navbar.jsx`, Line 16**
```js
// Angular: constructor(private authService: AuthService) {}
// React DI equivalent:
const { currentUser, logout } = useAuth();  // inject AuthContext
```

**File: `src/pages/Dashboard.jsx`, Line 47**
```js
const { currentUser } = useAuth();  // same context consumed in different component
const firstName = currentUser?.displayName?.split(" ")[0] || "Learner";
```

### Angular Routers → React Router

| Angular Router | React Router | File |
|---------------|-------------|------|
| `RouterModule.forRoot(routes)` | `<BrowserRouter>` | `App.jsx` L38 |
| `{ path: 'home', component: HomeC }` | `<Route path="/home" element={<Home/>}>` | `App.jsx` L45 |
| `routerLink="/home"` | `<Link to="/home">` | All pages |
| `routerLinkActive="active"` | `NavLink` with `isActive` | `Navbar.jsx` L43 |
| `router.navigate(['/home'])` | `useNavigate()` + `navigate("/home")` | `Login.jsx` L13,28 |
| `CanActivate guard` | `ProtectedRoute` component | `ProtectedRoute.jsx` |

**File: `src/App.jsx`, Lines 36-73**
```jsx
// Angular: RouterModule.forRoot() in AppModule
// React equivalent:
export default function App() {
  return (
    <Router>          {/* BrowserRouter = Angular RouterModule */}
      <AuthProvider>  {/* DI Provider */}
        <Navbar />
        <Routes>      {/* Angular <router-outlet> */}
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/signup"    element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/array"     element={<ArrayVisualization />} />
          <Route path="*"          element={<Navigate to="/" replace />} />  {/* wildcard */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
```

**File: `src/components/ProtectedRoute.jsx`** — Angular CanActivate Guard
```jsx
// Angular: CanActivate guard
// React equivalent:
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  // If logged in → render children; else redirect to /login
  return currentUser ? children : <Navigate to="/login" replace />;
}
```

**Programmatic navigation:**
**File: `src/pages/Login.jsx`, Lines 13, 28**
```js
const navigate = useNavigate();  // Angular: Router service injection
// ...
navigate("/dashboard");          // Angular: this.router.navigate(['/dashboard'])
```

### Angular Forms → React Controlled Components

**File: `src/pages/Signup.jsx`, Lines 23-41**
```jsx
// Angular Reactive Form equivalent in React:
async function handleSubmit(e) {
  e.preventDefault();                     // prevent default HTML form submission

  // Custom validation (Angular: Validators)
  if (password !== confirm) return setError("Passwords do not match.");
  if (password.length < 6)  return setError("Password must be at least 6 characters.");

  try {
    await signup(email, password, displayName);  // submit
    navigate("/dashboard");
  } catch (err) {
    if (err.message.includes("email-already-in-use")) {
      setError("An account with this email already exists.");
    }
  }
}
```

---

## Summary Table — Unit 5 Concepts vs Files

| Angular/TypeScript Concept | React/TS Equivalent | File | Lines |
|--------------------------|--------------------|----- |-------|
| TypeScript types (string, number, boolean) | In interfaces | `src/theory/sorting/index.ts` | 1–20 |
| TypeScript interfaces | `interface SortAlgorithm` | `src/theory/*/index.ts` | All |
| TypeScript optional `?` | `notes?: string[]` | `src/theory/sorting/index.ts` | 15 |
| Union types | `SortAlgorithm \| SearchAlgorithm` | `TheoryPanel.tsx` | — |
| Type annotations | `const config: Config = {}` | `tailwind.config.ts` | 6 |
| tsconfig strict mode | `"strict": true` | `tsconfig.app.json` | — |
| `@Component` → Component | `function ArrayVisualization()` | `ArrayVisualization.jsx` | 135 |
| `ngOnInit` → useEffect | `useEffect(()=>{}, [])` | `PracticePage.jsx` | 341 |
| `ngOnDestroy` → cleanup | `return () => unsubscribe()` | `AuthContext.jsx` | 72 |
| `ngOnChanges` → useEffect deps | `useEffect(()=>{}, [dep])` | `ArrayVisualization.jsx` | 161 |
| Interpolation `{{ }}` | `{expression}` | `ArrayVisualization.jsx` | 417 |
| Property binding `[prop]` | `prop={value}` | `ArrayVisualization.jsx` | 501 |
| Event binding `(click)` | `onClick={handler}` | `ArrayVisualization.jsx` | 485 |
| Two-way binding `[(ngModel)]` | `value + onChange` | `Login.jsx` | 73–77 |
| `*ngIf` | `{condition && <JSX>}` | `Navbar.jsx` | 58 |
| `*ngFor` | `{arr.map(...)}` | `Dashboard.jsx` | 102 |
| `[ngClass]` | `className={cond ? "a" : "b"}` | `Navbar.jsx` | 43 |
| `@Injectable` Service | `createContext + useContext` | `AuthContext.jsx` | 13 |
| Dependency Injection | `useAuth()` hook | `Navbar.jsx` | 16 |
| RouterModule | `<BrowserRouter>` | `App.jsx` | 38 |
| Route config | `<Route path element>` | `App.jsx` | 45–68 |
| `routerLink` | `<Link to>` | All pages | — |
| `routerLinkActive` | `<NavLink className={isActive}>` | `Navbar.jsx` | 43 |
| `router.navigate()` | `useNavigate()` | `Login.jsx` | 13, 28 |
| `CanActivate` guard | `<ProtectedRoute>` | `ProtectedRoute.jsx` | All |
| Angular Forms | Controlled inputs + onSubmit | `Signup.jsx` | 23–41 |
| Validators | Manual validation JS | `Signup.jsx` | 26–27 |

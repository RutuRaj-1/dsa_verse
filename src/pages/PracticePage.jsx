import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";


const TOPICS = [
  "Arrays", "Linked Lists", "Stacks", "Queues", "Trees (BST)",
  "AVL Trees", "Heaps", "Hashing", "Graphs", "Sorting", "Searching",
  "Dynamic Programming", "Greedy Algorithms", "Backtracking",
  "Divide & Conquer", "Recursion", "String Algorithms"
];

const EXAMPLES = {
  "Arrays": "Find the maximum sum of a contiguous subarray in an array of integers that may include negative numbers.",
  "Linked Lists": "Detect if a linked list has a cycle and find the node where the cycle begins.",
  "Sorting": "Sort an array of student marks in descending order and find the top 3 students efficiently.",
  "Searching": "Find if a given student roll number exists in a sorted list of 10,000 roll numbers.",
  "Graphs": "Find the shortest path between two cities in a weighted road network graph.",
  "Dynamic Programming": "Given a rod of length n and prices for each length, find the maximum obtainable profit.",
  "Trees (BST)": "Insert students sorted by marks into a BST and find the student with the kth highest mark.",
  "Heaps": "Given a stream of integers, find the running median after each insertion.",
  "Hashing": "Count the frequency of each word in a large document and return the top k frequent words.",
  "Backtracking": "Find all possible ways to place N queens on an N×N chessboard so that no two queens attack each other.",
  "Greedy Algorithms": "Given a list of jobs with deadlines and profits, schedule jobs to maximize total profit.",
  "Divide & Conquer": "Multiply two large integers using the Karatsuba algorithm to achieve better than O(n²) complexity.",
};

/* ─── Flowchart SVG ─────────────────────────────────────────────── */
function FlowchartSVG({ steps = [] }) {
  if (!steps?.length) return null;
  const W = 520, boxW = 320, boxH = 44, gap = 24, startX = (W - boxW) / 2;
  const totalH = steps.length * (boxH + gap) + 40;

  const color = { start: "#3b82f6", process: "rgba(255,255,255,0.07)", decision: "#f59e0b", end: "#34d399" };
  const textColor = { start: "#fff", process: "#f1f5f9", decision: "#000", end: "#fff" };
  const border = { start: "#60a5fa", process: "rgba(255,255,255,0.15)", decision: "#fcd34d", end: "#34d399" };

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${totalH}`}>
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const y = 10 + i * (boxH + gap);
        const t = s.type || "process";
        const isDecision = t === "decision";
        const rx = t === "start" || t === "end" ? 22 : isDecision ? 16 : 8;
        return (
          <g key={i}>
            {i > 0 && (
              <line x1={W / 2} y1={y - gap + 4} x2={W / 2} y2={y}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#arr2)" />
            )}
            <rect x={startX} y={y} width={boxW} height={boxH}
              rx={rx} fill={color[t]} stroke={border[t]} strokeWidth="1.5"
              style={{ filter: t === "start" || t === "end" ? "drop-shadow(0 0 6px rgba(99,179,237,0.4))" : "none" }} />
            <text x={W / 2} y={y + boxH / 2 + 5} textAnchor="middle"
              fontSize={12} fill={textColor[t]} fontWeight={t === "start" || t === "end" ? "700" : "500"}>
              {s.step?.length > 50 ? s.step.slice(0, 50) + "…" : s.step}
            </text>
            {isDecision && (
              <>
                <text x={startX - 12} y={y + boxH + gap / 2 + 4} fontSize={10} fill="#fcd34d" textAnchor="middle">YES</text>
                <text x={startX + boxW + 12} y={y + boxH / 2 + 4} fontSize={10} fill="rgba(255,255,255,0.4)" textAnchor="middle">NO</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Approach Card ─────────────────────────────────────────────── */
function ApproachCard({ a, idx, onSelect, selected }) {
  const complexityColor = { brute: "#f87171", optimized: "#fb923c", optimal: "#34d399" };
  const c = complexityColor[a.complexity] || "#94a3b8";
  return (
    <div onClick={() => onSelect(idx)}
      style={{
        background: selected ? "rgba(99,102,241,0.1)" : a.recommended ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${selected ? "#6366f1" : a.recommended ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 14, padding: "16px 18px", cursor: "pointer",
        transition: "all 0.2s", position: "relative",
        boxShadow: selected ? "0 0 0 2px #6366f155" : "none"
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{
          width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#94a3b8", fontSize: 12, fontWeight: 700, flexShrink: 0
        }}>{idx + 1}</span>
        <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15 }}>{a.name}</span>
        <span style={{
          background: `${c}20`, color: c, border: `1px solid ${c}44`,
          borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, textTransform: "capitalize"
        }}>{a.complexity}</span>
        {a.recommended && (
          <span style={{
            background: "rgba(59,130,246,0.15)", color: "#60a5fa",
            border: "1px solid rgba(59,130,246,0.35)", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700
          }}>Recommended</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#34d399", fontFamily: "monospace" }}>T: {a.timeComplexity}</span>
        <span style={{ fontSize: 12, color: "#60a5fa", fontFamily: "monospace" }}>S: {a.spaceComplexity}</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, margin: "0 0 8px" }}>{a.description}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>When: {a.whenToUse}</span>
      </div>
    </div>
  );
}


/* ─── Complexity Chart ──────────────────────────────────────────── */
const COMPLEXITY_TIERS = [
  { label: "O(1)",       color: "#34d399", tier: "Excellent",  width: 5 },
  { label: "O(log n)",  color: "#6ee7b7", tier: "Excellent",  width: 10 },
  { label: "O(n)",      color: "#fcd34d", tier: "Good",       width: 22 },
  { label: "O(n log n)",color: "#fb923c", tier: "Fair",       width: 36 },
  { label: "O(n²)",     color: "#f87171", tier: "Bad",        width: 58 },
  { label: "O(2ⁿ)",     color: "#ef4444", tier: "Horrible",  width: 80 },
  { label: "O(n!)",     color: "#dc2626", tier: "Worst",      width: 100 },
];

function ComplexityChart({ analysis }) {
  const time = analysis?.complexity?.time || "";
  const space = analysis?.complexity?.space || "";
  const explanation = analysis?.complexity?.explanation || "";

  const getMatch = (val) => COMPLEXITY_TIERS.find(t =>
    val.includes(t.label.replace("ⁿ", "^n").replace("²", "^2")) ||
    val.includes(t.label)
  ) || COMPLEXITY_TIERS.find(t => val.toLowerCase().includes(t.label.toLowerCase().split("(")[1]?.split(")")[0] || ""));

  const timeMatch = getMatch(time) || { color: "#60a5fa", tier: "Custom", width: 30 };
  const spaceMatch = getMatch(space) || { color: "#a78bfa", tier: "Custom", width: 20 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: `${timeMatch.color}12`, border: `1px solid ${timeMatch.color}40`, borderRadius: 12, padding: "18px 20px" }}>
          <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Time Complexity</p>
          <p style={{ color: timeMatch.color, fontSize: 26, fontWeight: 900, margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace" }}>{time}</p>
          <span style={{ background: `${timeMatch.color}20`, color: timeMatch.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px" }}>{timeMatch.tier}</span>
        </div>
        <div style={{ background: `${spaceMatch.color}12`, border: `1px solid ${spaceMatch.color}40`, borderRadius: 12, padding: "18px 20px" }}>
          <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Space Complexity</p>
          <p style={{ color: spaceMatch.color, fontSize: 26, fontWeight: 900, margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace" }}>{space}</p>
          <span style={{ background: `${spaceMatch.color}20`, color: spaceMatch.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px" }}>{spaceMatch.tier}</span>
        </div>
      </div>

      {/* Big-O Spectrum Bar */}
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Big-O Complexity Spectrum</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {COMPLEXITY_TIERS.map(t => {
            const isTime = time.includes(t.label) || time === t.label;
            const isSpace = space.includes(t.label) || space === t.label;
            return (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 80, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: t.color, fontWeight: 700, flexShrink: 0, textAlign: "right" }}>{t.label}</span>
                <div style={{ flex: 1, height: 22, background: "rgba(255,255,255,0.04)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{ height: "100%", width: `${t.width}%`, background: `${t.color}30`, borderRadius: 6, border: (isTime || isSpace) ? `1.5px solid ${t.color}` : "none", transition: "width 0.5s", display: "flex", alignItems: "center", paddingLeft: 8, gap: 6 }}>
                    {isTime && <span style={{ fontSize: 10, color: t.color, fontWeight: 800 }}>⏱ Time</span>}
                    {isSpace && <span style={{ fontSize: 10, color: t.color, fontWeight: 800 }}>💾 Space</span>}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", width: 58, flexShrink: 0 }}>{t.tier}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Analysis Explanation</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13.5, lineHeight: 1.7, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>{explanation}</p>
        </div>
      )}

      {/* Per-approach breakdown */}
      {analysis?.approaches?.length > 0 && (
        <div>
          <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Approach Complexity Breakdown</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {analysis.approaches.map((a, i) => {
              const c = { brute: "#f87171", optimized: "#fb923c", optimal: "#34d399" }[a.complexity] || "#94a3b8";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${c}20`, border: `1px solid ${c}44`, color: c, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ flex: 1, color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{a.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34d399" }}>T: {a.timeComplexity}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#60a5fa" }}>S: {a.spaceComplexity}</span>
                  <span style={{ fontSize: 10, background: `${c}15`, color: c, borderRadius: 12, padding: "2px 10px", fontWeight: 700, textTransform: "capitalize" }}>{a.complexity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Hint Panel ────────────────────────────────────────────────── */
function HintPanel({ problem, topic }) {
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const getHint = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, topic, step: step + 1 })
      });
      const d = await r.json();
      setHint(d.hint);
      setStep(s => Math.min(s + 1, 3));
    } catch {
      setHint("Could not fetch hint — ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 12, padding: "16px 18px" }}>
      <p style={{ color: "#fb923c", fontWeight: 700, fontSize: 13, margin: "0 0 10px" }}>Progressive Hints ({step}/3)</p>
      {hint && (
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{hint}</p>
      )}
      {step < 3 && (
        <button onClick={getHint} disabled={loading}
          style={{
            padding: "7px 18px", borderRadius: 8, border: "1px solid rgba(251,146,60,0.3)",
            background: "rgba(251,146,60,0.1)", color: "#fb923c", fontSize: 13, cursor: "pointer", fontWeight: 600
          }}>
          {loading ? "Loading..." : step === 0 ? "Get Hint 1" : `Get Hint ${step + 1}`}
        </button>
      )}
      {step === 3 && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>All hints revealed. Check the Approaches tab for full solutions.</p>}
    </div>
  );
}

/* ─── Similar Problems ─────────────────────────────────────────── */
function SimilarProblems({ problem, topic }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/similar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, topic })
      });
      const d = await r.json();
      setProblems(d.problems || []);
      setLoaded(true);
    } catch {
      setProblems([]);
    }
    setLoading(false);
  };

  const diffColor = { Easy: "#34d399", Medium: "#fb923c", Hard: "#f87171" };

  return (
    <div>
      {!loaded && (
        <button onClick={load} disabled={loading}
          style={{
            padding: "9px 22px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.3)",
            background: "rgba(99,102,241,0.1)", color: "#a5b4fc", fontSize: 13, cursor: "pointer", fontWeight: 600
          }}>
          {loading ? "Finding..." : "Find Similar Problems"}
        </button>
      )}
      {loaded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {problems.map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap"
            }}>
              <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 13, flex: 1 }}>{p.title}</span>
              <span style={{ fontSize: 11, color: diffColor[p.difficulty] || "#94a3b8", fontWeight: 700 }}>{p.difficulty}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "2px 8px" }}>{p.platform}</span>
              <span style={{ fontSize: 11, color: "#a5b4fc" }}>{p.pattern}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── S Styles ──────────────────────────────────────────────────── */
const S = {
  panel: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 },
  header: { padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  body: { padding: "20px" },
  label: { color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 },
  tab: (active) => ({
    padding: "9px 18px", borderRadius: 9, border: `1px solid ${active ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
    background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
    color: active ? "#a5b4fc" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: active ? 700 : 500,
    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap"
  }),
};

/* ─── Main Component ────────────────────────────────────────────── */
export default function PracticePage() {
  const [topic, setTopic] = useState("");
  const [problem, setProblem] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("understanding");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendOk, setBackendOk] = useState(null);
  const [selectedApproach, setSelectedApproach] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  // Check backend health
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.json())
      .then(d => setBackendOk(d.status === "ok"))
      .catch(() => setBackendOk(false));
  }, []);

  const loadExample = () => {
    if (EXAMPLES[topic]) { setProblem(EXAMPLES[topic]); setCharCount(EXAMPLES[topic].length); }
  };

  const analyze = async () => {
    if (!problem.trim() || !topic) return;
    setLoading(true); setError(""); setAnalysis(null);
    try {
      const r = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, problem })
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || "Analysis failed");
      setAnalysis(d.data);
      setActiveTab("understanding");
      setSelectedApproach(0);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const TABS = [
    { id: "understanding", label: "Understanding" },
    { id: "approaches",    label: "Approaches" },
    { id: "flowchart",     label: "Flowchart" },
    { id: "complexity",    label: "Complexity" },
    { id: "hints",         label: "Hints" },
    { id: "similar",       label: "Similar" },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title" style={{ fontSize: 28 }}>Problem Statement Analyser</h1>
        <p className="page-subtitle">
          Enter any DSA problem — get complete approach analysis, multi-language code, flowchart, and visualization powered by Gemini AI
        </p>
        {backendOk === false && (
          <div style={{
            marginTop: 12, padding: "10px 16px", background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, fontSize: 13, color: "#f87171"
          }}>
            Backend offline — start it with: <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: 4 }}>
              cd backend && node server.js
            </code>
          </div>
        )}
        {backendOk === true && (
          <div style={{
            marginTop: 12, padding: "8px 14px", background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10, fontSize: 12, color: "#34d399", display: "inline-flex", alignItems: "center", gap: 8
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
            AI Backend Connected — Gemini-powered analysis ready
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 22, alignItems: "start" }}>
        {/* ── Input Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 20 }}>
          <div style={S.panel}>
            <div style={S.header}><p style={{ ...S.label, marginBottom: 0 }}>Problem Input</p></div>
            <div style={{ ...S.body, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Topic */}
              <div>
                <p style={S.label}>Topic</p>
                <select value={topic} onChange={e => { setTopic(e.target.value); setAnalysis(null); }}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "10px 12px", color: "#f1f5f9", fontSize: 13, cursor: "pointer",
                    outline: "none", appearance: "none"
                  }}>
                  <option value="">-- Choose a topic --</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Load example */}
              {topic && EXAMPLES[topic] && (
                <button onClick={loadExample}
                  style={{
                    padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.3)",
                    background: "rgba(99,102,241,0.08)", color: "#a5b4fc", fontSize: 12, cursor: "pointer", fontWeight: 600, textAlign: "left"
                  }}>
                  Load Example Problem
                </button>
              )}

              {/* Problem Statement */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <p style={{ ...S.label, marginBottom: 0 }}>Problem Statement</p>
                  <span style={{ fontSize: 11, color: charCount > 800 ? "#f87171" : "rgba(255,255,255,0.3)" }}>{charCount}/1000</span>
                </div>
                <textarea ref={textareaRef}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "12px 14px", color: "#f1f5f9", fontSize: 13, lineHeight: 1.7,
                    resize: "vertical", minHeight: 160, fontFamily: "inherit", outline: "none",
                    transition: "border-color 0.2s", boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  placeholder="Describe your problem clearly. Include constraints, input format, and what the output should be..."
                  value={problem}
                  maxLength={1000}
                  onChange={e => { setProblem(e.target.value); setCharCount(e.target.value.length); }}
                />
              </div>

              {/* Analyze Button */}
              <button onClick={analyze}
                disabled={!problem.trim() || !topic || loading || !backendOk}
                style={{
                  padding: "13px 20px", borderRadius: 10, border: "none",
                  background: (!problem.trim() || !topic || loading || !backendOk) ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", fontSize: 15, fontWeight: 700, cursor: (!problem.trim() || !topic || loading) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: "0 4px 20px rgba(99,102,241,0.3)", transition: "all 0.2s"
                }}>
                {loading ? (
                  <>
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                      animation: "spin 0.8s linear infinite", display: "inline-block"
                    }} />
                    Analyzing with AI...
                  </>
                ) : "Analyze Problem"}
              </button>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f87171" }}>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div style={S.panel}>
            <div style={S.header}><p style={{ ...S.label, marginBottom: 0 }}>Problem Solving Tips</p></div>
            <div style={S.body}>
              {[
                "Read carefully — understand what is INPUT and OUTPUT",
                "Identify n size → guides what complexity is acceptable",
                "Think brute force first, then optimize step by step",
                "Check edge cases: empty, single element, negatives",
                "Match pattern: optimization→DP, choices→Greedy, explore→Backtrack",
                "State time and space complexity for every solution",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%", background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Analysis Panel ── */}
        <div>
          {!analysis && !loading && (
            <div style={{
              ...S.panel, padding: "70px 20px", textAlign: "center",
              background: "rgba(255,255,255,0.015)"
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
              }}>AI</div>
              <h3 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>Ready to Analyse</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, maxWidth: 380, margin: "0 auto" }}>
                Select a topic, enter your problem statement, and press Analyze. The AI will provide complete approach analysis, multi-language code, flowchart, and more.
              </p>
            </div>
          )}

          {loading && (
            <div style={{ ...S.panel, padding: "70px 20px", textAlign: "center" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%", margin: "0 auto 20px",
                border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1",
                animation: "spin 1s linear infinite"
              }} />
              <p style={{ color: "#a5b4fc", fontSize: 15, fontWeight: 600 }}>AI is analysing your problem...</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 8 }}>Retrieving context and generating insights</p>
            </div>
          )}

          {analysis && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Quick summary bar */}
              <div style={{
                ...S.panel, padding: "14px 20px",
                display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap"
              }}>
                <div>
                  <p style={{ ...S.label, marginBottom: 2 }}>Pattern</p>
                  <p style={{ color: "#a5b4fc", fontSize: 14, fontWeight: 700, margin: 0 }}>{analysis.understanding?.pattern}</p>
                </div>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <p style={{ ...S.label, marginBottom: 2 }}>Best Time</p>
                  <p style={{ color: "#34d399", fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>{analysis.complexity?.time}</p>
                </div>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <p style={{ ...S.label, marginBottom: 2 }}>Space</p>
                  <p style={{ color: "#60a5fa", fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>{analysis.complexity?.space}</p>
                </div>
                <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <p style={{ ...S.label, marginBottom: 2 }}>Approaches</p>
                  <p style={{ color: "#fb923c", fontSize: 14, fontWeight: 700, margin: 0 }}>{analysis.approaches?.length || 0} solutions</p>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={S.tab(activeTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Understanding Tab */}
              {activeTab === "understanding" && (
                <div style={S.panel}>
                  <div style={S.header}><p style={{ ...S.label, marginBottom: 0 }}>Problem Understanding</p></div>
                  <div style={S.body}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                        <p style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Problem Pattern</p>
                        <p style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, margin: 0 }}>{analysis.understanding?.pattern}</p>
                      </div>
                      <div style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                        <p style={{ color: "#34d399", fontSize: 12, fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Key Insight</p>
                        <p style={{ color: "#f1f5f9", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{analysis.understanding?.keyInsight}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <p style={{ color: "#fb923c", fontSize: 12, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Implicit Constraints</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {analysis.understanding?.constraints?.map((c, i) => (
                          <span key={i} style={{
                            background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)",
                            borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#fb923c"
                          }}>{c}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <p style={{ color: "#f87171", fontSize: 12, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Edge Cases to Handle</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {analysis.understanding?.edgeCases?.map((ec, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ color: "#f87171", fontSize: 12, marginTop: 2 }}>!</span>
                            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{ec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
                      <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Real-World Analogy</p>
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{analysis.understanding?.realWorldAnalogy}</p>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <p style={{ color: "#fcd34d", fontSize: 12, fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Complexity Analysis</p>
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: "monospace" }}>
                        {analysis.complexity?.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Approaches Tab */}
              {activeTab === "approaches" && (
                <div style={S.panel}>
                  <div style={S.header}>
                    <p style={{ ...S.label, marginBottom: 0 }}>All Approaches — Brute to Optimal</p>
                  </div>
                  <div style={{ ...S.body, display: "flex", flexDirection: "column", gap: 12 }}>
                    {analysis.approaches?.map((a, i) => (
                      <ApproachCard key={i} a={a} idx={i} selected={selectedApproach === i} onSelect={setSelectedApproach} />
                    ))}
                  </div>
                </div>
              )}



              {/* Flowchart Tab */}
              {activeTab === "flowchart" && (
                <div style={S.panel}>
                  <div style={S.header}>
                    <p style={{ ...S.label, marginBottom: 0 }}>Algorithm Flowchart</p>
                  </div>
                  <div style={S.body}>
                    <FlowchartSVG steps={analysis.flowSteps} />
                    <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                      {[["#3b82f6", "Start/End"], ["#f59e0b", "Decision"], ["rgba(255,255,255,0.07)", "Process"]].map(([c, l]) => (
                        <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                          <span style={{ width: 14, height: 14, borderRadius: 3, background: c, border: "1px solid rgba(255,255,255,0.15)", display: "inline-block" }} />
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Complexity Tab */}
              {activeTab === "complexity" && (
                <div style={S.panel}>
                  <div style={S.header}>
                    <p style={{ ...S.label, marginBottom: 0 }}>Big-O Complexity Analysis</p>
                  </div>
                  <div style={S.body}>
                    <ComplexityChart analysis={analysis} />
                  </div>
                </div>
              )}

              {/* Hints Tab */}
              {activeTab === "hints" && (
                <div style={S.panel}>
                  <div style={S.header}><p style={{ ...S.label, marginBottom: 0 }}>Progressive Hints</p></div>
                  <div style={S.body}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16 }}>
                      Hints are progressive — try to solve between each hint before requesting the next.
                    </p>
                    <HintPanel problem={problem} topic={topic} />
                  </div>
                </div>
              )}

              {/* Similar Tab */}
              {activeTab === "similar" && (
                <div style={S.panel}>
                  <div style={S.header}><p style={{ ...S.label, marginBottom: 0 }}>Similar Problems</p></div>
                  <div style={S.body}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16 }}>
                      Practice more problems with the same pattern and techniques.
                    </p>
                    <SimilarProblems problem={problem} topic={topic} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div style={{ marginTop: 44 }}>
        <h2 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Quick Complexity Reference</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { ds: "Array Access", tc: "O(1)", sc: "O(n)" },
            { ds: "Binary Search", tc: "O(log n)", sc: "O(1)" },
            { ds: "Hash Map", tc: "O(1) avg", sc: "O(n)" },
            { ds: "BST Search", tc: "O(log n) avg", sc: "O(n)" },
            { ds: "Merge Sort", tc: "O(n log n)", sc: "O(n)" },
            { ds: "Quick Sort", tc: "O(n log n) avg", sc: "O(log n)" },
            { ds: "BFS / DFS", tc: "O(V+E)", sc: "O(V)" },
            { ds: "Dijkstra", tc: "O((V+E)log V)", sc: "O(V)" },
            { ds: "DP 0/1 Knapsack", tc: "O(nW)", sc: "O(nW)" },
            { ds: "Heap Push/Pop", tc: "O(log n)", sc: "O(n)" },
            { ds: "Counting Sort", tc: "O(n+k)", sc: "O(k)" },
            { ds: "Floyd-Warshall", tc: "O(V³)", sc: "O(V²)" },
          ].map(r => (
            <div key={r.ds} style={{ ...S.panel, padding: "12px 14px" }}>
              <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 12, margin: "0 0 6px" }}>{r.ds}</p>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "#34d399", fontSize: 11, fontFamily: "monospace" }}>T: {r.tc}</span>
                <span style={{ color: "#60a5fa", fontSize: 11, fontFamily: "monospace" }}>S: {r.sc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

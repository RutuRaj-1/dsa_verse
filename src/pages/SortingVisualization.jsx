import { useState } from "react";
import { Link } from "react-router-dom";

const ALGORITHMS = [
    { name: "Bubble Sort", fn: arr => { const a = [...arr]; const steps = []; for (let i = 0; i < a.length - 1; i++) { for (let j = 0; j < a.length - i - 1; j++) { steps.push({ arr: [...a], cmp: [j, j + 1], swapped: false }); if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; steps.push({ arr: [...a], cmp: [j, j + 1], swapped: true }); } } } steps.push({ arr: [...a], cmp: [], swapped: false }); return steps; }, best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { name: "Selection Sort", fn: arr => { const a = [...arr]; const steps = []; for (let i = 0; i < a.length - 1; i++) { let min = i; for (let j = i + 1; j < a.length; j++) { steps.push({ arr: [...a], cmp: [min, j], swapped: false }); if (a[j] < a[min]) min = j; } if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; steps.push({ arr: [...a], cmp: [i, min], swapped: true }); } } steps.push({ arr: [...a], cmp: [], swapped: false }); return steps; }, best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { name: "Insertion Sort", fn: arr => { const a = [...arr]; const steps = []; for (let i = 1; i < a.length; i++) { let j = i; steps.push({ arr: [...a], cmp: [j, j - 1], swapped: false }); while (j > 0 && a[j] < a[j - 1]) { [a[j], a[j - 1]] = [a[j - 1], a[j]]; steps.push({ arr: [...a], cmp: [j, j - 1], swapped: true }); j--; } } steps.push({ arr: [...a], cmp: [], swapped: false }); return steps; }, best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
];

const THEORY = [
    { title: "Sorting Overview", content: `Sorting arranges elements in a specific order (ascending/descending).\n\nClassification:\n• By comparison: Bubble, Selection, Insertion, Quick, Merge, Heap\n• Non-comparison: Counting Sort, Radix Sort, Bucket Sort (O(n) possible)\n\nStability: A sort is stable if equal elements maintain their relative order.\nStable: Bubble, Insertion, Merge, Counting, Radix\nUnstable: Selection, Quick, Heap\n\nSort Order: Total (all elements compared) vs Partial (only some)\nInternal vs External: Whether all data fits in RAM` },
    { title: "Bubble Sort", content: `Scan pairs, swap if out of order. Each pass bubbles max to end.\nPasses needed: n-1 in worst case\nOptimization: Track if any swap occurred; if none → already sorted (O(n) best)` },
    { title: "Quick Sort", content: `Pivot-based divide & conquer.\nPartition: elements < pivot left, elements > pivot right, pivot in final position.\nChoice of pivot: first, last, median, random\nAverage O(n log n), worst O(n²) when pivot is always min/max\nIn-place, cache-friendly → fastest in practice` },
    { title: "Merge Sort", content: `Divide array in half, recursively sort, merge sorted halves.\nGuaranteed O(n log n) — best for linked lists\nRequires O(n) extra space — main disadvantage\nExternal sort: used when data doesn't fit in memory (merge k sorted files)` },
    { title: "Non-Comparison Sorts", content: `Counting Sort: count occurrences, prefix sum, place in output. O(n+k). Stable. Only for integers.\nRadix Sort: sort by each digit using counting sort as subroutine. O(nk).\nBucket Sort: distribute into buckets, sort each bucket. O(n+k) avg.\nWhen to use: when key range k is small (O(n+k) wins over O(n log n))` },
];

export default function SortingVisualization() {
    const [arr, setArr] = useState([64, 34, 25, 12, 22, 11, 90]);
    const [steps, setSteps] = useState([]);
    const [stepIdx, setStepIdx] = useState(-1);
    const [algo, setAlgo] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [customInput, setCustomInput] = useState("");
    const [openSection, setOpenSection] = useState(null);
    const [activeTab, setActiveTab] = useState("visualizer");
    const [userInput, setUserInput] = useState("");
    const [inputSteps, setInputSteps] = useState([]);

    const currentStep = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;
    const displayArr = currentStep ? currentStep.arr : arr;
    const max = Math.max(...displayArr, 1);

    async function runSort() {
        const s = ALGORITHMS[algo].fn(arr);
        setSteps(s);
        setIsRunning(true);
        for (let i = 0; i < s.length; i++) {
            setStepIdx(i);
            await new Promise(r => setTimeout(r, 250));
        }
        setArr(s[s.length - 1].arr);
        setStepIdx(-1);
        setIsRunning(false);
    }

    function reset() {
        setArr([64, 34, 25, 12, 22, 11, 90]);
        setSteps([]); setStepIdx(-1); setIsRunning(false); setInputSteps([]);
    }

    function applyCustom() {
        const nums = customInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (nums.length) { setArr(nums); setCustomInput(""); setStepIdx(-1); setSteps([]); setInputSteps([]); }
    }

    function processUserInput() {
        const nums = userInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        setArr(nums);
        const sorted = [...nums].sort((a, b) => a - b);
        const steps2 = [
            `Input: [${nums.join(", ")}]`,
            `The algorithm compares adjacent pairs and decides whether to swap`,
            `Bubble Sort passes: up to ${nums.length - 1} passes needed for ${nums.length} elements`,
            `Total comparisons worst case: ${nums.length * (nums.length - 1) / 2} comparisons (n(n-1)/2)`,
            `Sorted result: [${sorted.join(", ")}]`,
            `Largest element (${Math.max(...nums)}) bubbled to position ${nums.length - 1} in first pass`,
        ];
        setInputSteps(steps2);
        setActiveTab("visualizer");
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Sorting Algorithms</h1>
                <p className="page-subtitle">Step-by-step animated sorting with Bubble, Selection, and Insertion Sort</p>
            </div>

            <div className="page-tabs">
                <button className={`tab-btn ${activeTab === "visualizer" ? "active" : ""}`} onClick={() => setActiveTab("visualizer")}>🔭 Visualizer</button>
                <button className={`tab-btn ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>✏️ Try It Yourself</button>
                <button className={`tab-btn ${activeTab === "theory" ? "active" : ""}`} onClick={() => setActiveTab("theory")}>📖 Theory</button>
            </div>

            {activeTab === "visualizer" && (
                <div className="viz-grid">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{
                            background: "rgba(59,130,246,0.08)",
                            borderLeft: "4px solid #3b82f6",
                            borderRadius: "0 14px 14px 0",
                            padding: "18px 24px",
                            marginBottom: 10,
                            fontSize: 15,
                            color: "rgba(255,255,255,0.8)",
                            lineHeight: 1.7,
                            fontStyle: "italic",
                        }}>
                            <span style={{ color: "#60a5fa", fontWeight: 700, marginRight: 8 }}>💡 Intuition:</span>
                            {ALGORITHMS[algo].name} works by comparing elements and reordering them. 
                            {algo === 0 ? " Bubble Sort repeatedly swaps adjacent elements if they are in the wrong order until the largest 'bubbles' to the end." :
                             algo === 1 ? " Selection Sort finds the smallest element and moves it to the front, repeating for each position." :
                             " Insertion Sort builds the sorted array one item at a time by inserting the current element into its correct place."}
                        </div>

                        <div className="viz-panel">
                            <div className="panel-header">
                                <p className="panel-title">Array Bars</p>
                                <span style={{ fontSize: 12, color: isRunning ? "#34d399" : "rgba(255,255,255,0.4)" }}>
                                    {isRunning ? "Sorting..." : "Ready"}
                                </span>
                            </div>
                            <div className="panel-body">
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 200, padding: "0 4px", background: "rgba(0,0,0,0.3)", borderRadius: 10 }}>
                                    {displayArr.map((v, i) => {
                                        const cmp = currentStep?.cmp || [];
                                        let color = "#3b82f6";
                                        if (cmp.includes(i)) color = currentStep?.swapped ? "#34d399" : "#f59e0b";
                                        return (
                                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>{v}</span>
                                                <div style={{ width: "100%", background: color, borderRadius: "3px 3px 0 0", height: `${(v / max) * 160}px`, minHeight: 8, transition: "height 0.15s, background 0.15s" }}></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="log-panel" style={{ height: 250 }}>
                            <div className="log-header">
                                <span style={{ color: "#3b82f6" }}>⚡</span> Sorting Execution Log
                            </div>
                            <div className="log-content thin-scroll">
                                {steps.length === 0 ? (
                                    <div className="log-line" style={{ opacity: 0.4 }}>Select an algorithm and press Start...</div>
                                ) : (
                                    steps.slice(0, stepIdx + 1).map((s, i) => (
                                        <div key={i} className={`log-line ${s.swapped ? "log-success" : ""}`}>
                                            <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 12, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                                            {s.swapped ? `Swap detected! Moving elements at indices ${s.cmp.join(" & ")}` : `Comparing indices ${s.cmp.join(" & ")}... no swap needed.`}
                                        </div>
                                    ))
                                )}
                                {inputSteps.length > 0 && inputSteps.map((s, i) => (
                                    <div key={i} className="log-line log-highlight">
                                        <span style={{ color: "#34d399", marginRight: 12 }}>⚡</span> {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Controls</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <select className="ctrl-input" value={algo} onChange={e => setAlgo(parseInt(e.target.value))} disabled={isRunning}>
                                    {ALGORITHMS.map((a, i) => <option key={i} value={i}>{a.name}</option>)}
                                </select>

                                <div>
                                    <p className="ctrl-label">Complexity</p>
                                    <div style={{ fontSize: 12, marginTop: 4 }}>
                                        <span style={{ color: "#34d399" }}>Best: {ALGORITHMS[algo].best} </span>
                                        <span style={{ color: "#f59e0b" }}>Avg: {ALGORITHMS[algo].avg} </span>
                                        <span style={{ color: "#f87171" }}>Worst: {ALGORITHMS[algo].worst}</span>
                                    </div>
                                </div>

                                <input className="ctrl-input" placeholder="Custom array (e.g. 5,2,8,1)" value={customInput} onChange={e => setCustomInput(e.target.value)} />
                                <button className="btn-secondary" onClick={applyCustom} disabled={!customInput}>Set Custom Array</button>

                                <button className="btn-primary" onClick={runSort} disabled={isRunning}>
                                    {isRunning ? "⏳ Sorting..." : "▶ Start Sort"}
                                </button>
                                <button className="btn-secondary" onClick={reset} disabled={isRunning}>↺ Reset</button>
                            </div>
                        </div>
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Legend</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[{ color: "#3b82f6", label: "Unsorted" }, { color: "#f59e0b", label: "Comparing" }, { color: "#34d399", label: "Swapped" }].map(l => (
                                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 12, height: 12, background: l.color, borderRadius: 2 }}></div>
                                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "input" && (
                <div style={{ maxWidth: 700 }}>
                    <div className="viz-panel">
                        <div className="panel-header"><p className="panel-title">✏️ Try It Yourself</p></div>
                        <div className="panel-body">
                            <label className="ctrl-label">Enter numbers to sort</label>
                            <input className="ctrl-input" placeholder="e.g. 42, 15, 8, 99, 3, 27" value={userInput} onChange={e => setUserInput(e.target.value)} style={{ margin: "8px 0 12px" }} />
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput}>Analyze & Explain →</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card">
                    <div className="panel-header"><p className="panel-title">📖 Sorting Theory</p></div>
                    <div className="theory-accordion">
                        {THEORY.map((s, i) => (
                            <div key={i} className="accordion-item">
                                <button className="accordion-trigger" style={{ fontSize: 18, padding: "24px 28px", fontWeight: 700 }} onClick={() => setOpenSection(openSection === i ? null : i)}>
                                    {s.title} 
                                    <span style={{ color: "#60a5fa", transform: openSection === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>▼</span>
                                </button>
                                {openSection === i && (
                                    <div className="accordion-content" style={{ padding: "0 28px 28px" }}>
                                        <div className="theory-rich-content">
                                            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0, fontSize: "inherit", lineHeight: "inherit" }}>{s.content}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

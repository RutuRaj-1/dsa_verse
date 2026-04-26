import { useState } from "react";
import { Link } from "react-router-dom";

const THEORY = [
    { title: "Binary Search", content: `Requires SORTED array. Divide search space in half each step.\n\nAlgorithm:\n• Set low=0, high=n-1\n• mid = (low+high)/2\n• If arr[mid]==target: Found!\n• If arr[mid]<target: low=mid+1 (search right)\n• If arr[mid]>target: high=mid-1 (search left)\n• Repeat until low>high (not found)\n\nTime: O(log n) — halves search space each iteration\nSpace: O(1) iterative, O(log n) recursive\n\nRecurrence: T(n) = T(n/2) + O(1) → O(log n) by Master Theorem` },
    { title: "Linear Search & Variants", content: `Linear Search: O(n) — scan each element.\nSentinel Search: Place target at arr[n], remove bounds check → slightly faster constant.\nJump Search: Jump by √n steps, then linear in block. O(√n)\nInterpolation Search: Like binary but uses value distribution. O(log log n) avg for uniform data. O(n) worst.\nFibonacci Search: Use Fibonacci numbers to divide array. O(log n) with better cache behavior.` },
    { title: "Indexed Sequential Search", content: `Create an index (sparse) over sorted data.\nIndex: every kth element's value + position\nSearch:\n1. Binary/linear search INDEX to find block\n2. Sequential search within block\nTime: O(log(n/k) + k)\nUsed in: Databases, file systems, B-trees` },
];

export default function SearchVisualization() {
    const [arr, setArr] = useState([2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]);
    const [target, setTarget] = useState("");
    const [highlighted, setHighlighted] = useState({ low: -1, mid: -1, high: -1 });
    const [found, setFound] = useState(null);
    const [log, setLog] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [algo, setAlgo] = useState("binary");
    const [openSection, setOpenSection] = useState(null);
    const [activeTab, setActiveTab] = useState("visualizer");
    const [userInput, setUserInput] = useState("");
    const [searchTarget, setSearchTarget] = useState("");
    const [inputSteps, setInputSteps] = useState([]);

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function binarySearch(t) {
        let low = 0, high = arr.length - 1;
        const newLog = [];
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            setHighlighted({ low, mid, high });
            newLog.push(`low=${low}, high=${high}, mid=${mid} → arr[mid]=${arr[mid]}`);
            setLog([...newLog]);
            await sleep(900);
            if (arr[mid] === t) {
                setFound(mid);
                newLog.push(`✅ Found ${t} at index ${mid}!`);
                setLog([...newLog]);
                return;
            } else if (arr[mid] < t) {
                newLog.push(`  ${arr[mid]} < ${t} → search RIGHT half`);
                low = mid + 1;
            } else {
                newLog.push(`  ${arr[mid]} > ${t} → search LEFT half`);
                high = mid - 1;
            }
            setLog([...newLog]);
        }
        newLog.push(`❌ ${t} not found`);
        setLog([...newLog]);
    }

    async function linearSearch(t) {
        const newLog = [];
        for (let i = 0; i < arr.length; i++) {
            setHighlighted({ low: -1, mid: i, high: -1 });
            newLog.push(`Check arr[${i}]=${arr[i]} ${arr[i] === t ? "→ ✅ FOUND!" : "≠ " + t}`);
            setLog([...newLog]);
            await sleep(700);
            if (arr[i] === t) { setFound(i); return; }
        }
        newLog.push("❌ Not found");
        setLog([...newLog]);
    }

    async function runSearch() {
        const t = parseInt(target);
        if (isNaN(t)) return;
        setIsRunning(true); setHighlighted({ low: -1, mid: -1, high: -1 }); setFound(null); setLog([]);
        if (algo === "binary") await binarySearch(t);
        else await linearSearch(t);
        setHighlighted({ low: -1, mid: -1, high: -1 });
        setIsRunning(false);
    }

    function processUserInput() {
        const nums = userInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        const t = parseInt(searchTarget);
        if (!nums.length) return;
        const sorted = [...nums].sort((a, b) => a - b);
        setArr(sorted);
        const steps = [
            `Array after sorting: [${sorted.join(", ")}] (Binary Search requires sorted array!)`,
            isNaN(t) ? `Enter a target to see the search steps` : `Searching for ${t}:`,
            isNaN(t) ? "" : sorted.includes(t) ? `Target ${t} found in array → Binary search will find it in ≤${Math.ceil(Math.log2(sorted.length))} comparisons` : `Target ${t} not in array → Binary search eliminates half the array each step`,
            `Maximum comparisons needed: ⌈log₂(${sorted.length})⌉ = ${Math.ceil(Math.log2(sorted.length))} comparisons`,
            `Compare to Linear Search: worst case ${sorted.length} comparisons for this array`,
        ].filter(Boolean);
        setInputSteps(steps);
        setActiveTab("visualizer");
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Search Algorithms</h1>
                <p className="page-subtitle">Binary Search, Linear Search, Sentinel, Fibonacci, and Indexed Sequential Search</p>
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
                            background: "rgba(6,182,212,0.08)",
                            borderLeft: "4px solid #06b6d4",
                            borderRadius: "0 14px 14px 0",
                            padding: "18px 24px",
                            marginBottom: 10,
                            fontSize: 15,
                            color: "rgba(255,255,255,0.8)",
                            lineHeight: 1.7,
                            fontStyle: "italic",
                        }}>
                            <span style={{ color: "#22d3ee", fontWeight: 700, marginRight: 8 }}>💡 Intuition:</span>
                            {algo === "binary" ? "Binary Search is a divide-and-conquer algorithm. It works on SORTED arrays by repeatedly halving the search space until the target is found or the search space is empty." :
                             "Linear Search is the simplest search algorithm. It checks every element in the array sequentially until a match is found or the end is reached."}
                        </div>

                        <div className="viz-panel">
                            <div className="panel-header"><p className="panel-title">Search Visualization</p></div>
                            <div className="panel-body">
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "20px" }}>
                                    {arr.map((v, i) => {
                                        const isFound = found === i;
                                        const isHl = highlighted.low === i || highlighted.mid === i || highlighted.high === i;
                                        let bg = "rgba(59,130,246,0.15)", border = "#3b82f6", color = "#f1f5f9";
                                        if (isFound) { bg = "rgba(52,211,153,0.3)"; border = "#34d399"; }
                                        else if (highlighted.mid === i) { bg = "rgba(245,158,11,0.3)"; border = "#f59e0b"; }
                                        else if (i >= highlighted.low && i <= highlighted.high) { bg = "rgba(167,139,250,0.25)"; border = "#a78bfa"; }
                                        return (
                                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                                <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: bg, border: `1.5px solid ${border}`, borderRadius: 8, fontWeight: 700, fontSize: 14, color, transition: "all 0.3s" }}>{v}</div>
                                                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>[{i}]</span>
                                                {highlighted.low === i && <span style={{ fontSize: 9, color: "#a78bfa", fontWeight: 700 }}>low</span>}
                                                {highlighted.mid === i && <span style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700 }}>mid</span>}
                                                {highlighted.high === i && <span style={{ fontSize: 9, color: "#a78bfa", fontWeight: 700 }}>high</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="log-panel" style={{ height: 250 }}>
                            <div className="log-header">
                                <span style={{ color: "#22d3ee" }}>⚡</span> Searching Execution Log
                            </div>
                            <div className="log-content thin-scroll">
                                {log.length === 0 ? (
                                    <div className="log-line" style={{ opacity: 0.4 }}>Enter a target and press Search...</div>
                                ) : (
                                    log.map((l, i) => (
                                        <div key={i} className={`log-line ${l.includes("✅") ? "log-success" : l.includes("❌") ? "log-error" : "log-highlight"}`}>
                                            <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 12, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                                            {l}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Search</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <select className="ctrl-input" value={algo} onChange={e => setAlgo(e.target.value)} disabled={isRunning}>
                                    <option value="binary">Binary Search — O(log n)</option>
                                    <option value="linear">Linear Search — O(n)</option>
                                </select>
                                <input className="ctrl-input" type="number" placeholder="Target value" value={target} onChange={e => setTarget(e.target.value)} />
                                <button className="btn-primary" onClick={runSearch} disabled={!target || isRunning}>{isRunning ? "Searching..." : "🔍 Search"}</button>
                                <button className="btn-secondary" onClick={() => { setHighlighted({ low: -1, mid: -1, high: -1 }); setFound(null); setLog([]); }}>Clear</button>
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
                            <label className="ctrl-label">Enter numbers (will be sorted for Binary Search)</label>
                            <input className="ctrl-input" placeholder="e.g. 40, 10, 55, 3, 88, 22" value={userInput} onChange={e => setUserInput(e.target.value)} style={{ margin: "8px 0 8px" }} />
                            <label className="ctrl-label">Target to search (optional)</label>
                            <input className="ctrl-input" type="number" placeholder="e.g. 22" value={searchTarget} onChange={e => setSearchTarget(e.target.value)} style={{ margin: "8px 0 12px" }} />
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput}>Analyze →</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card">
                    <div className="panel-header"><p className="panel-title">📖 Search Theory</p></div>
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

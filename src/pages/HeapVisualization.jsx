import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/* ===================== HEAP DATA STRUCTURE ===================== */
function buildMaxHeap(arr) {
    const h = [...arr];
    for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) {
        heapifyDown(h, i, h.length, true);
    }
    return h;
}

function heapifyDown(arr, i, n, isMax = true) {
    let target = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (isMax) {
        if (l < n && arr[l] > arr[target]) target = l;
        if (r < n && arr[r] > arr[target]) target = r;
    } else {
        if (l < n && arr[l] < arr[target]) target = l;
        if (r < n && arr[r] < arr[target]) target = r;
    }
    if (target !== i) {
        [arr[i], arr[target]] = [arr[target], arr[i]];
        heapifyDown(arr, target, n, isMax);
    }
}

function buildMinHeap(arr) {
    const h = [...arr];
    for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) {
        heapifyDown(h, i, h.length, false);
    }
    return h;
}

/* ===================== TREE DRAWING ===================== */
function getNodePos(idx, total, W = 600, H = 300) {
    const levels = Math.ceil(Math.log2(total + 1));
    const level = Math.floor(Math.log2(idx + 1));
    const posInLevel = idx - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const x = W * (posInLevel + 0.5) / nodesInLevel;
    const y = 50 + level * (H / (levels + 0.5));
    return { x, y };
}

function HeapTree({ heap, highlight, comparing }) {
    if (!heap.length) return <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "60px" }}>Heap is empty</div>;
    const W = 600, H = 240;
    const positions = heap.map((_, i) => getNodePos(i, heap.length, W, H));
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxHeight: 280 }}>
            {heap.map((_, i) => {
                const l = 2 * i + 1, r = 2 * i + 2;
                const p = positions[i];
                return [
                    l < heap.length && (
                        <line key={`le${i}`} x1={p.x} y1={p.y} x2={positions[l].x} y2={positions[l].y}
                            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    ),
                    r < heap.length && (
                        <line key={`re${i}`} x1={p.x} y1={p.y} x2={positions[r].x} y2={positions[r].y}
                            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    )
                ];
            })}
            {heap.map((val, i) => {
                const { x, y } = positions[i];
                const hl = highlight === i;
                const comp = comparing && comparing.includes(i);
                
                let fill = i === 0 ? "rgba(251,113,133,0.3)" : "rgba(59,130,246,0.2)";
                let stroke = i === 0 ? "#fb7185" : "#3b82f6";
                if (hl) { fill = "#3b82f6"; stroke = "#60a5fa"; }
                else if (comp) { fill = "rgba(250, 204, 21, 0.4)"; stroke = "#facc15"; }

                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r={22} fill={fill} stroke={stroke} strokeWidth={hl || comp ? 2.5 : 1.5} />
                        <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight="bold"
                            fill={hl || comp ? "white" : "#f1f5f9"}>{val}</text>
                    </g>
                );
            })}
        </svg>
    );
}

const HEAP_THEORY = [
    {
        title: "1. Fundamentals of Heaps",
        content: (
            <div className="theory-rich-content">
                <p>A <strong>Heap</strong> is a specialized tree-based data structure that satisfies the <strong>Heap Property</strong>. It is almost always implemented as a <strong>Complete Binary Tree</strong>, which means all levels are fully filled except possibly the last, which is filled from left to right.</p>
                <h4>The Heap Property:</h4>
                <ul>
                    <li><strong>Max-Heap:</strong> For any given node I, the value of I is greater than or equal to the values of its children. The largest element is at the root.</li>
                    <li><strong>Min-Heap:</strong> For any given node I, the value of I is less than or equal to the values of its children. The smallest element is at the root.</li>
                </ul>
                <p>Heaps are mathematically represented as arrays for memory efficiency. For an element at index <code>i</code>:</p>
                <div className="theory-formula">
                    Left Child: (2 * i) + 1<br/>
                    Right Child: (2 * i) + 2<br/>
                    Parent: floor((i - 1) / 2)
                </div>
            </div>
        )
    },
    {
        title: "2. Core Operations & Complexity",
        content: (
            <div className="theory-rich-content">
                <p>The efficiency of a heap comes from its logarithmic height (log N), allowing for fast updates and removals.</p>
                <table className="theory-table">
                    <thead>
                        <tr><th>Operation</th><th>Time Complexity</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><strong>Insert</strong></td><td>O(log N)</td><td>Add at end, then 'Bubble Up' (Sift-Up)</td></tr>
                        <tr><td><strong>Extract Max/Min</strong></td><td>O(log N)</td><td>Swap root with last, remove last, then 'Heapify Down' (Sift-Down)</td></tr>
                        <tr><td><strong>Peek</strong></td><td>O(1)</td><td>Access the element at index 0</td></tr>
                        <tr><td><strong>Build Heap</strong></td><td>O(N)</td><td>Bottom-up heapification of an unordered array</td></tr>
                        <tr><td><strong>Heap Sort</strong></td><td>O(N log N)</td><td>Repeatedly extract root to build a sorted array</td></tr>
                    </tbody>
                </table>
                <h4>Detailed Algorithms:</h4>
                <ul>
                    <li><strong>Sift-Up (Bubble Up):</strong> Used during insertion. We compare the new element with its parent. If the heap property is violated, we swap and recurse upwards.</li>
                    <li><strong>Sift-Down (Heapify):</strong> Used during removal. We swap the root with the last child, remove the old root, then compare the new root with its largest/smallest child and swap downwards.</li>
                </ul>
            </div>
        )
    },
    {
        title: "3. Real-World Applications",
        content: (
            <div className="theory-rich-content">
                <p>Heaps are fundamental to many advanced algorithms and system components:</p>
                <ul>
                    <li><strong>Priority Queues:</strong> Heaps are the standard implementation for priority queues, used in OS task scheduling and interrupt handling.</li>
                    <li><strong>Graph Algorithms:</strong> Dijkstra's Shortest Path and Prim's MST use Min-Heaps to efficiently pick the next node with the smallest weight.</li>
                    <li><strong>K-Way Merge:</strong> Merging multiple sorted streams (e.g., external sorting in databases).</li>
                    <li><strong>Selection Algorithms:</strong> Finding the K-th smallest or largest element in an unsorted array without sorting the entire array.</li>
                    <li><strong>Median Maintenance:</strong> Keeping track of the running median with two heaps (one max-heap, one min-heap).</li>
                    <li><strong>Huffman Coding:</strong> Building the optimal prefix code tree.</li>
                </ul>
            </div>
        )
    }
];



export default function HeapVisualization() {
    const [heap, setHeap] = useState([90, 75, 80, 55, 65, 60, 70, 20, 30, 40]);
    const [heapType, setHeapType] = useState("max");
    const [inputVal, setInputVal] = useState("");
    const [batchInput, setBatchInput] = useState("");
    
    const [highlight, setHighlight] = useState(null);
    const [comparing, setComparing] = useState([]);
    
    const [openSection, setOpenSection] = useState(null);
    const [activeTab, setActiveTab] = useState("visualizer");
    const [isRunning, setIsRunning] = useState(false);

    const [log, setLog] = useState(["Execution log initialized. Select an operation."]);
    const logEndRef = useRef(null);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    const addToLog = (m) => setLog(p => [...p, m]);
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function insert() {
        const val = parseInt(inputVal);
        if (isNaN(val)) return;
        setInputVal("");
        setIsRunning(true);
        addToLog(`⚡ Starting insertion of ${val} into ${heapType.toUpperCase()}-Heap`);

        const h = [...heap, val];
        setHeap([...h]);
        let i = h.length - 1;
        setHighlight(i);
        addToLog(`Added ${val} at the end of the heap (index ${i})`);
        await sleep(800);

        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            setComparing([i, parent]);
            addToLog(`Comparing child ${h[i]} (idx ${i}) with parent ${h[parent]} (idx ${parent})`);
            await sleep(1000);

            const cond = heapType === "max" ? h[i] > h[parent] : h[i] < h[parent];
            if (cond) {
                addToLog(`${h[i]} ${heapType === "max" ? ">" : "<"} ${h[parent]}, so we swap (Bubble Up)`);
                [h[i], h[parent]] = [h[parent], h[i]];
                setHeap([...h]);
                i = parent;
                setHighlight(i);
                await sleep(800);
            } else {
                addToLog(`Heap property satisfied. No swap needed.`);
                break;
            }
        }
        setHighlight(null);
        setComparing([]);
        addToLog(`✅ Insertion of ${val} complete.`);
        setIsRunning(false);
    }

    async function deleteRoot() {
        if (!heap.length) return;
        setIsRunning(true);
        const root = heap[0];
        addToLog(`⚡ Starting deletion of root (${root})`);
        
        if (heap.length === 1) {
            setHeap([]);
            addToLog(`✅ Heap is now empty.`);
            setIsRunning(false);
            return;
        }

        const h = [...heap];
        const last = h.pop();
        h[0] = last;
        setHeap([...h]);
        setHighlight(0);
        addToLog(`Removed root ${root}. Moved last element ${last} to root.`);
        await sleep(1000);

        let i = 0;
        const n = h.length;

        while (true) {
            let target = i;
            const l = 2 * i + 1;
            const r = 2 * i + 2;

            setComparing([i, l < n ? l : -1, r < n ? r : -1]);
            addToLog(`Checking node ${h[i]} with its children`);
            await sleep(800);

            if (heapType === "max") {
                if (l < n && h[l] > h[target]) target = l;
                if (r < n && h[r] > h[target]) target = r;
            } else {
                if (l < n && h[l] < h[target]) target = l;
                if (r < n && h[r] < h[target]) target = r;
            }

            if (target !== i) {
                addToLog(`Swapping ${h[i]} with ${h[target]} (Heapify Down)`);
                [h[i], h[target]] = [h[target], h[i]];
                setHeap([...h]);
                i = target;
                setHighlight(i);
                await sleep(800);
            } else {
                addToLog(`Heap property satisfied. No swap needed.`);
                break;
            }
        }

        setHighlight(null);
        setComparing([]);
        addToLog(`✅ Deletion complete.`);
        setIsRunning(false);
    }

    function buildFromInput() {
        const nums = batchInput.split(/[s,]+/).map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        const built = heapType === "max" ? buildMaxHeap(nums) : buildMinHeap(nums);
        setHeap(built);
        setBatchInput("");
        addToLog(`✅ Built ${heapType}-heap from input: [${built.join(", ")}]`);
    }

    function reset() {
        const defaults = [90, 75, 80, 55, 65, 60, 70, 20, 30, 40];
        setHeap(heapType === "max" ? buildMaxHeap(defaults) : buildMinHeap(defaults));
        addToLog(`Reset to default ${heapType}-heap.`);
    }

    function switchType(t) {
        setHeapType(t);
        setHeap(t === "max" ? buildMaxHeap(heap) : buildMinHeap(heap));
        addToLog(`✅ Converted heap to ${t}-heap`);
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Heap Data Structure</h1>
                <p className="page-subtitle">Min-Heap & Max-Heap with step-by-step visualizations of bubble up and heapify down</p>
            </div>

            <div className="page-tabs">
                <button className={`tab-btn ${activeTab === "visualizer" ? "active" : ""}`} onClick={() => setActiveTab("visualizer")}>🔭 Visualizer</button>
                <button className={`tab-btn ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>✏️ Try It Yourself</button>
                <button className={`tab-btn ${activeTab === "theory" ? "active" : ""}`} onClick={() => setActiveTab("theory")}>📖 Theory</button>
            </div>

            {activeTab === "visualizer" && (
                <div className="viz-grid">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Intuition Section */}
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
                            {heapType === "max" 
                                ? "In a Max-Heap, every parent node is greater than or equal to its children. This makes the root always the maximum value, ideal for priority scheduling where highest value goes first."
                                : "In a Min-Heap, every parent node is less than or equal to its children. The root is always the minimum value, essential for algorithms like Dijkstra's or Prim's."
                            }
                        </div>

                        <div className="viz-panel">
                            <div className="panel-header">
                                <p className="panel-title">{heapType === "max" ? "🔴 Max-Heap" : "🔵 Min-Heap"} — Array Size: {heap.length}</p>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button className={`tab-btn ${heapType === "max" ? "active" : ""}`} onClick={() => switchType("max")} style={{ padding: "4px 10px", fontSize: 12 }}>Max</button>
                                    <button className={`tab-btn ${heapType === "min" ? "active" : ""}`} onClick={() => switchType("min")} style={{ padding: "4px 10px", fontSize: 12 }}>Min</button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <div className="viz-canvas">
                                    <HeapTree heap={heap} highlight={highlight} comparing={comparing} />
                                </div>
                                <div style={{ marginTop: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 14px" }}>
                                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 6px", fontWeight: 600 }}>ARRAY REPRESENTATION</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {heap.map((v, i) => {
                                            const isHighlight = highlight === i;
                                            const isComp = comparing.includes(i);
                                            return (
                                                <span key={i} style={{
                                                    background: isHighlight ? "#3b82f6" : isComp ? "rgba(250, 204, 21, 0.4)" : i === 0 ? "rgba(251,113,133,0.2)" : "rgba(59,130,246,0.15)",
                                                    border: `1px solid ${isHighlight ? "#60a5fa" : isComp ? "#facc15" : i === 0 ? "#fb7185" : "#3b82f6"}`,
                                                    borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 700,
                                                    color: isHighlight || isComp ? "#fff" : i === 0 ? "#fb7185" : "#60a5fa"
                                                }}>
                                                    [{i}]={v}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permanent Execution Log below Visualizer */}
                        <div className="log-panel" style={{ height: 250 }}>
                            <div className="log-header">
                                <span style={{ color: "#3b82f6" }}>⚡</span> Execution Log
                            </div>
                            <div className="log-content thin-scroll">
                                {log.map((l, i) => {
                                    let className = "log-line";
                                    if (l.includes("✅")) className += " log-success";
                                    else if (l.includes("❌") || l.includes("⚠️")) className += " log-error";
                                    else if (l.includes("⚡")) className += " log-highlight";
                                    return <div key={i} className={className}>{l}</div>;
                                })}
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Operations</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div className="ctrl-group">
                                    <label className="ctrl-label">Insert Value</label>
                                    <input className="ctrl-input" type="number" placeholder="Enter number" value={inputVal}
                                        onChange={e => setInputVal(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && insert()} disabled={isRunning} />
                                    <button className="btn-primary" onClick={insert} disabled={!inputVal || isRunning}>+ Insert Step-by-Step</button>
                                </div>
                                <div className="ctrl-group">
                                    <button className="btn-danger" onClick={deleteRoot} disabled={!heap.length || isRunning}>
                                        Remove {heapType === "max" ? "Max" : "Min"} (Root)
                                    </button>
                                </div>
                                <div className="ctrl-group">
                                    <label className="ctrl-label">Build from Numbers</label>
                                    <input className="ctrl-input" placeholder="e.g. 5, 3, 8, 1, 9" value={batchInput}
                                        onChange={e => setBatchInput(e.target.value)} disabled={isRunning} />
                                    <button className="btn-secondary" onClick={buildFromInput} disabled={isRunning}>⚡ Build Heap Instantly</button>
                                </div>
                                <button className="btn-secondary" onClick={reset} disabled={isRunning}>↺ Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "input" && (
                <div style={{ maxWidth: 700 }}>
                    <div className="viz-panel">
                        <div className="panel-header"><p className="panel-title">✏️ Try It Yourself — Step-by-Step Explanation</p></div>
                        <div className="panel-body">
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16 }}>
                                Switch back to Visualizer and use "Insert Step-by-Step" or "Remove Root" to see the visual Bubble Up and Heapify Down operations trace the comparisons live in the log.
                            </p>
                            <label className="ctrl-label">Build Your Own Custom Heap</label>
                            <input className="ctrl-input" placeholder="e.g. 4, 10, 3, 5, 1" value={batchInput}
                                onChange={e => setBatchInput(e.target.value)} style={{ margin: "8px 0" }} />
                            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                <button className="btn-primary" onClick={() => {
                                    buildFromInput();
                                    setActiveTab("visualizer");
                                }}>
                                    Build & View →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card" style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Complete Heap Theory</p></div>
                    <div className="theory-accordion">
                        {HEAP_THEORY.map((s, i) => (
                            <div key={i} className="accordion-item">
                                <button className="accordion-trigger" style={{ fontSize: 18, padding: "24px 28px", fontWeight: 700 }} onClick={() => setOpenSection(openSection === i ? null : i)}>
                                    {s.title} 
                                    <span style={{ color: "#60a5fa", transform: openSection === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>▼</span>
                                </button>
                                {openSection === i && (
                                    <div className="accordion-content" style={{ padding: "0 28px 28px" }}>
                                        <div className="theory-rich-content">
                                            {s.content}
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

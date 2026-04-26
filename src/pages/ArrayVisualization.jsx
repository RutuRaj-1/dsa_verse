import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ARRAY_THEORY = [
    {
        title: "What is an Array?",
        content: (
            <div className="theory-rich-content">
                <p>An array is the simplest and most widely used data structure — a collection of elements stored at contiguous memory locations.</p>
                <h4>Key Properties:</h4>
                <ul>
                    <li>Fixed size (static) or dynamic (e.g., ArrayList, Python list)</li>
                    <li>Elements accessed by index in <strong>O(1)</strong> time</li>
                    <li>All elements are of the same type</li>
                    <li>Memory layout: Base address + index × element_size</li>
                </ul>
                <div className="theory-formula">
                    Formula: Address of arr[i] = Base_Address + i × Size_of_element<br />
                    For 2D arrays (row-major): arr[i][j] = Base + (i × n + j) × Size
                </div>
            </div>
        )
    },
    {
        title: "Array Operations & Complexity",
        content: (
            <div className="theory-rich-content">
                <table className="theory-table">
                    <thead>
                        <tr><th>Operation</th><th>Time</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Access arr[i]</td><td>O(1)</td><td>Direct index calculation</td></tr>
                        <tr><td>Search (unsorted)</td><td>O(n)</td><td>Linear search</td></tr>
                        <tr><td>Search (sorted)</td><td>O(log n)</td><td>Binary search</td></tr>
                        <tr><td>Insertion at end</td><td>O(1) amort.</td><td>Dynamic array</td></tr>
                        <tr><td>Insertion at i</td><td>O(n)</td><td>Shift elements right</td></tr>
                        <tr><td>Deletion at i</td><td>O(n)</td><td>Shift elements left</td></tr>
                        <tr><td>Traversal</td><td>O(n)</td><td>Visit all elements</td></tr>
                    </tbody>
                </table>
                <p style={{ marginTop: 12 }}><strong>Space Complexity:</strong> O(n) for n elements</p>
            </div>
        )
    },
    {
        title: "Multidimensional Arrays",
        content: (
            <div className="theory-rich-content">
                <h4>2D Array (Matrix representation):</h4>
                <ul>
                    <li><strong>Row-Major Order:</strong> Elements stored row by row (C, Java)<br/>
                        Address: Base + (i*n + j) * size</li>
                    <li><strong>Column-Major Order:</strong> Elements stored column by column (FORTRAN)<br/>
                        Address: Base + (j*m + i) * size</li>
                </ul>
                <h4>Applications of 2D Arrays:</h4>
                <ul>
                    <li>Matrix representations</li>
                    <li>Image pixel storage</li>
                    <li>Dynamic programming tables</li>
                    <li>Graph adjacency matrix</li>
                </ul>
                <h4>n-Dimensional Arrays:</h4>
                <p>For 3D: arr[i][j][k] → address = Base + (i*d2*d3 + j*d3 + k) * size</p>
            </div>
        )
    },
    {
        title: "Sparse Matrix",
        content: (
            <div className="theory-rich-content">
                <p>A matrix is sparse when most elements are zero. Storing all elements wastes space.</p>
                <h4>Efficient Representations:</h4>
                <ol>
                    <li><strong>Triplet/COO Format:</strong> Store only (row, col, value) for non-zero elements<br/>
                        Space: O(3 × non-zero elements) instead of O(m×n)</li>
                    <li><strong>Compressed Row Storage (CSR):</strong> 3 arrays — values, col_indices, row_pointers</li>
                </ol>
                <h4>Sparse Matrix Operations:</h4>
                <ul>
                    <li>Addition: O(t1 + t2) where t1, t2 = non-zero count</li>
                    <li>Transpose: Simple and Fast Transpose O(non-zeros)</li>
                    <li>Multiplication: Only process non-zero elements</li>
                </ul>
                <p><strong>Space Tradeoff:</strong> If density &lt; 1/3, sparse representation wins.</p>
            </div>
        )
    },
    {
        title: "Polynomial using Arrays",
        content: (
            <div className="theory-rich-content">
                <p>Polynomials like P(x) = 3x⁴ + 2x² + 5 can be stored as arrays where index = power.</p>
                <div className="theory-formula">Array representation: [5, 0, 2, 0, 3]  (coefficients, index = power)</div>
                <h4>Polynomial Addition:</h4>
                <ul>
                    <li>Have two arrays A[] and B[]</li>
                    <li>Result[i] = A[i] + B[i] for each power i</li>
                    <li>Time: O(max(degree1, degree2))</li>
                </ul>
                <h4>Polynomial Multiplication:</h4>
                <ul>
                    <li>Result[i+j] += A[i] × B[j]</li>
                    <li>Time: O(degree1 × degree2)</li>
                </ul>
                <p>For sparse polynomials: Use (coefficient, power) pairs instead.</p>
            </div>
        )
    }
];

function ArrayBox({ value, index, state }) {
    let bg = "rgba(59,130,246,0.15)";
    let border = "#3b82f6";
    let scale = "scale(1)";
    if (state === "current") { bg = "rgba(99,102,241,0.4)"; border = "#818cf8"; scale = "scale(1.08)"; }
    if (state === "compare") { bg = "rgba(245,158,11,0.35)"; border = "#fbbf24"; scale = "scale(1.05)"; }
    if (state === "found") { bg = "rgba(52,211,153,0.35)"; border = "#34d399"; scale = "scale(1.12)"; }
    
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
                width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center",
                background: bg, border: `2px solid ${border}`, borderRadius: 10,
                fontWeight: 800, fontSize: 18, color: "#f1f5f9",
                transform: scale, transition: "all 0.3s", cursor: "default",
                boxShadow: state !== "normal" ? `0 0 15px ${border}80` : "none"
            }}>{value}</div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontWeight: 600 }}>[{index}]</span>
        </div>
    );
}

export default function ArrayVisualization() {
    const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [compareIndex, setCompareIndex] = useState(-1);
    const [foundIndex, setFoundIndex] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    
    const [newVal, setNewVal] = useState("");
    
    const [searchAlgo, setSearchAlgo] = useState("linear");
    const [searchVal, setSearchVal] = useState("");
    
    const [sortAlgo, setSortAlgo] = useState("bubble");
    
    const [searchLog, setSearchLog] = useState([
        "Execution log initialized.",
        "Select an operation to view its step-by-step execution here."
    ]);
    const [openSection, setOpenSection] = useState(null);
    const [activeTab, setActiveTab] = useState("visualizer");
    const [userInput, setUserInput] = useState("");
    const [inputSteps, setInputSteps] = useState([]);
    
    const logEndRef = useRef(null);

    // Auto-scroll execution log
    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchLog]);

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const addToLog = (msg) => {
        setSearchLog(prev => [...prev, msg]);
    };

    // SEARCH ALGORITHMS
    async function runSearch() {
        const target = parseInt(searchVal);
        if (isNaN(target)) return;
        setIsRunning(true); setFoundIndex(-1); 
        setSearchLog([`Starting ${searchAlgo === 'linear' ? 'Linear' : 'Binary'} Search for ${target}...`]);
        
        if (searchAlgo === "linear") {
            await linearSearch(target);
        } else {
            await binarySearch(target);
        }
    }

    async function linearSearch(target) {
        for (let i = 0; i < array.length; i++) {
            setCurrentIndex(i);
            addToLog(`Step ${i + 1}: Checking array[${i}] = ${array[i]}`);
            await sleep(800);
            if (array[i] === target) {
                setFoundIndex(i); setCurrentIndex(-1); setIsRunning(false);
                addToLog(`✅ SUCCESS: Found ${target} at index ${i}!`);
                return;
            } else {
                addToLog(`   → ${array[i]} ≠ ${target}, continuing to next element.`);
            }
        }
        addToLog(`❌ NOT FOUND: ${target} is not in the array after checking all ${array.length} elements.`);
        setCurrentIndex(-1); setIsRunning(false);
    }

    async function binarySearch(target) {
        // First check if array is sorted
        const isSorted = array.every((val, i, arr) => !i || (val >= arr[i - 1]));
        if (!isSorted) {
            addToLog("⚠️ ERROR: Binary Search requires a sorted array. Please sort the array first!");
            setIsRunning(false);
            return;
        }

        let left = 0;
        let right = array.length - 1;
        let step = 1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            setCurrentIndex(mid);
            addToLog(`Step ${step++}: Search space [left:${left}, right:${right}]. Mid is at index ${mid}.`);
            addToLog(`   → Checking array[${mid}] = ${array[mid]}`);
            
            await sleep(1000);

            if (array[mid] === target) {
                setFoundIndex(mid); setCurrentIndex(-1); setIsRunning(false);
                addToLog(`✅ SUCCESS: Found ${target} at index ${mid}!`);
                return;
            } else if (array[mid] < target) {
                addToLog(`   → ${array[mid]} < ${target}, searching right half.`);
                left = mid + 1;
            } else {
                addToLog(`   → ${array[mid]} > ${target}, searching left half.`);
                right = mid - 1;
            }
            await sleep(500);
        }
        addToLog(`❌ NOT FOUND: ${target} is not in the array (search space exhausted).`);
        setCurrentIndex(-1); setIsRunning(false);
    }

    // SORT ALGORITHMS
    async function runSort() {
        setIsRunning(true); setFoundIndex(-1); 
        setSearchLog([`Starting ${sortAlgo.charAt(0).toUpperCase() + sortAlgo.slice(1)} Sort on [${array.join(", ")}]`]);
        
        if (sortAlgo === "bubble") await bubbleSort();
        else if (sortAlgo === "selection") await selectionSort();
        else if (sortAlgo === "insertion") await insertionSort();
    }

    async function bubbleSort() {
        const arr = [...array];
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            addToLog(`--- Pass ${i + 1} ---`);
            for (let j = 0; j < n - i - 1; j++) {
                setCurrentIndex(j); setCompareIndex(j + 1);
                addToLog(`Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`);
                await sleep(700);
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    addToLog(`  → Swapped! Array becomes: [${arr.join(", ")}]`);
                    await sleep(400);
                }
            }
        }
        setCurrentIndex(-1); setCompareIndex(-1); setIsRunning(false);
        addToLog(`✅ Sort Complete! Final Array: [${arr.join(", ")}]`);
    }

    async function selectionSort() {
        const arr = [...array];
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            addToLog(`--- Pass ${i + 1} ---`);
            let minIdx = i;
            setCurrentIndex(minIdx);
            for (let j = i + 1; j < n; j++) {
                setCompareIndex(j);
                addToLog(`Looking for minimum. Comparing current min (${arr[minIdx]}) with arr[${j}]=${arr[j]}`);
                await sleep(600);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    setCurrentIndex(minIdx);
                    addToLog(`  → Found new minimum: ${arr[minIdx]} at index ${minIdx}`);
                }
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                setArray([...arr]);
                addToLog(`  → Swapped arr[${i}] and arr[${minIdx}]. Array: [${arr.join(", ")}]`);
                await sleep(400);
            } else {
                addToLog(`  → No swap needed. ${arr[i]} is already in place.`);
            }
        }
        setCurrentIndex(-1); setCompareIndex(-1); setIsRunning(false);
        addToLog(`✅ Sort Complete! Final Array: [${arr.join(", ")}]`);
    }

    async function insertionSort() {
        const arr = [...array];
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            setCurrentIndex(i);
            addToLog(`--- Pass ${i} ---`);
            addToLog(`Inserting ${key} into the sorted portion [0...${i-1}]`);
            await sleep(600);
            
            while (j >= 0 && arr[j] > key) {
                setCompareIndex(j);
                addToLog(`  → ${arr[j]} > ${key}, shifting ${arr[j]} to index ${j+1}`);
                arr[j + 1] = arr[j];
                setArray([...arr]);
                await sleep(500);
                j = j - 1;
            }
            arr[j + 1] = key;
            setArray([...arr]);
            addToLog(`  → Placed ${key} at index ${j+1}. Array: [${arr.join(", ")}]`);
            await sleep(400);
        }
        setCurrentIndex(-1); setCompareIndex(-1); setIsRunning(false);
        addToLog(`✅ Sort Complete! Final Array: [${arr.join(", ")}]`);
    }

    function addElement() {
        const v = parseInt(newVal);
        if (!isNaN(v)) { 
            setArray(prev => [...prev, v]); 
            setNewVal(""); 
            addToLog(`Added element ${v} to the array.`);
        }
    }

    function removeElement(i) {
        if (isRunning) return;
        const removed = array[i];
        setArray(prev => prev.filter((_, idx) => idx !== i));
        addToLog(`Removed element ${removed} at index ${i}.`);
    }

    function reset() {
        setArray([64, 34, 25, 12, 22, 11, 90]); 
        setCurrentIndex(-1);
        setCompareIndex(-1); 
        setFoundIndex(-1); 
        setSearchLog(["Execution log initialized.", "Array reset to default values."]); 
        setIsRunning(false);
    }

    function processUserInput() {
        const nums = userInput.split(/[s,]+/).map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        setArray(nums);
        const steps = [
            `You entered ${nums.length} numbers: [${nums.join(", ")}]`,
            `These are stored in contiguous memory slots from index 0 to ${nums.length - 1}`,
            `Access time: O(1) for any element — arr[i] directly`,
            `To search for a value: scan from left (O(n)) or binary search if sorted (O(log n))`,
            `Largest element: ${Math.max(...nums)} at index ${nums.indexOf(Math.max(...nums))}`,
            `Smallest element: ${Math.min(...nums)} at index ${nums.indexOf(Math.min(...nums))}`,
        ];
        setInputSteps(steps);
        setActiveTab("visualizer");
        setSearchLog([`Loaded custom array: [${nums.join(", ")}]`]);
    }

    function getState(i) {
        if (i === foundIndex) return "found";
        if (i === currentIndex) return "current";
        if (i === compareIndex) return "compare";
        return "normal";
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Arrays</h1>
                <p className="page-subtitle">Array operations, searching, sorting, sparse matrix, and polynomial representation</p>
            </div>

            <div className="page-tabs">
                <button className={`tab-btn ${activeTab === "visualizer" ? "active" : ""}`} onClick={() => setActiveTab("visualizer")}>🔭 Visualizer</button>
                <button className={`tab-btn ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>✏️ Try It Yourself</button>
                <button className={`tab-btn ${activeTab === "theory" ? "active" : ""}`} onClick={() => setActiveTab("theory")}>📖 Theory</button>
            </div>

            {activeTab === "visualizer" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                                Arrays are the most fundamental data structure, storing elements in <strong>contiguous memory</strong>. This allows for O(1) random access via index, but makes resizing and insertions in the middle expensive (O(n)) due to the need for shifting elements.
                            </div>

                            <div className="viz-panel">
                                <div className="panel-header">
                                    <p className="panel-title">Array Visualization</p>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Length: {array.length}</span>
                                </div>
                                <div className="panel-body">
                                    <div style={{ 
                                        display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", 
                                        background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "40px 20px", minHeight: 180,
                                        border: "1px solid rgba(255,255,255,0.05)", boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)"
                                    }}>
                                        {array.map((v, i) => (
                                            <div key={i} onClick={() => removeElement(i)} title="Click to remove" style={{ cursor: isRunning ? "default" : "pointer" }}>
                                                <ArrayBox value={v} index={i} state={getState(i)} />
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16, fontWeight: 500 }}>
                                        {isRunning ? "Animation running... Please wait." : "Click on any element to remove it from the array"}
                                    </p>
                                </div>
                            </div>

                            {/* Permanent Execution Log below Visualizer */}
                            <div className="log-panel" style={{ height: 250 }}>
                                <div className="log-header">
                                    <span style={{ color: "#3b82f6" }}>⚡</span> Execution Log
                                </div>
                                <div className="log-content thin-scroll">
                                    {searchLog.map((l, i) => {
                                        let className = "log-line";
                                        if (l.includes("✅")) className += " log-success";
                                        else if (l.includes("❌") || l.includes("⚠️")) className += " log-error";
                                        else if (l.includes("--- Pass")) className += " log-highlight";
                                        return <div key={i} className={className}>{l}</div>;
                                    })}
                                    <div ref={logEndRef} />
                                </div>
                            </div>
                            
                            <div className="ctrl-panel">
                                <div className="panel-header"><p className="panel-title">Legend</p></div>
                                <div className="panel-body" style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: "16px 24px" }}>
                                    {[
                                        { color: "#818cf8", label: "Current (Scanning/Pivot)" },
                                        { color: "#fbbf24", label: "Comparing / Min" },
                                        { color: "#34d399", label: "Found / Sorted" },
                                        { color: "#3b82f6", label: "Normal" },
                                    ].map(l => (
                                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 18, height: 18, borderRadius: 4, background: l.color, boxShadow: `0 0 10px ${l.color}80` }}></div>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{l.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="ctrl-panel">
                                <div className="panel-header"><p className="panel-title">Search Algorithm</p></div>
                                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div className="ctrl-group">
                                        <select className="ctrl-select" value={searchAlgo} onChange={e => setSearchAlgo(e.target.value)} disabled={isRunning}>
                                            <option value="linear">Linear Search (O(n))</option>
                                            <option value="binary">Binary Search (O(log n))</option>
                                        </select>
                                    </div>
                                    <div className="ctrl-group">
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Search target..." value={searchVal} onChange={e => setSearchVal(e.target.value)} style={{ flex: 1 }} />
                                            <button className="btn-secondary" onClick={runSearch} disabled={!searchVal || isRunning} style={{ flex: "0 0 auto", padding: "10px 16px" }}>🔍</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ctrl-panel">
                                <div className="panel-header"><p className="panel-title">Sort Algorithm</p></div>
                                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div className="ctrl-group">
                                        <select className="ctrl-select" value={sortAlgo} onChange={e => setSortAlgo(e.target.value)} disabled={isRunning}>
                                            <option value="bubble">Bubble Sort</option>
                                            <option value="selection">Selection Sort</option>
                                            <option value="insertion">Insertion Sort</option>
                                        </select>
                                    </div>
                                    <button className="btn-primary" onClick={runSort} disabled={isRunning}>
                                        {isRunning ? "⏳ Sorting..." : "▶ Start Sort"}
                                    </button>
                                </div>
                            </div>

                            <div className="ctrl-panel">
                                <div className="panel-header"><p className="panel-title">Array Modification</p></div>
                                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div className="ctrl-group">
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="New value" value={newVal} onChange={e => setNewVal(e.target.value)} style={{ flex: 1 }} />
                                            <button className="btn-primary" onClick={addElement} disabled={!newVal || isRunning} style={{ flex: "0 0 auto", padding: "10px 16px" }}>+</button>
                                        </div>
                                    </div>
                                    <button className="btn-secondary" onClick={reset} disabled={isRunning} style={{ marginTop: 4 }}>↺ Reset Array</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "input" && (
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div className="viz-panel">
                        <div className="panel-header"><p className="panel-title">✏️ Try It Yourself</p></div>
                        <div className="panel-body" style={{ padding: "32px" }}>
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
                                Enter your own numbers (comma or space separated) to initialize a custom array and analyze its properties.
                            </p>
                            <label className="ctrl-label" style={{ fontSize: 13, marginBottom: 8 }}>Custom Array Input</label>
                            <input className="ctrl-input" placeholder="e.g. 15, 7, 23, 4, 42, 8" value={userInput}
                                onChange={e => setUserInput(e.target.value)} style={{ margin: "0 0 20px", fontSize: 16, padding: "14px 18px" }} />
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput} style={{ padding: "14px 24px", fontSize: 15 }}>
                                Visualize & Analyze Array →
                            </button>

                            <div style={{ marginTop: 40 }}>
                                <h4 style={{ color: "#60a5fa", fontSize: 18, fontWeight: 800, margin: "0 0 20px" }}>Memory Layout & Analysis</h4>
                                {inputSteps.length > 0 ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {inputSteps.map((s, i) => (
                                            <div key={i} className="step-card" style={{ padding: "16px 20px" }}>
                                                <span className="step-number" style={{ width: 26, height: 26, fontSize: 13 }}>{i + 1}</span>
                                                <span className="step-text" style={{ fontSize: 15 }}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {[
                                            "OS allocates a contiguous block of memory (e.g., 4 bytes × n elements)",
                                            "Base address is stored (e.g., memory address 1000)",
                                            "arr[0] = base → address 1000, arr[1] → address 1004, arr[k] → 1000 + k×4",
                                            "Index access arr[i] is O(1) — purely mathematical calculation!",
                                            "No pointer chasing needed (unlike linked lists)",
                                            "Random access is the defining advantage of arrays"
                                        ].map((s, i) => (
                                            <div key={i} className="step-card" style={{ padding: "16px 20px", opacity: 0.6 }}>
                                                <span className="step-number" style={{ width: 26, height: 26, fontSize: 13, background: "rgba(255,255,255,0.2)" }}>{i + 1}</span>
                                                <span className="step-text" style={{ fontSize: 15 }}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card" style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Complete Array Theory</p></div>
                    <div className="theory-accordion">
                        {ARRAY_THEORY.map((s, i) => (
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

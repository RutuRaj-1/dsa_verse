import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const HASH_FUNCTIONS = {
    division: {
        name: "Division Method (Modulo)",
        desc: "Divides the sum of character codes by the table size and takes the remainder. Simple and fast, but can cause clustering if keys share similar sums.",
        formula: "h(k) = Σ(char_codes) mod size"
    },
    multiplication: {
        name: "Multiplication Method",
        desc: "Multiplies the key sum by a constant A (0 < A < 1), extracts the fractional part, and scales it to the table size. Less sensitive to table size patterns.",
        formula: "h(k) = ⌊ size × ( (Σ(char_codes) × A) mod 1 ) ⌋"
    },
    djb2: {
        name: "DJB2 (String Hashing)",
        desc: "An excellent string hashing algorithm by Dan Bernstein. Uses bit shifting and magic numbers (5381, 33) to distribute keys very uniformly.",
        formula: "hash = 5381; hash = ((hash << 5) + hash) + char"
    }
};

function calculateHash(keyStr, size, type) {
    if (type === "division") {
        let sum = 0;
        for (let i = 0; i < keyStr.length; i++) sum += keyStr.charCodeAt(i);
        return { index: sum % size, sum };
    } else if (type === "multiplication") {
        let sum = 0;
        for (let i = 0; i < keyStr.length; i++) sum += keyStr.charCodeAt(i);
        const A = 0.6180339887; // Golden ratio fractional part
        const frac = (sum * A) % 1;
        return { index: Math.floor(size * frac), sum, A, frac };
    } else if (type === "djb2") {
        let hash = 5381;
        for (let i = 0; i < keyStr.length; i++) {
            hash = ((hash << 5) + hash) + keyStr.charCodeAt(i); 
        }
        hash = Math.abs(hash); // ensure positive
        return { index: hash % size, rawHash: hash };
    }
    return { index: 0 };
}

function HashTable({ table, highlight }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 6, alignItems: "stretch" }}>
            {table.map((slot, i) => (
                <div key={i} style={{ display: "contents" }}>
                    <div style={{
                        background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 6, padding: "8px 14px", fontWeight: 700, fontSize: 13,
                        color: "rgba(255,255,255,0.5)", minWidth: 40, textAlign: "center",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>{i}</div>
                    <div style={{
                        background: highlight === i ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${highlight === i ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 6, padding: "8px 14px", minHeight: 36,
                        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                        transition: "all 0.3s"
                    }}>
                        {slot.length === 0 ? (
                            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>empty</span>
                        ) : (
                            slot.map((item, j) => (
                                <span key={j} style={{
                                    background: "rgba(59,130,246,0.2)",
                                    border: "1px solid rgba(59,130,246,0.4)",
                                    borderRadius: 5, padding: "4px 8px",
                                    fontSize: 13, fontWeight: 600,
                                    color: "#60a5fa", display: "flex", gap: 6, alignItems: "center"
                                }}>
                                    <span style={{ color: "#f1f5f9" }}>{item.key}</span>
                                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>→</span>
                                    {item.value}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

const HASHING_THEORY = [
    {
        title: "What is Hashing?",
        content: (
            <div className="theory-rich-content">
                <p><strong>Hashing</strong> is a technique to map keys to array indices using a hash function. A hash function <code>h(k)</code> transforms key <code>k</code> into an integer index in range <code>[0, m-1]</code> where <code>m</code> is the table size.</p>
                <h4>Properties of a Good Hash Function</h4>
                <ul>
                    <li><strong>Deterministic:</strong> The same key always produces the same index.</li>
                    <li><strong>Uniform distribution:</strong> Keys spread evenly across the table to minimize gaps and clusters.</li>
                    <li><strong>Fast computation:</strong> Calculating the hash should take <code>O(1)</code> time.</li>
                    <li><strong>Minimize collisions:</strong> Different keys should rarely map to the same index.</li>
                </ul>
            </div>
        )
    },
    {
        title: "Common Hash Functions",
        content: (
            <div className="theory-rich-content">
                <ul>
                    <li><strong>Division Method:</strong> <code>h(k) = k mod m</code>. Best when <code>m</code> is a prime number not close to a power of 2.</li>
                    <li><strong>Multiplication Method:</strong> <code>h(k) = ⌊m × (k × A mod 1)⌋</code>. <code>A ≈ 0.618</code> (the Golden Ratio) is often used. It's less sensitive to the table size <code>m</code>.</li>
                    <li><strong>Universal Hashing:</strong> Choosing <code>h</code> randomly from a family of functions to prevent adversarial worst-case inputs.</li>
                    <li><strong>DJB2 (String Hashing):</strong> <code>hash = ((hash << 5) + hash) + char</code>. A popular string hashing algorithm known for excellent distribution.</li>
                </ul>
            </div>
        )
    },
    {
        title: "Collision Resolution",
        content: (
            <div className="theory-rich-content">
                <h4>1. Separate Chaining</h4>
                <p>Each slot in the table points to a linked list of all keys that hash to that index.</p>
                <ul>
                    <li><strong>Search/Insert:</strong> <code>O(1 + α)</code> average, where <code>α = n/m</code> is the load factor.</li>
                </ul>
                
                <h4>2. Open Addressing</h4>
                <p>All keys are stored directly in the table. On collision, we "probe" for the next empty slot.</p>
                <ul>
                    <li><strong>Linear Probing:</strong> <code>h(k,i) = (h(k)+i) mod m</code>. Simple but prone to primary clustering.</li>
                    <li><strong>Quadratic Probing:</strong> <code>h(k,i) = (h(k)+i²) mod m</code>. Reduces primary clustering.</li>
                    <li><strong>Double Hashing:</strong> <code>h(k,i) = (h1(k) + i·h2(k)) mod m</code>. Generally provides the best distribution among probing methods.</li>
                </ul>
            </div>
        )
    }
];

export default function HashingVisualization() {
    const [tableSize, setTableSize] = useState(10);
    const [table, setTable] = useState(() => Array.from({ length: 10 }, () => []));
    const [hashAlgo, setHashAlgo] = useState("division");
    
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [searchKey, setSearchKey] = useState("");
    
    const [highlight, setHighlight] = useState(null);
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

    function applyNewSize() {
        const s = parseInt(tableSize);
        if (isNaN(s) || s < 2 || s > 50) {
            addToLog("❌ Invalid table size. Must be between 2 and 50.");
            return;
        }
        setTable(Array.from({ length: s }, () => []));
        addToLog(`✅ Re-initialized Hash Table with Size ${s}`);
    }

    async function insert() {
        if (!key.trim() || !value.trim()) return;
        const k = key.trim();
        const v = value.trim();
        setIsRunning(true);
        setKey(""); setValue("");

        addToLog(`⚡ Starting Insertion for Key: "${k}"`);
        addToLog(`Selected Hash Function: ${HASH_FUNCTIONS[hashAlgo].name}`);
        await sleep(1000);

        addToLog(`Calculating Hash Steps:`);
        const result = calculateHash(k, table.length, hashAlgo);
        
        if (hashAlgo === "division") {
            addToLog(`1) Sum of char codes for "${k}" = ${result.sum}`);
            await sleep(800);
            addToLog(`2) Index = ${result.sum} % ${table.length} (Table Size)`);
        } else if (hashAlgo === "multiplication") {
            addToLog(`1) Sum of char codes = ${result.sum}`);
            await sleep(800);
            addToLog(`2) Fractional part: (${result.sum} * 0.618) % 1 = ${result.frac.toFixed(4)}`);
            await sleep(800);
            addToLog(`3) Index = Floor(${table.length} * ${result.frac.toFixed(4)})`);
        } else if (hashAlgo === "djb2") {
            addToLog(`1) Applying bitwise shifting ((hash << 5) + hash) + char`);
            await sleep(800);
            addToLog(`2) Raw Hash generated = ${result.rawHash}`);
            await sleep(800);
            addToLog(`3) Index = ${result.rawHash} % ${table.length}`);
        }

        const idx = result.index;
        await sleep(1000);
        addToLog(`➡️ FINAL INDEX GENERATED: ${idx}`);
        setHighlight(idx);
        await sleep(1000);

        addToLog(`Checking Hash Table at index [${idx}]...`);
        const newTable = table.map(s => [...s]);
        const existing = newTable[idx].findIndex(e => e.key === k);
        
        await sleep(800);
        if (existing >= 0) {
            addToLog(`⚠️ Key "${k}" already exists at index [${idx}]. Updating value.`);
            newTable[idx][existing].value = v;
        } else {
            if (newTable[idx].length > 0) {
                addToLog(`💥 COLLISION DETECTED at index [${idx}]. Appending to chain.`);
            } else {
                addToLog(`✅ Slot is empty. Inserting directly.`);
            }
            newTable[idx].push({ key: k, value: v });
        }
        
        setTable(newTable);
        await sleep(1000);
        setHighlight(null);
        addToLog(`✅ Operation Complete.`);
        setIsRunning(false);
    }

    async function search() {
        if (!searchKey.trim()) return;
        const k = searchKey.trim();
        setIsRunning(true);
        addToLog(`🔍 Searching for Key: "${k}"`);

        const result = calculateHash(k, table.length, hashAlgo);
        const idx = result.index;
        addToLog(`Hash function generated Index = ${idx}`);
        setHighlight(idx);
        await sleep(1000);

        addToLog(`Traversing chain at index [${idx}]...`);
        const found = table[idx].find(e => e.key === k);
        await sleep(1000);

        if (found) {
            addToLog(`✅ Found "${k}"! Value = "${found.value}"`);
        } else {
            addToLog(`❌ "${k}" not found in chain at index [${idx}]`);
        }

        setHighlight(null);
        setIsRunning(false);
    }

    function reset() {
        setTable(Array.from({ length: table.length }, () => []));
        addToLog("🗑️ Cleared Hash Table.");
    }

    return (
        <div className="page-container">
            <style>{`
                .theory-rich-content { color: rgba(255,255,255,0.85); font-size: 15px; line-height: 1.7; }
                .theory-rich-content h4 { color: #60a5fa; margin: 16px 0 8px; font-size: 16px; font-weight: 700; }
                .log-panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; height: 350px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
                .log-header { background: #1e293b; padding: 10px 16px; font-size: 14px; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #334155; }
                .log-content { padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; scroll-behavior: smooth; }
                .log-line { color: #e2e8f0; line-height: 1.5; padding: 4px 8px; border-radius: 4px; transition: background 0.2s; }
                .log-line:hover { background: rgba(255,255,255,0.05); }
                .log-success { color: #34d399; font-weight: 600; background: rgba(52,211,153,0.1); }
                .log-error { color: #f87171; font-weight: 600; background: rgba(248,113,113,0.1); }
                .log-highlight { color: #818cf8; }
                .ctrl-select, .ctrl-input { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #f1f5f9; border-radius: 8px; padding: 10px 14px; outline: none; }
                .ctrl-select option { background: #1e293b; color: #f1f5f9; }
                
                .algo-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin-top: 10px; }
                .algo-title { color: #60a5fa; font-weight: 700; font-size: 15px; margin-bottom: 8px; }
                .algo-desc { color: rgba(255,255,255,0.7); font-size: 13.5px; line-height: 1.5; margin-bottom: 12px; }
                .algo-formula { background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 4px; font-family: monospace; color: #a78bfa; font-size: 13px; }
            `}</style>

            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Hashing & Hash Tables</h1>
                <p className="page-subtitle">Hash functions, chaining collision resolution, and index generation</p>
            </div>

            <div className="page-tabs">
                <button className={`tab-btn ${activeTab === "visualizer" ? "active" : ""}`} onClick={() => setActiveTab("visualizer")}>🔭 Visualizer</button>
                <button className={`tab-btn ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>✏️ Try It Yourself</button>
                <button className={`tab-btn ${activeTab === "theory" ? "active" : ""}`} onClick={() => setActiveTab("theory")}>📖 Theory</button>
            </div>

            {activeTab === "visualizer" && (
                <div className="viz-grid">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="viz-panel">
                            <div className="panel-header">
                                <p className="panel-title">Hash Table (Chaining Resolution)</p>
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                                    Load Factor: {table.reduce((a, s) => a + s.length, 0)}/{table.length}
                                </span>
                            </div>
                            <div className="panel-body">
                                <HashTable table={table} highlight={highlight} />
                            </div>
                        </div>

                        {/* Permanent Execution Log below Visualizer */}
                        <div className="log-panel">
                            <div className="log-header">
                                <span style={{ color: "#3b82f6" }}>⚡</span> Execution Log
                            </div>
                            <div className="log-content thin-scroll">
                                {log.map((l, i) => {
                                    let className = "log-line";
                                    if (l.includes("✅")) className += " log-success";
                                    else if (l.includes("❌") || l.includes("⚠️") || l.includes("💥")) className += " log-error";
                                    else if (l.includes("⚡") || l.includes("➡️")) className += " log-highlight";
                                    return <div key={i} className={className}>{l}</div>;
                                })}
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Hash Function Settings</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div>
                                    <label className="ctrl-label">Select Hash Algorithm</label>
                                    <select className="ctrl-select" value={hashAlgo} onChange={e => setHashAlgo(e.target.value)} disabled={isRunning}>
                                        <option value="division">Division Method (Modulo)</option>
                                        <option value="multiplication">Multiplication Method</option>
                                        <option value="djb2">DJB2 (String Hash)</option>
                                    </select>
                                </div>
                                <div className="algo-card">
                                    <div className="algo-title">{HASH_FUNCTIONS[hashAlgo].name}</div>
                                    <div className="algo-desc">{HASH_FUNCTIONS[hashAlgo].desc}</div>
                                    <div className="algo-formula">{HASH_FUNCTIONS[hashAlgo].formula}</div>
                                </div>
                                <div>
                                    <label className="ctrl-label">Table Size (Default: 10)</label>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input className="ctrl-input" type="number" min="2" max="50" value={tableSize} onChange={e => setTableSize(e.target.value)} disabled={isRunning} />
                                        <button className="btn-secondary" onClick={applyNewSize} disabled={isRunning}>Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Operations</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <input className="ctrl-input" placeholder="Key (e.g. name)" value={key} onChange={e => setKey(e.target.value)} disabled={isRunning} />
                                <input className="ctrl-input" placeholder="Value (e.g. Alice)" value={value} onChange={e => setValue(e.target.value)} disabled={isRunning} />
                                <button className="btn-primary" onClick={insert} disabled={!key || !value || isRunning}>
                                    + Insert & Visualize
                                </button>
                                
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "8px 0" }}></div>
                                
                                <input className="ctrl-input" placeholder="Key to search" value={searchKey} onChange={e => setSearchKey(e.target.value)} disabled={isRunning} />
                                <button className="btn-secondary" onClick={search} disabled={!searchKey || isRunning}>
                                    🔍 Search
                                </button>
                                
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "8px 0" }}></div>
                                <button className="btn-secondary" onClick={reset} disabled={isRunning}>🗑️ Reset Table</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "input" && (
                <div style={{ maxWidth: 700 }}>
                    <div className="viz-panel">
                        <div className="panel-header"><p className="panel-title">✏️ Try It Yourself — Hash Function Playground</p></div>
                        <div className="panel-body">
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 20 }}>
                                Switch back to the Visualizer tab! You can change the table size dynamically and select between Division, Multiplication, and DJB2 hash functions right from the control panel. 
                                <br/><br/>
                                The Execution Log will physically break down the math for generating the index based on the hash function you choose.
                            </p>
                            <button className="btn-primary" onClick={() => setActiveTab("visualizer")}>
                                Go to Visualizer Controls →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card" style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Complete Hashing Theory</p></div>
                    <div className="theory-accordion">
                        {HASHING_THEORY.map((s, i) => (
                            <div key={i} className="accordion-item">
                                <button className="accordion-trigger" style={{ fontSize: 16, padding: "20px 24px" }} onClick={() => setOpenSection(openSection === i ? null : i)}>
                                    {s.title} 
                                    <span style={{ color: "#60a5fa", transform: openSection === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▼</span>
                                </button>
                                {openSection === i && (
                                    <div className="accordion-content" style={{ padding: "0 24px 24px" }}>
                                        {s.content}
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

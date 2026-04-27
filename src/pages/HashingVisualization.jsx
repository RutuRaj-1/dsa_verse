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
        title: "1. The Concept of Hashing",
        content: (
            <div className="theory-rich-content">
                <p><strong>Hashing</strong> is a technique to map a large range of keys into a smaller range of indices using a <strong>Hash Function</strong> <code>h(k)</code>. This allows for near <code>O(1)</code> average-case time complexity for insertion, deletion, and lookup.</p>
                <h4>Properties of a Good Hash Function:</h4>
                <ul>
                    <li><strong>Deterministic:</strong> Same input always yields the same index.</li>
                    <li><strong>Uniformity:</strong> Keys are distributed evenly across the table.</li>
                    <li><strong>Efficiency:</strong> Computation of the hash should be fast (O(1)).</li>
                    <li><strong>Minimizing Collisions:</strong> Minimizes instances where <code>h(k1) == h(k2)</code> for different keys.</li>
                </ul>
            </div>
        )
    },
    {
        title: "2. Common Hash Functions",
        content: (
            <div className="theory-rich-content">
                <p>Several methods exist to transform keys (strings or numbers) into table indices:</p>
                <ul>
                    <li><strong>Division Method:</strong> Uses modulo operator. <code>h(k) = k mod m</code>. Best when <code>m</code> is a prime number.</li>
                    <li><strong>Multiplication Method:</strong> Uses a fractional constant <code>A</code>. <code>h(k) = floor(m * (kA mod 1))</code>. Less sensitive to table size.</li>
                    <li><strong>DJB2 (String Hashing):</strong> A popular string hashing algorithm that uses bit shifting and a magic number (5381) to ensure high entropy.</li>
                </ul>
                <div className="theory-formula">
                    h(k) = Σ(char_codes) mod table_size
                </div>
            </div>
        )
    },
    {
        title: "3. Collision Resolution Strategies",
        content: (
            <div className="theory-rich-content">
                <p>When two different keys map to the same index, a <strong>Collision</strong> occurs. There are two primary ways to handle this:</p>
                <h4>Separate Chaining:</h4>
                <p>Each table slot points to a linked list (or chain) of entries. This allows the table to store more elements than its size, but lookup degrades to <code>O(n)</code> in the worst case.</p>
                <h4>Open Addressing (Linear Probing):</h4>
                <p>All elements are stored directly in the hash table. If a collision occurs at index <code>i</code>, we check <code>i+1</code>, <code>i+2</code>, etc., until an empty slot is found.</p>
                <ul>
                    <li><strong>Clustering:</strong> Linear Probing causes 'primary clustering' where long runs of occupied slots build up, slowing down operations.</li>
                    <li><strong>Quadratic Probing:</strong> Uses a quadratic function to find the next slot (i+1², i+2²...). Reduces clustering.</li>
                    <li><strong>Double Hashing:</strong> Uses a second hash function to determine the step size.</li>
                </ul>
            </div>
        )
    },
    {
        title: "4. Load Factor & Rehashing",
        content: (
            <div className="theory-rich-content">
                <p>The <strong>Load Factor (α)</strong> is defined as <code>n / m</code> (number of elements / table size). As α increases, the probability of collisions grows.</p>
                <ul>
                    <li>In Chaining, &alpha; can be &gt; 1.</li>
                    <li>In Open Addressing, &alpha; must be &lt; 1.</li>
                </ul>
                <p><strong>Rehashing:</strong> When α exceeds a threshold (typically 0.75), the table is resized (usually doubled) and all existing keys are re-inserted into the new table.</p>
            </div>
        )
    }
];



const S = {
    intuitionBox: {
        background: "rgba(245,158,11,0.08)",
        borderLeft: "4px solid #f59e0b",
        borderRadius: "0 14px 14px 0",
        padding: "18px 24px",
        marginBottom: 24,
        fontSize: 15,
        color: "rgba(255,255,255,0.8)",
        lineHeight: 1.7,
        fontStyle: "italic",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    }
};

export default function HashingVisualization() {
    const [tableSize, setTableSize] = useState(10);
    const [table, setTable] = useState(() => Array.from({ length: 10 }, () => []));
    const [hashAlgo, setHashAlgo] = useState("division");
    const [collisionStrategy, setCollisionStrategy] = useState("chaining");
    
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [searchKey, setSearchKey] = useState("");
    
    const [highlight, setHighlight] = useState(null);
    const [probingIdx, setProbingIdx] = useState(null);
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
        addToLog(`Hash: ${HASH_FUNCTIONS[hashAlgo].name} | Strategy: ${collisionStrategy}`);
        await sleep(800);

        const result = calculateHash(k, table.length, hashAlgo);
        const startIdx = result.index;
        
        addToLog(`Calculated Base Index: ${startIdx}`);
        setHighlight(startIdx);
        await sleep(1000);

        const newTable = table.map(s => [...s]);

        if (collisionStrategy === "chaining") {
            const existing = newTable[startIdx].findIndex(e => e.key === k);
            if (existing >= 0) {
                addToLog(`⚠️ Updating existing key "${k}" at index ${startIdx}`);
                newTable[startIdx][existing].value = v;
            } else {
                if (newTable[startIdx].length > 0) addToLog(`💥 Collision at ${startIdx}! Adding to chain.`);
                else addToLog(`✅ Slot ${startIdx} empty. Inserting.`);
                newTable[startIdx].push({ key: k, value: v });
            }
        } else {
            // Linear Probing
            let curr = startIdx;
            let found = false;
            let steps = 0;

            while (steps < table.length) {
                setProbingIdx(curr);
                addToLog(`Probing index ${curr}...`);
                await sleep(600);

                if (newTable[curr].length === 0) {
                    addToLog(`✅ Found empty slot at ${curr}. Inserting.`);
                    newTable[curr] = [{ key: k, value: v }];
                    found = true;
                    break;
                } else if (newTable[curr][0].key === k) {
                    addToLog(`⚠️ Key "${k}" already at ${curr}. Updating.`);
                    newTable[curr] = [{ key: k, value: v }];
                    found = true;
                    break;
                }

                addToLog(`❌ Slot ${curr} occupied. Moving to next...`);
                curr = (curr + 1) % table.length;
                steps++;
            }

            if (!found) addToLog("❌ ERROR: Hash Table is full!");
            setProbingIdx(null);
        }
        
        setTable(newTable);
        await sleep(800);
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
        const startIdx = result.index;
        setHighlight(startIdx);
        await sleep(800);

        if (collisionStrategy === "chaining") {
            const found = table[startIdx].find(e => e.key === k);
            if (found) addToLog(`✅ Found "${k}" in chain at ${startIdx}! Value = ${found.value}`);
            else addToLog(`❌ "${k}" not found in chain at ${startIdx}`);
        } else {
            let curr = startIdx;
            let steps = 0;
            let found = false;

            while (steps < table.length) {
                setProbingIdx(curr);
                addToLog(`Checking index ${curr}...`);
                await sleep(500);

                if (table[curr].length === 0) break;
                if (table[curr][0].key === k) {
                    addToLog(`✅ Found "${k}" at ${curr}! Value = ${table[curr][0].value}`);
                    found = true;
                    break;
                }
                curr = (curr + 1) % table.length;
                steps++;
            }
            if (!found) addToLog(`❌ "${k}" not found in probing sequence.`);
            setProbingIdx(null);
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
                        {/* Intuition Section */}
                        <div style={S.intuitionBox}>
                            <span style={{ color: "#fb923c", fontWeight: 700, marginRight: 8 }}>💡 Intuition:</span>
                            Hashing maps large keys to small indexes using a hash function. Collisions are inevitable (Pigeonhole Principle), so we use techniques like Separate Chaining (linked lists at each slot) to maintain O(1) average-case lookups.
                        </div>

                        <div className="viz-panel">
                            <div className="panel-header">
                                <p className="panel-title">Hash Table (Chaining Resolution)</p>
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                                    Load Factor: {table.reduce((a, s) => a + s.length, 0)}/{table.length}
                                </span>
                            </div>
                            <div className="panel-body">
                                <HashTable table={table} highlight={highlight || probingIdx} />
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
                                    <label className="ctrl-label">Collision Resolution Strategy</label>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button className={`btn-secondary ${collisionStrategy === "chaining" ? "active" : ""}`} 
                                            style={{ flex: 1, background: collisionStrategy === "chaining" ? "rgba(59,130,246,0.2)" : "transparent", borderColor: collisionStrategy === "chaining" ? "#3b82f6" : "rgba(255,255,255,0.1)" }}
                                            onClick={() => { setCollisionStrategy("chaining"); reset(); }}>Separate Chaining</button>
                                        <button className={`btn-secondary ${collisionStrategy === "probing" ? "active" : ""}`}
                                            style={{ flex: 1, background: collisionStrategy === "probing" ? "rgba(59,130,246,0.2)" : "transparent", borderColor: collisionStrategy === "probing" ? "#3b82f6" : "rgba(255,255,255,0.1)" }}
                                            onClick={() => { setCollisionStrategy("probing"); reset(); }}>Linear Probing</button>
                                    </div>
                                </div>
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
                                    <div className="theory-formula">{HASH_FUNCTIONS[hashAlgo].formula}</div>
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

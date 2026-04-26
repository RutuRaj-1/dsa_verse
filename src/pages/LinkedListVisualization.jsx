import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─── Theory ─── */
const THEORY = [
    {
        title: "What is a Linked List?",
        content: (
            <div className="theory-rich-content">
                <p>A linked list is a dynamic data structure where elements (nodes) are connected via pointers. Unlike arrays, nodes are NOT stored in contiguous memory.</p>
                <h4>Each node holds:</h4>
                <ul>
                    <li><strong>Data:</strong> the actual value stored</li>
                    <li><strong>Next pointer:</strong> address of the next node</li>
                    <li><strong>(For doubly linked) Prev pointer:</strong> address of the previous node</li>
                </ul>
                <h4>Why Linked Lists?</h4>
                <ul>
                    <li>Dynamic size — grows/shrinks at runtime without reallocation</li>
                    <li><strong>O(1)</strong> insertion/deletion at beginning</li>
                    <li>No wasted space</li>
                </ul>
                <p><strong>Trade-off:</strong> No random access — must traverse from head (O(n) access).</p>
            </div>
        )
    },
    {
        title: "Types of Linked Lists",
        content: (
            <div className="theory-rich-content">
                <ol>
                    <li>
                        <strong>Singly Linked List:</strong> Each node → next; last node → null<br />
                        <div className="theory-formula">Head → [data|next] → [data|next] → [data|null]</div>
                    </li>
                    <li>
                        <strong>Doubly Linked List:</strong> Each node has prev and next pointers<br />
                        <div className="theory-formula">null ← [prev|data|next] ↔ [prev|data|next] → null</div>
                        <ul>
                            <li>Allows backward traversal</li>
                            <li>O(1) delete given node pointer</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Circular Linked List:</strong> Last node points back to head<br />
                        <div className="theory-formula">Head → [data|next] → [data|next] ⟲ (back to Head)</div>
                        <ul>
                            <li>Useful for round-robin scheduling</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Doubly Circular:</strong> Both prev and next, circular.<br />
                        Used in advanced OS scheduling.
                    </li>
                    <li>
                        <strong>Generalized Linked List (GLL):</strong> Nodes can hold sublists.<br />
                        Used for polynomial representation.
                    </li>
                </ol>
            </div>
        )
    },
    {
        title: "Operations & Complexity",
        content: (
            <div className="theory-rich-content">
                <table className="theory-table">
                    <thead>
                        <tr><th>Operation</th><th>Singly</th><th>Doubly</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Insert at head</td><td>O(1)</td><td>O(1)</td></tr>
                        <tr><td>Insert at tail</td><td>O(n) / O(1)*</td><td>O(1) with tail ptr</td></tr>
                        <tr><td>Insert at position i</td><td>O(i)</td><td>O(i)</td></tr>
                        <tr><td>Delete head</td><td>O(1)</td><td>O(1)</td></tr>
                        <tr><td>Delete tail</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Delete given node</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
                        <tr><td>Reverse</td><td>O(n)</td><td>O(n)</td></tr>
                    </tbody>
                </table>
                <p style={{ marginTop: 12 }}>* With tail pointer maintained: O(1)</p>
                <p><strong>Space:</strong> O(n) for n nodes (+ O(n) extra for doubly linked's prev pointers)</p>
            </div>
        )
    },
    {
        title: "Polynomial Manipulation with GLL",
        content: (
            <div className="theory-rich-content">
                <p>A polynomial like P(x) = 3x⁴ + 2x² + 1 is stored as:</p>
                <div className="theory-formula">Node: {`{coeff: 3, exp: 4} → {coeff: 2, exp: 2} → {coeff: 1, exp: 0} → null`}</div>
                <h4>Addition: P(x) + Q(x)</h4>
                <ul>
                    <li>Compare exponents of current nodes</li>
                    <li>If equal: sum coefficients, advance both</li>
                    <li>If P.exp &gt; Q.exp: copy P node, advance P</li>
                    <li>If P.exp &lt; Q.exp: copy Q node, advance Q</li>
                </ul>
                <p><strong>Time:</strong> O(m + n) where m, n = number of terms</p>
                <p><strong>Space:</strong> O(m + n) for result polynomial</p>
            </div>
        )
    }
];

function LLNode({ val, isHead, isTail, isHighlighted, listType }) {
    const color = isHighlighted ? "#a78bfa" : isHead ? "#3b82f6" : "#1e293b";
    const border = isHighlighted ? "#a78bfa" : isHead ? "#60a5fa" : "rgba(255,255,255,0.15)";
    
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {/* Doubly null indicator at head */}
            {isHead && listType === "doubly" && (
                <div style={{ marginRight: 12, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>null</div>
            )}
            {isHead && listType === "doubly" && (
                <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.2)", position: "relative", marginRight: 0 }}>
                     <div style={{position: "absolute", top: -9, left: 6, color: "rgba(255,255,255,0.4)", fontSize: 12}}>←</div>
                </div>
            )}
            
            <div style={{ display: "flex", alignItems: "center", boxShadow: isHighlighted ? `0 0 15px ${border}80` : "none", borderRadius: 8 }}>
                {/* Prev pointer block for Doubly */}
                {listType === "doubly" && (
                    <div style={{
                        width: 28, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.06)", border: `1.5px solid ${border}`,
                        borderRight: "none", borderRadius: "8px 0 0 8px",
                        fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700
                    }}>←•</div>
                )}
                
                {/* Data block */}
                <div style={{
                    width: 60, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                    background: color, border: `1.5px solid ${border}`, 
                    borderRadius: listType === "doubly" ? "0" : "8px 0 0 8px",
                    fontWeight: 700, fontSize: 16, color: "#f1f5f9", transition: "all 0.3s"
                }}>{val}</div>
                
                {/* Next pointer block */}
                <div style={{
                    width: 28, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.06)", border: `1.5px solid ${border}`,
                    borderLeft: "none", borderRadius: "0 8px 8px 0",
                    fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700
                }}>•→</div>
            </div>
            
            {/* Connecting Arrow */}
            {!isTail && (
                <div style={{ width: 32, height: 2, background: "rgba(255,255,255,0.2)", position: "relative" }}>
                    {listType === "doubly" ? (
                        <div style={{position: "absolute", top: -9, left: 8, color: "rgba(255,255,255,0.4)", fontSize: 12}}>↔</div>
                    ) : (
                        <div style={{position: "absolute", top: -9, left: 10, color: "rgba(255,255,255,0.4)", fontSize: 12}}>→</div>
                    )}
                </div>
            )}
            
            {/* Tail Indicator */}
            {isTail && (
                <div style={{ marginLeft: 12, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
                    {listType === "circular" ? "⟲ (Head)" : "null"}
                </div>
            )}
        </div>
    );
}

export default function LinkedListVisualization() {
    const [nodes, setNodes] = useState([
        { val: 10, id: 1 }, { val: 20, id: 2 }, { val: 30, id: 3 }, { val: 40, id: 4 }
    ]);
    const [listType, setListType] = useState("singly");
    const [isRunning, setIsRunning] = useState(false);
    
    // Insert State
    const [inputVal, setInputVal] = useState("");
    const [insertType, setInsertType] = useState("tail");
    const [insertIndex, setInsertIndex] = useState("");
    
    // Delete State
    const [deleteType, setDeleteType] = useState("tail");
    const [deleteIndex, setDeleteIndex] = useState("");
    
    const [searchVal, setSearchVal] = useState("");
    const [highlighted, setHighlighted] = useState(null);
    const [activeTab, setActiveTab] = useState("visualizer");
    const [openSection, setOpenSection] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [tryYourselfType, setTryYourselfType] = useState("singly");
    const [inputSteps, setInputSteps] = useState([]);
    const [log, setLog] = useState([
        "Execution log initialized.",
        "Select an operation to view its step-by-step execution here."
    ]);
    const idRef = useRef(100);
    const logEndRef = useRef(null);

    function newId() { return idRef.current++; }
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const addToLog = (msg) => {
        setLog(prev => [...prev, msg]);
    };

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [log]);

    async function insert() {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        setIsRunning(true);
        const newNode = { val: v, id: newId() };
        
        addToLog(`--- Inserting ${v} ---`);
        
        if (insertType === "head") {
            addToLog("Creating new node with value " + v);
            await sleep(500);
            addToLog("Pointing new node's next to current Head");
            if (listType === "doubly" && nodes.length > 0) {
                addToLog("Pointing current Head's prev to new node");
            }
            if (listType === "circular") {
                addToLog("Updating Tail's next pointer to new node");
            }
            await sleep(500);
            setNodes(prev => [newNode, ...prev]);
            addToLog(`✅ Successfully inserted ${v} at Head`);
        } 
        else if (insertType === "tail") {
            addToLog("Traversing to the end of the list...");
            for (let i = 0; i < nodes.length; i++) {
                setHighlighted(nodes[i].id);
                await sleep(300);
            }
            addToLog("Creating new node with value " + v);
            await sleep(400);
            addToLog("Pointing Tail's next to new node");
            if (listType === "doubly") {
                addToLog("Pointing new node's prev to old Tail");
            }
            if (listType === "circular") {
                addToLog("Pointing new Tail's next to Head");
            }
            setNodes(prev => [...prev, newNode]);
            setHighlighted(null);
            addToLog(`✅ Successfully inserted ${v} at Tail`);
        }
        else if (insertType === "index") {
            const idx = parseInt(insertIndex);
            if (isNaN(idx) || idx < 0 || idx > nodes.length) {
                addToLog(`❌ Invalid index. Must be between 0 and ${nodes.length}.`);
                setIsRunning(false);
                return;
            }
            addToLog(`Traversing to index ${idx - 1}...`);
            for (let i = 0; i < idx && i < nodes.length; i++) {
                setHighlighted(nodes[i].id);
                await sleep(400);
            }
            addToLog(`Inserting new node (${v}) between index ${idx-1} and ${idx}`);
            await sleep(500);
            setNodes(prev => {
                const arr = [...prev];
                arr.splice(idx, 0, newNode);
                return arr;
            });
            setHighlighted(null);
            addToLog(`✅ Successfully inserted ${v} at index ${idx}`);
        }
        
        setInputVal("");
        setIsRunning(false);
    }

    async function search() {
        const v = parseInt(searchVal);
        if (isNaN(v)) return;
        setIsRunning(true);
        setHighlighted(null);
        addToLog(`--- Searching for ${v} ---`);
        
        let found = false;
        for (let i = 0; i < nodes.length; i++) {
            setHighlighted(nodes[i].id);
            addToLog(`Checking node at position ${i} (value: ${nodes[i].val})`);
            await sleep(700);
            if (nodes[i].val === v) {
                addToLog(`✅ SUCCESS: Found ${v} at position ${i}!`);
                found = true;
                setTimeout(() => setHighlighted(null), 2000);
                break;
            } else {
                addToLog(`  → ${nodes[i].val} ≠ ${v}, traversing to next node.`);
            }
        }
        if (!found) {
            setHighlighted(null);
            addToLog(`❌ NOT FOUND: ${v} is not in the list.`);
        }
        setIsRunning(false);
    }

    async function deleteNode() {
        if (!nodes.length) {
            addToLog("❌ List is empty!");
            return;
        }
        setIsRunning(true);
        addToLog(`--- Deleting from ${deleteType} ---`);
        
        if (deleteType === "head") {
            const removed = nodes[0].val;
            setHighlighted(nodes[0].id);
            addToLog("Updating Head pointer to the next node");
            if (listType === "doubly" && nodes.length > 1) {
                addToLog("Setting new Head's prev pointer to null");
            }
            if (listType === "circular" && nodes.length > 1) {
                addToLog("Updating Tail's next pointer to new Head");
            }
            await sleep(800);
            setNodes(prev => prev.slice(1));
            setHighlighted(null);
            addToLog(`✅ Deleted head node (value: ${removed})`);
        }
        else if (deleteType === "tail") {
            const removed = nodes[nodes.length - 1].val;
            addToLog("Traversing to the second-to-last node...");
            for (let i = 0; i < nodes.length - 1; i++) {
                setHighlighted(nodes[i].id);
                await sleep(300);
            }
            addToLog("Updating next pointer to null");
            await sleep(600);
            setNodes(prev => prev.slice(0, -1));
            setHighlighted(null);
            addToLog(`✅ Deleted tail node (value: ${removed})`);
        }
        else if (deleteType === "index") {
            const idx = parseInt(deleteIndex);
            if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
                addToLog(`❌ Invalid index. Must be between 0 and ${nodes.length - 1}.`);
                setIsRunning(false);
                return;
            }
            addToLog(`Traversing to node at index ${idx-1} to update its pointer...`);
            for (let i = 0; i < idx; i++) {
                setHighlighted(nodes[i].id);
                await sleep(400);
            }
            setHighlighted(nodes[idx].id);
            addToLog(`Removing node at index ${idx} (value: ${nodes[idx].val})`);
            await sleep(600);
            setNodes(prev => prev.filter((_, i) => i !== idx));
            setHighlighted(null);
            addToLog(`✅ Successfully deleted node at index ${idx}`);
        }
        setIsRunning(false);
    }

    async function reverse() {
        if (nodes.length <= 1) return;
        setIsRunning(true);
        addToLog("--- Reversing Linked List ---");
        addToLog("Iterating through nodes to flip next/prev pointers...");
        
        // Visual simulation of traversal
        for (let i = 0; i < nodes.length; i++) {
            setHighlighted(nodes[i].id);
            await sleep(200);
        }
        
        setNodes(prev => [...prev].reverse());
        setHighlighted(null);
        addToLog("✅ List reversed successfully! Head is now pointing to the old tail.");
        setIsRunning(false);
    }

    function reset() {
        setNodes([{ val: 10, id: 1 }, { val: 20, id: 2 }, { val: 30, id: 3 }, { val: 40, id: 4 }]);
        setLog(["Execution log initialized.", "Linked List reset to default state."]); 
        setHighlighted(null);
        setListType("singly");
    }

    function processUserInput() {
        const nums = userInput.split(/[s,→]+/).map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        setNodes(nums.map((v) => ({ val: v, id: newId() })));
        setListType(tryYourselfType);
        
        let typeStr = "Singly";
        if (tryYourselfType === "doubly") typeStr = "Doubly";
        if (tryYourselfType === "circular") typeStr = "Circular";
        
        const steps = [
            `Created a ${typeStr} linked list with ${nums.length} nodes: ${nums.join(" → ")}`,
            `Head node holds value ${nums[0]}. Tail holds ${nums[nums.length - 1]}`,
            `Each node stores: data + pointer(s) to connecting nodes`,
            `Memory is NOT contiguous — nodes can be anywhere in the heap`,
            `Access node at index k: must traverse from head — O(k) time`,
            `Insert at head: just update head pointer — O(1) time`,
        ];
        if (tryYourselfType === "doubly") steps.push("Nodes also maintain 'prev' pointers for backward traversal.");
        if (tryYourselfType === "circular") steps.push("The tail node's next pointer points back to the Head instead of null.");
        
        setInputSteps(steps);
        setActiveTab("visualizer");
        setLog([`Loaded custom ${typeStr} Linked List with ${nums.length} nodes.`]);
    }

    return (
        <div className="page-container">
            <style>{`
                .theory-rich-content { color: rgba(255,255,255,0.85); font-size: 15px; line-height: 1.7; }
                .theory-rich-content h4 { color: #60a5fa; margin: 16px 0 8px; font-size: 16px; font-weight: 700; }
                .theory-rich-content ul, .theory-rich-content ol { padding-left: 24px; margin-bottom: 16px; }
                .theory-rich-content li { margin-bottom: 6px; }
                .theory-formula { background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: 8px; font-family: monospace; color: #a78bfa; margin: 12px 0; border: 1px solid rgba(167,139,250,0.2); }
                .theory-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                .theory-table th, .theory-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .theory-table th { background: rgba(255,255,255,0.05); color: #60a5fa; font-weight: 600; }
                .log-panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; height: 280px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
                .log-header { background: #1e293b; padding: 10px 16px; font-size: 14px; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #334155; }
                .log-content { padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; scroll-behavior: smooth; }
                .log-line { color: #e2e8f0; line-height: 1.5; padding: 4px 8px; border-radius: 4px; transition: background 0.2s; }
                .log-line:hover { background: rgba(255,255,255,0.05); }
                .log-success { color: #34d399; font-weight: 600; background: rgba(52,211,153,0.1); }
                .log-error { color: #f87171; font-weight: 600; background: rgba(248,113,113,0.1); }
                .log-highlight { color: #818cf8; }
                .ctrl-select { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-sm); padding: 10px 14px; color: var(--text); font-size: 14px; outline: none; width: 100%; appearance: none; cursor: pointer; }
                .ctrl-select option { background: #0f172a; }
            `}</style>

            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Linked Lists</h1>
                <p className="page-subtitle">Singly, doubly, circular lists — with insert, delete, search, and reversal operations</p>
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
                                {listType === "singly" 
                                    ? "Singly Linked Lists are efficient for stack-like operations (LIFO) at the head. They use minimal memory per node but only allow forward traversal."
                                    : listType === "doubly"
                                    ? "Doubly Linked Lists allow bidirectional traversal and O(1) deletion of a node if you have a pointer to it. The trade-off is extra memory for the 'prev' pointers."
                                    : "Circular Linked Lists connect the last node back to the head, making them ideal for buffer management and round-robin scheduling algorithms."
                                }
                            </div>

                            <div className="viz-panel">
                                <div className="panel-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <p className="panel-title">List Visualization</p>
                                        <select className="ctrl-select" style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }} value={listType} onChange={e => setListType(e.target.value)} disabled={isRunning}>
                                            <option value="singly">Singly Linked List</option>
                                            <option value="doubly">Doubly Linked List</option>
                                            <option value="circular">Circular Linked List</option>
                                        </select>
                                    </div>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{nodes.length} nodes</span>
                                </div>
                                <div className="panel-body">
                                    <div style={{ 
                                        overflowX: "auto", padding: "40px 20px", display: "flex", alignItems: "center", minHeight: 180, 
                                        background: "rgba(0,0,0,0.4)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)",
                                        boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)" 
                                    }} className="thin-scroll">
                                        {nodes.length === 0 ? (
                                            <span style={{ color: "rgba(255,255,255,0.35)", margin: "auto", fontSize: 15 }}>List is empty — insert some nodes!</span>
                                        ) : (
                                            <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "auto" }}>
                                                <span style={{ fontSize: 14, color: "#60a5fa", fontWeight: 800, marginRight: 12 }}>HEAD</span>
                                                {nodes.map((n, i) => (
                                                    <LLNode key={n.id} val={n.val} listType={listType}
                                                        isHead={i === 0} isTail={i === nodes.length - 1}
                                                        isHighlighted={highlighted === n.id} />
                                                ))}
                                            </div>
                                        )}
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
                                        else if (l.includes("---")) className += " log-highlight";
                                        return <div key={i} className={className}>{l}</div>;
                                    })}
                                    <div ref={logEndRef} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="ctrl-panel">
                                <div className="panel-header"><p className="panel-title">Insert Node</p></div>
                                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div className="ctrl-group">
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Value..." value={inputVal} onChange={e => setInputVal(e.target.value)} disabled={isRunning} style={{ flex: 1 }} />
                                        </div>
                                    </div>
                                    <div className="ctrl-group">
                                        <select className="ctrl-select" value={insertType} onChange={e => setInsertType(e.target.value)} disabled={isRunning}>
                                            <option value="head">At Head</option>
                                            <option value="tail">At Tail</option>
                                            <option value="index">At Custom Index</option>
                                        </select>
                                    </div>
                                    {insertType === "index" && (
                                        <div className="ctrl-group">
                                            <input className="ctrl-input" type="number" placeholder="Enter index (0-based)..." value={insertIndex} onChange={e => setInsertIndex(e.target.value)} disabled={isRunning} />
                                        </div>
                                    )}
                                    <button className="btn-primary" onClick={insert} disabled={!inputVal || isRunning}>Insert</button>
                                </div>
                            </div>

                            <div className="ctrl-panel">
                                <div className="panel-header"><p className="panel-title">Delete / Search</p></div>
                                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div className="ctrl-group">
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <select className="ctrl-select" value={deleteType} onChange={e => setDeleteType(e.target.value)} disabled={isRunning} style={{ flex: 1 }}>
                                                <option value="head">Del Head</option>
                                                <option value="tail">Del Tail</option>
                                                <option value="index">Del Index</option>
                                            </select>
                                            <button className="btn-danger" onClick={deleteNode} disabled={isRunning} style={{ flex: "0 0 auto" }}>Delete</button>
                                        </div>
                                    </div>
                                    {deleteType === "index" && (
                                        <div className="ctrl-group">
                                            <input className="ctrl-input" type="number" placeholder="Index to delete..." value={deleteIndex} onChange={e => setDeleteIndex(e.target.value)} disabled={isRunning} />
                                        </div>
                                    )}
                                    <div className="ctrl-group" style={{ marginTop: 8 }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Search val..." value={searchVal} onChange={e => setSearchVal(e.target.value)} disabled={isRunning} style={{ flex: 1 }} />
                                            <button className="btn-secondary" onClick={search} disabled={!searchVal || isRunning} style={{ flex: "0 0 auto", padding: "10px 14px" }}>🔍</button>
                                        </div>
                                    </div>
                                    <div className="btn-row" style={{ marginTop: 8 }}>
                                        <button className="btn-secondary" onClick={reverse} disabled={isRunning}>↔ Reverse List</button>
                                        <button className="btn-secondary" onClick={reset} disabled={isRunning}>↺ Reset</button>
                                    </div>
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
                                Enter your own values to build a custom linked list and analyze its memory layout and structure.
                            </p>
                            
                            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="ctrl-label" style={{ fontSize: 13, marginBottom: 8 }}>Select List Type</label>
                                    <select className="ctrl-select" style={{ fontSize: 16, padding: "14px 18px" }} value={tryYourselfType} onChange={e => setTryYourselfType(e.target.value)}>
                                        <option value="singly">Singly Linked List</option>
                                        <option value="doubly">Doubly Linked List</option>
                                        <option value="circular">Circular Linked List</option>
                                    </select>
                                </div>
                            </div>
                            
                            <label className="ctrl-label" style={{ fontSize: 13, marginBottom: 8 }}>Enter values (comma or arrow separated)</label>
                            <input className="ctrl-input" placeholder="e.g. 5, 10, 15, 20" value={userInput}
                                onChange={e => setUserInput(e.target.value)} style={{ margin: "0 0 20px", fontSize: 16, padding: "14px 18px" }} />
                                
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput} style={{ padding: "14px 24px", fontSize: 15 }}>
                                Build & Analyze List →
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
                                            "Memory is allocated one node at a time from the heap (dynamic allocation)",
                                            "Each node: [data field | next pointer] — requires 2 memory locations",
                                            "Pointers (memory addresses) connect nodes — no physical adjacency required",
                                            "Head pointer = strictly stores the address of the first node",
                                            "Null pointer = indicates the absolute end of the list",
                                            "No indexing — must follow pointers one by one (traversal = O(n))"
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
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Linked List Theory</p></div>
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

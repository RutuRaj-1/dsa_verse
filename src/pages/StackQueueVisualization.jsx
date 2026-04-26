import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const MAX_SIZE = 8;

const THEORY = [
    {
        title: "Stack — LIFO (Last In, First Out)",
        content: (
            <div className="theory-rich-content">
                <p>A Stack is a linear data structure following LIFO (Last In, First Out). Think of a stack of plates — you can only add or remove from the top.</p>
                <h4>Key Operations:</h4>
                <ul>
                    <li><code>push(x)</code>: Add element to top — O(1)</li>
                    <li><code>pop()</code>: Remove and return top element — O(1)</li>
                    <li><code>peek() / top()</code>: View top without removing — O(1)</li>
                    <li><code>isEmpty()</code>: Check if stack is empty — O(1)</li>
                    <li><code>isFull()</code>: Check if stack is full — O(1)</li>
                </ul>
                <h4>Pseudocode (Array Implementation):</h4>
                <div className="theory-formula">
                    <pre style={{ margin: 0, fontFamily: "monospace", color: "#a78bfa" }}>
{`push(x):
  if top == MAX - 1: return OVERFLOW
  top = top + 1
  stack[top] = x

pop():
  if top == -1: return UNDERFLOW
  x = stack[top]
  top = top - 1
  return x`}
                    </pre>
                </div>
            </div>
        )
    },
    {
        title: "Queue — FIFO (First In, First Out)",
        content: (
            <div className="theory-rich-content">
                <p>A Queue follows FIFO (First In, First Out). Like a ticket line — first person in gets served first.</p>
                <h4>Key Operations:</h4>
                <ul>
                    <li><code>enqueue(x)</code>: Add to rear — O(1)</li>
                    <li><code>dequeue()</code>: Remove from front — O(1)</li>
                    <li><code>front() / peek()</code>: View front element — O(1)</li>
                </ul>
                <h4>Pseudocode (Array Implementation):</h4>
                <div className="theory-formula">
                    <pre style={{ margin: 0, fontFamily: "monospace", color: "#a78bfa" }}>
{`enqueue(x):
  if rear == MAX - 1: return OVERFLOW
  if front == -1: front = 0
  rear = rear + 1
  queue[rear] = x

dequeue():
  if front == -1 or front > rear: return UNDERFLOW
  x = queue[front]
  front = front + 1
  return x`}
                    </pre>
                </div>
            </div>
        )
    },
    {
        title: "Priority Queue",
        content: (
            <div className="theory-rich-content">
                <p>A Priority Queue is a special type of queue where each element is associated with a priority value. Elements are served based on their priority.</p>
                <ul>
                    <li><strong>Ascending PQ:</strong> Lower priority number = served first (e.g., 1 is higher priority than 5)</li>
                    <li><strong>Descending PQ:</strong> Higher priority number = served first</li>
                </ul>
                <h4>Implementations & Complexity:</h4>
                <table className="theory-table">
                    <thead><tr><th>Data Structure</th><th>Enqueue</th><th>Dequeue</th></tr></thead>
                    <tbody>
                        <tr><td>Unsorted Array</td><td>O(1)</td><td>O(n)</td></tr>
                        <tr><td>Sorted Array</td><td>O(n)</td><td>O(1)</td></tr>
                        <tr><td>Binary Heap (Best)</td><td>O(log n)</td><td>O(log n)</td></tr>
                    </tbody>
                </table>
            </div>
        )
    },
    {
        title: "Double Ended Queue (Deque)",
        content: (
            <div className="theory-rich-content">
                <p>A Deque (Double Ended Queue) allows insertion and deletion at both ends (Front and Rear).</p>
                <h4>Key Operations:</h4>
                <ul>
                    <li><code>insertFront(x)</code>, <code>insertRear(x)</code></li>
                    <li><code>deleteFront()</code>, <code>deleteRear()</code></li>
                </ul>
                <h4>Types of Deque:</h4>
                <ul>
                    <li><strong>Input-Restricted:</strong> Insertion only at rear, deletion at both ends.</li>
                    <li><strong>Output-Restricted:</strong> Deletion only at front, insertion at both ends.</li>
                </ul>
                <p>Commonly used in sliding window problems and implementing both stacks and queues.</p>
            </div>
        )
    }
];

function StackViz({ stack }) {
    return (
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4, alignItems: "center", minHeight: 200 }}>
            {stack.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, padding: 20 }}>Stack is empty</div>
            )}
            {stack.map((v, i) => (
                <div key={i} style={{
                    width: 160, padding: "10px 20px", textAlign: "center",
                    background: i === stack.length - 1 ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.06)",
                    border: `1.5px solid ${i === stack.length - 1 ? "#60a5fa" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: 8, fontWeight: 700, fontSize: 16, color: "#f1f5f9",
                    position: "relative"
                }}>
                    {v}
                    {i === stack.length - 1 && (
                        <span style={{ position: "absolute", right: -50, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>← TOP</span>
                    )}
                </div>
            ))}
            <div style={{ width: 180, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 4 }}></div>
        </div>
    );
}

function QueueViz({ queue, mode }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", padding: "20px 10px", minHeight: 120 }}>
            {queue.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: "auto" }}>Queue is empty</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {queue.length > 0 && <span style={{ fontSize: 11, color: "#34d399", fontWeight: 800, marginRight: 4 }}>FRONT</span>}
                {queue.map((item, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                            width: mode === 'pq' ? 64 : 52, height: 52, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            background: i === 0 ? "rgba(52,211,153,0.3)" : i === queue.length - 1 ? "rgba(251,146,60,0.3)" : "rgba(255,255,255,0.07)",
                            border: `1.5px solid ${i === 0 ? "#34d399" : i === queue.length - 1 ? "#fb923c" : "rgba(255,255,255,0.15)"}`,
                            borderRadius: 8, fontWeight: 700, fontSize: 15, color: "#f1f5f9"
                        }}>
                            {item.val}
                        </div>
                        {mode === 'pq' && (
                            <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>P: {item.p}</span>
                        )}
                    </div>
                ))}
                {queue.length > 0 && <span style={{ fontSize: 11, color: "#fb923c", fontWeight: 800, marginLeft: 4 }}>REAR</span>}
            </div>
        </div>
    );
}

function InfoBox({ label, value, color = "#60a5fa" }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "10px 16px", display: "flex", flexDirection: "column", alignItems: "center",
            flex: "1 1 calc(25% - 10px)", minWidth: 100
        }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{label}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: color }}>{value}</span>
        </div>
    );
}

export default function StackQueueVisualization() {
    const [stack, setStack] = useState([10, 20, 30]);
    const [queue, setQueue] = useState([{val: 5, p: 1}, {val: 15, p: 2}, {val: 25, p: 3}]);
    
    const [inputVal, setInputVal] = useState("");
    const [inputPriority, setInputPriority] = useState("");
    
    const [msg, setMsg] = useState("");
    const [activeTab, setActiveTab] = useState("visualizer");
    const [mode, setMode] = useState("stack"); // "stack" | "queue" | "pq" | "deque"
    const [openSection, setOpenSection] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [inputSteps, setInputSteps] = useState([]);
    
    const [log, setLog] = useState(["Execution log initialized. Select an operation."]);
    const logEndRef = useRef(null);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView();
    }, [log]);

    function showMsg(m) { 
        setMsg(m); 
        setLog(p => [...p, m]);
        setTimeout(() => setMsg(""), 2500); 
    }

    // --- STACK ---
    function stackPush() {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        if (stack.length >= MAX_SIZE) return showMsg("⚠️ Stack is Full (Overflow)");
        setStack(p => [...p, v]); setInputVal("");
        showMsg(`Pushed ${v} onto stack`);
    }

    function stackPop() {
        if (!stack.length) return showMsg("⚠️ Stack is Empty (Underflow)");
        const top = stack[stack.length - 1];
        setStack(p => p.slice(0, -1));
        showMsg(`Popped ${top} from stack`);
    }

    // --- SIMPLE QUEUE ---
    function enqueue() {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        if (queue.length >= MAX_SIZE) return showMsg("⚠️ Queue is Full (Overflow)");
        setQueue(p => [...p, {val: v, p: 0}]); setInputVal("");
        showMsg(`Enqueued ${v} at rear`);
    }

    function dequeue() {
        if (!queue.length) return showMsg("⚠️ Queue is Empty (Underflow)");
        const front = queue[0];
        setQueue(p => p.slice(1));
        showMsg(`Dequeued ${front.val} from front`);
    }

    // --- PRIORITY QUEUE ---
    function pqEnqueue() {
        const v = parseInt(inputVal);
        const p = parseInt(inputPriority) || 1; // Default priority 1
        if (isNaN(v)) return;
        if (queue.length >= MAX_SIZE) return showMsg("⚠️ PQ is Full");
        
        let newQ = [...queue, {val: v, p: p}];
        // Sort ascending priority (lower number = served first)
        newQ.sort((a, b) => a.p - b.p);
        
        setQueue(newQ);
        setInputVal(""); setInputPriority("");
        showMsg(`Inserted ${v} with Priority ${p}`);
    }

    // --- DEQUE ---
    function dequeInsertFront() {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        if (queue.length >= MAX_SIZE) return showMsg("⚠️ Deque is Full");
        setQueue(p => [{val: v, p: 0}, ...p]); setInputVal("");
        showMsg(`Inserted ${v} at Front`);
    }
    
    function dequeInsertRear() { enqueue(); } // Same as enqueue
    
    function dequeDeleteFront() { dequeue(); } // Same as dequeue
    
    function dequeDeleteRear() {
        if (!queue.length) return showMsg("⚠️ Deque is Empty");
        const rear = queue[queue.length - 1];
        setQueue(p => p.slice(0, -1));
        showMsg(`Deleted ${rear.val} from Rear`);
    }

    // --- TRY IT YOURSELF ---
    function processUserInput() {
        const nums = userInput.split(/[s,]+/).map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        
        let steps = [];
        if (mode === "stack") {
            setStack(nums.slice(0, MAX_SIZE));
            steps = [
                `You push ${nums.join(", ")} onto the stack one by one`,
                `Stack after all pushes: bottom [ ${nums.join(", ")} ] top`,
                `TOP of stack = ${nums[nums.length - 1]} (last inserted, first to be popped)`,
                `LIFO: Last In First Out — like a stack of books`
            ];
        } else {
            setQueue(nums.slice(0, MAX_SIZE).map((v, i) => ({val: v, p: i+1})));
            steps = [
                `You inserted ${nums.join(", ")} into the ${mode.toUpperCase()}`,
                `FRONT = ${nums[0]} (first inserted, dequeued first)`,
                `REAR = ${nums[nums.length - 1]}`,
                `Operations are generally O(1) except PQ enqueue which is O(log n) to O(n) depending on implementation`
            ];
        }
        setInputSteps(steps);
        setActiveTab("visualizer");
    }

    return (
        <div className="page-container">
            <style>{`
                .theory-rich-content { color: rgba(255,255,255,0.85); font-size: 15px; line-height: 1.7; }
                .theory-rich-content h4 { color: #60a5fa; margin: 16px 0 8px; font-size: 16px; font-weight: 700; }
                .theory-rich-content ul, .theory-rich-content ol { padding-left: 24px; margin-bottom: 16px; }
                .theory-rich-content li { margin-bottom: 6px; }
                .theory-formula { background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: 8px; margin: 12px 0; border: 1px solid rgba(167,139,250,0.2); }
                .theory-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                .theory-table th, .theory-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .theory-table th { background: rgba(255,255,255,0.05); color: #60a5fa; font-weight: 600; }
                .status-msg { background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 600; font-size: 14px; text-align: center; }
                .log-panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
                .log-header { background: #1e293b; padding: 10px 16px; font-size: 14px; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #334155; }
                .log-content { padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; scroll-behavior: smooth; }
                .log-line { color: #e2e8f0; line-height: 1.5; padding: 4px 8px; border-radius: 4px; transition: background 0.2s; }
                .log-line:hover { background: rgba(255,255,255,0.05); }
                .log-success { color: #34d399; font-weight: 600; background: rgba(52,211,153,0.1); }
                .log-error { color: #f87171; font-weight: 600; background: rgba(248,113,113,0.1); }
                .log-highlight { color: #818cf8; }
                .ctrl-select, .ctrl-input { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #f1f5f9; border-radius: 8px; padding: 10px 14px; outline: none; }
                .ctrl-select option { background: #1e293b; color: #f1f5f9; }
            `}</style>

            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Stacks &amp; Queues</h1>
                <p className="page-subtitle">LIFO stacks, FIFO queues, Priority Queues, and Deques</p>
            </div>

            <div className="page-tabs">
                <button className={`tab-btn ${activeTab === "visualizer" ? "active" : ""}`} onClick={() => setActiveTab("visualizer")}>🔭 Visualizer</button>
                <button className={`tab-btn ${activeTab === "input" ? "active" : ""}`} onClick={() => setActiveTab("input")}>✏️ Try It Yourself</button>
                <button className={`tab-btn ${activeTab === "theory" ? "active" : ""}`} onClick={() => setActiveTab("theory")}>📖 Theory</button>
            </div>

            {activeTab === "visualizer" && (
                <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                        <button className={`tab-btn ${mode === "stack" ? "active" : ""}`} onClick={() => {setMode("stack"); setInputVal("");}}>📚 Stack</button>
                        <button className={`tab-btn ${mode === "queue" ? "active" : ""}`} onClick={() => {setMode("queue"); setInputVal("");}}>🚌 Queue</button>
                        <button className={`tab-btn ${mode === "pq" ? "active" : ""}`} onClick={() => {setMode("pq"); setInputVal("");}}>⭐ Priority Queue</button>
                        <button className={`tab-btn ${mode === "deque" ? "active" : ""}`} onClick={() => {setMode("deque"); setInputVal("");}}>↔️ Deque</button>
                    </div>

                    {msg && <div className="status-msg" style={{ marginBottom: 12 }}>{msg}</div>}

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
                                {mode === "stack" 
                                    ? "Stacks follow Last-In, First-Out (LIFO). Think of it like a stack of plates: you can only add or remove from the very top. This is fundamental for undo mechanisms and recursion."
                                    : mode === "queue"
                                    ? "Queues follow First-In, First-Out (FIFO). Like a real-world waiting line, the first item added is the first one served. Used in task scheduling and IO buffers."
                                    : mode === "pq"
                                    ? "Priority Queues process elements based on an associated priority score rather than order of arrival. In this demo, lower numbers represent higher priority (Min-Heap style)."
                                    : "Deques (Double-Ended Queues) are versatile structures that allow insertion and deletion from both ends, combining properties of both stacks and queues."
                                }
                            </div>

                            <div className="viz-panel">
                                <div className="panel-header">
                                    <p className="panel-title">
                                        {mode === "stack" ? "📚 Stack (LIFO)" : 
                                         mode === "queue" ? "🚌 Simple Queue (FIFO)" :
                                         mode === "pq" ? "⭐ Priority Queue (Ascending)" : "↔️ Double Ended Queue (Deque)"}
                                    </p>
                                </div>
                                <div className="panel-body">
                                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        {mode === "stack" ? <StackViz stack={stack} /> : <QueueViz queue={queue} mode={mode} />}
                                    </div>
                                    
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                                        {mode === "stack" ? (
                                            <>
                                                <InfoBox label="Size / Max" value={`${stack.length} / ${MAX_SIZE}`} />
                                                <InfoBox label="isEmpty()" value={stack.length === 0 ? "True" : "False"} color={stack.length === 0 ? "#34d399" : "#94a3b8"} />
                                                <InfoBox label="isFull()" value={stack.length >= MAX_SIZE ? "True" : "False"} color={stack.length >= MAX_SIZE ? "#ef4444" : "#94a3b8"} />
                                                <InfoBox label="Peek() / Top()" value={stack.length > 0 ? stack[stack.length - 1] : "N/A"} color="#a78bfa" />
                                            </>
                                        ) : (
                                            <>
                                                <InfoBox label="Size / Max" value={`${queue.length} / ${MAX_SIZE}`} />
                                                <InfoBox label="isEmpty()" value={queue.length === 0 ? "True" : "False"} color={queue.length === 0 ? "#34d399" : "#94a3b8"} />
                                                <InfoBox label="isFull()" value={queue.length >= MAX_SIZE ? "True" : "False"} color={queue.length >= MAX_SIZE ? "#ef4444" : "#94a3b8"} />
                                                <InfoBox label={mode === "deque" ? "Front / Rear" : "Peek() / Front()"} 
                                                         value={queue.length > 0 ? (mode === "deque" ? `${queue[0].val} / ${queue[queue.length-1].val}` : queue[0].val) : "N/A"} 
                                                         color="#a78bfa" />
                                            </>
                                        )}
                                    </div>

                                    {inputSteps.length > 0 && (
                                        <div style={{ marginTop: 16 }}>
                                            {inputSteps.map((s, i) => (
                                                <div key={i} className="step-card" style={{ marginBottom: 6, padding: "12px 16px" }}>
                                                    <span className="step-number" style={{ width: 24, height: 24, fontSize: 12 }}>{i + 1}</span>
                                                    <span className="step-text" style={{ fontSize: 14 }}>{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                        return <div key={i} className={className}>{l}</div>;
                                    })}
                                    <div ref={logEndRef} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Controls</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {mode === "stack" ? (
                                    <>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Value..." value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ flex: 1 }} />
                                        </div>
                                        <button className="btn-primary" onClick={stackPush} disabled={!inputVal || stack.length >= MAX_SIZE}>⬆ Push</button>
                                        <button className="btn-danger" onClick={stackPop} disabled={!stack.length}>⬇ Pop</button>
                                    </>
                                ) : mode === "pq" ? (
                                    <>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ flex: 1 }} />
                                            <input className="ctrl-input" type="number" placeholder="Priority" value={inputPriority} onChange={e => setInputPriority(e.target.value)} style={{ flex: 1 }} />
                                        </div>
                                        <button className="btn-primary" onClick={pqEnqueue} disabled={!inputVal || queue.length >= MAX_SIZE}>⭐ Enqueue</button>
                                        <button className="btn-danger" onClick={dequeue} disabled={!queue.length}>↪ Dequeue</button>
                                    </>
                                ) : mode === "deque" ? (
                                    <>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Value..." value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ flex: 1 }} />
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button className="btn-primary" onClick={dequeInsertFront} disabled={!inputVal || queue.length >= MAX_SIZE} style={{ flex: 1 }}>+ Front</button>
                                            <button className="btn-primary" onClick={dequeInsertRear} disabled={!inputVal || queue.length >= MAX_SIZE} style={{ flex: 1 }}>+ Rear</button>
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button className="btn-danger" onClick={dequeDeleteFront} disabled={!queue.length} style={{ flex: 1 }}>- Front</button>
                                            <button className="btn-danger" onClick={dequeDeleteRear} disabled={!queue.length} style={{ flex: 1 }}>- Rear</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className="ctrl-input" type="number" placeholder="Value..." value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ flex: 1 }} />
                                        </div>
                                        <button className="btn-primary" onClick={enqueue} disabled={!inputVal || queue.length >= MAX_SIZE}>↩ Enqueue</button>
                                        <button className="btn-danger" onClick={dequeue} disabled={!queue.length}>↪ Dequeue</button>
                                    </>
                                )}
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
                            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                                <button className={`tab-btn ${mode === "stack" ? "active" : ""}`} onClick={() => setMode("stack")}>📚 Stack</button>
                                <button className={`tab-btn ${mode === "queue" ? "active" : ""}`} onClick={() => setMode("queue")}>🚌 Queue</button>
                                <button className={`tab-btn ${mode === "pq" ? "active" : ""}`} onClick={() => setMode("pq")}>⭐ Priority Queue</button>
                                <button className={`tab-btn ${mode === "deque" ? "active" : ""}`} onClick={() => setMode("deque")}>↔️ Deque</button>
                            </div>
                            <label className="ctrl-label" style={{ fontSize: 13, marginBottom: 8 }}>Enter values (comma-separated)</label>
                            <input className="ctrl-input" placeholder="e.g. 10, 20, 30, 40" value={userInput} onChange={e => setUserInput(e.target.value)} style={{ margin: "0 0 20px", fontSize: 16, padding: "14px 18px" }} />
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput} style={{ padding: "14px 24px", fontSize: 15 }}>
                                Build {mode.toUpperCase()} & Analyze →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card" style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Stack &amp; Queue Theory</p></div>
                    <div className="theory-accordion">
                        {THEORY.map((s, i) => (
                            <div key={i} className="accordion-item">
                                <button className="accordion-trigger" style={{ fontSize: 18, padding: "24px 28px", fontWeight: 700 }} onClick={() => setOpenSection(openSection === i ? null : i)}>
                                    {s.title} 
                                    <span style={{ color: "#60a5fa", transform: openSection === i ? "rotate(180deg)" : "rotate(0)", transition: "transform(0.4s cubic-bezier(0.4, 0, 0.2, 1))" }}>▼</span>
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

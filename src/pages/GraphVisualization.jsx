import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const THEORY = [
    { 
        title: "Graph Fundamentals", 
        content: (
            <div className="theory-rich-content">
                <p>A Graph G = (V, E) consists of a set of vertices (nodes) V and edges (connections) E.</p>
                <h4>Types of Graphs:</h4>
                <ul>
                    <li><strong>Undirected:</strong> Edges have no direction, meaning path goes both ways.</li>
                    <li><strong>Directed (Digraph):</strong> Edges have a specific direction (u → v).</li>
                    <li><strong>Weighted:</strong> Edges have associated costs or weights.</li>
                    <li><strong>Unweighted:</strong> All edges are assumed to have a weight of 1.</li>
                </ul>
                <h4>Representations:</h4>
                <ul>
                    <li><strong>Adjacency Matrix:</strong> A 2D array of size V×V. O(1) edge lookup, O(V²) space.</li>
                    <li><strong>Adjacency List:</strong> Array of lists. O(V + E) space. Best for sparse graphs.</li>
                </ul>
            </div>
        )
    },
    { 
        title: "Breadth-First Search (BFS)", 
        content: (
            <div className="theory-rich-content">
                <p>BFS explores the graph level by level, moving outwards from the starting node.</p>
                <ul>
                    <li><strong>Data Structure:</strong> Queue (FIFO)</li>
                    <li><strong>Time Complexity:</strong> O(V + E)</li>
                    <li><strong>Space Complexity:</strong> O(V)</li>
                </ul>
                <p><strong>Use Cases:</strong> Finding the shortest path in an unweighted graph, web crawling, peer-to-peer networks.</p>
            </div>
        )
    },
    { 
        title: "Depth-First Search (DFS)", 
        content: (
            <div className="theory-rich-content">
                <p>DFS explores as far as possible along each branch before backtracking.</p>
                <ul>
                    <li><strong>Data Structure:</strong> Stack (LIFO) or Recursion</li>
                    <li><strong>Time Complexity:</strong> O(V + E)</li>
                    <li><strong>Space Complexity:</strong> O(V)</li>
                </ul>
                <p><strong>Use Cases:</strong> Cycle detection, topological sorting, solving mazes.</p>
            </div>
        )
    },
    { 
        title: "Shortest Path & Spanning Trees", 
        content: (
            <div className="theory-rich-content">
                <h4>Shortest Path Algorithms:</h4>
                <ul>
                    <li><strong>Dijkstra's:</strong> Single-source, non-negative weights. O((V + E) log V).</li>
                    <li><strong>Bellman-Ford:</strong> Single-source, handles negative weights. O(VE).</li>
                    <li><strong>Floyd-Warshall:</strong> All-pairs shortest path. O(V³).</li>
                </ul>
                <h4>Minimum Spanning Tree (MST):</h4>
                <ul>
                    <li><strong>Kruskal's Algorithm:</strong> Sorts edges, uses Union-Find. O(E log E).</li>
                    <li><strong>Prim's Algorithm:</strong> Greedy, grows the tree from a source. O(E log V).</li>
                </ul>
            </div>
        )
    }
];

const DEFAULT_GRAPH = {
    nodes: [
        { id: 0, x: 240, y: 60 }, { id: 1, x: 100, y: 160 }, { id: 2, x: 380, y: 160 },
        { id: 3, x: 60, y: 280 }, { id: 4, x: 200, y: 280 }, { id: 5, x: 340, y: 280 }
    ],
    edges: [
        { u: 0, v: 1, w: 4 }, { u: 0, v: 2, w: 2 }, { u: 1, v: 3, w: 5 }, { u: 1, v: 4, w: 11 },
        { u: 2, v: 4, w: 3 }, { u: 2, v: 5, w: 12 }, { u: 3, v: 4, w: 1 }, { u: 4, v: 5, w: 7 }
    ]
};

export default function GraphVisualization() {
    const [graph, setGraph] = useState(DEFAULT_GRAPH);
    const [visited, setVisited] = useState([]);
    const [queue, setQueue] = useState([]); // Or Stack for visual cues
    const [activeEdges, setActiveEdges] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    
    const [algo, setAlgo] = useState("bfs");
    const [start, setStart] = useState(0);
    
    const [activeTab, setActiveTab] = useState("visualizer");
    const [openSection, setOpenSection] = useState(null);
    const [userInput, setUserInput] = useState("0-1, 0-2, 1-3, 2-4, 3-4");
    const [inputSteps, setInputSteps] = useState([]);
    
    const [log, setLog] = useState(["Execution log initialized. Select traversal."]);
    const logEndRef = useRef(null);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView();
    }, [log]);

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const { nodes, edges } = graph;

    function addToLog(m) { setLog(p => [...p, m]); }

    function getNeighbors(v) {
        return edges.filter(e => e.u === v || e.v === v)
            .map(e => ({ node: e.u === v ? e.v : e.u, edge: e }));
    }

    async function runBFS() {
        setIsRunning(true);
        const vis = new Set();
        const q = [start]; 
        vis.add(start);
        
        setVisited([start]); 
        setQueue([...q]);
        addToLog(`⚡ Starting BFS from node ${start}`);
        
        while (q.length) {
            const node = q.shift();
            setQueue([...q]);
            addToLog(`Visiting node ${node}`);
            setVisited([...vis]);
            await sleep(700);
            
            for (const { node: nb, edge } of getNeighbors(node)) {
                if (!vis.has(nb)) {
                    vis.add(nb); 
                    q.push(nb);
                    setVisited([...vis]); 
                    setQueue([...q]);
                    setActiveEdges(prev => [...prev, `${edge.u}-${edge.v}`, `${edge.v}-${edge.u}`]);
                    addToLog(`Enqueue ${nb} via edge (${edge.u}-${edge.v})`);
                    await sleep(500);
                }
            }
        }
        addToLog(`✅ BFS complete! Order: ${[...vis].join(" → ")}`);
        setIsRunning(false);
    }

    async function runDFS() {
        setIsRunning(true);
        const vis = new Set();
        addToLog(`⚡ Starting DFS from node ${start}`);
        
        async function dfs(v) {
            vis.add(v); 
            setVisited([...vis]);
            addToLog(`Visiting Node ${v}`);
            await sleep(700);
            
            for (const { node: nb, edge } of getNeighbors(v)) {
                if (!vis.has(nb)) {
                    setActiveEdges(prev => [...prev, `${edge.u}-${edge.v}`, `${edge.v}-${edge.u}`]);
                    await dfs(nb);
                }
            }
        }
        
        await dfs(start);
        addToLog(`✅ DFS complete! Order: ${[...vis].join(" → ")}`);
        setIsRunning(false);
    }

    function reset() {
        setVisited([]); 
        setQueue([]); 
        setActiveEdges([]); 
        setIsRunning(false); 
        setInputSteps([]);
        setLog(["Execution log initialized.", "Graph traversal reset."]);
    }

    function processUserInput() {
        // Parse input format: "0-1, 0-2, 1-3"
        const pairs = userInput.split(/[,]+/).map(s => s.trim()).filter(s => s);
        const parsedEdges = [];
        const uniqueNodes = new Set();
        
        pairs.forEach(pair => {
            const parts = pair.split("-").map(Number);
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                parsedEdges.push({ u: parts[0], v: parts[1], w: 1 });
                uniqueNodes.add(parts[0]);
                uniqueNodes.add(parts[1]);
            }
        });

        if (!parsedEdges.length || !uniqueNodes.size) {
            addToLog("❌ Invalid input format. Use '0-1, 1-2'");
            return;
        }

        const nodesArr = Array.from(uniqueNodes).sort((a,b) => a-b);
        const totalNodes = nodesArr.length;
        
        // Arrange in a circle
        const cx = 240, cy = 160, r = 100;
        const generatedNodes = nodesArr.map((id, index) => {
            const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
            return {
                id,
                x: cx + r * Math.cos(angle),
                y: cy + r * Math.sin(angle)
            };
        });

        setGraph({ nodes: generatedNodes, edges: parsedEdges });
        setStart(nodesArr[0]); // Default start to the first node
        reset();
        addToLog(`✅ Built custom graph with ${generatedNodes.length} nodes and ${parsedEdges.length} edges.`);
        
        setInputSteps([
            `Parsed ${parsedEdges.length} edges successfully.`,
            `Graph arranged in a circular layout.`,
            `You can now run BFS or DFS traversal from the Visualizer.`
        ]);
        setActiveTab("visualizer");
    }

    const edgeColor = (e) => {
        const key = `${e.u}-${e.v}`;
        const rev = `${e.v}-${e.u}`;
        return activeEdges.includes(key) || activeEdges.includes(rev) ? "#60a5fa" : "rgba(255,255,255,0.2)";
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <Link to="/" className="back-btn">← Back to Topics</Link>
                <h1 className="page-title">Graph Algorithms</h1>
                <p className="page-subtitle">BFS, DFS traversal — Dijkstra, Kruskal's, and Network Representations</p>
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
                                <p className="panel-title">Graph Layout ({nodes.length} nodes, {edges.length} edges)</p>
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Visited: {visited.length}</span>
                            </div>
                            <div className="panel-body">
                                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 10, minHeight: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <svg width="100%" viewBox="0 0 480 330" style={{ maxHeight: 300 }}>
                                        {edges.map((e, i) => {
                                            const u = nodes.find(n => n.id === e.u);
                                            const v = nodes.find(n => n.id === e.v);
                                            if (!u || !v) return null;
                                            const mx = (u.x + v.x) / 2;
                                            const my = (u.y + v.y) / 2;
                                            const key = `${e.u}-${e.v}`;
                                            const rev = `${e.v}-${e.u}`;
                                            const isActive = activeEdges.includes(key) || activeEdges.includes(rev);
                                            
                                            return <g key={i}>
                                                <line x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={edgeColor(e)} strokeWidth={isActive ? 2.5 : 1.5} strokeDasharray={isActive ? "none" : "4,3"} style={{ transition: "all 0.3s" }} />
                                                <text x={mx} y={my - 5} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.45)">{e.w}</text>
                                            </g>;
                                        })}
                                        {nodes.map(n => {
                                            const isVisited = visited.includes(n.id);
                                            const isQ = queue.includes(n.id);
                                            return <g key={n.id}>
                                                <circle cx={n.x} cy={n.y} r={22} fill={isVisited ? "rgba(59,130,246,0.4)" : isQ ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"} stroke={isVisited ? "#3b82f6" : isQ ? "#fbbf24" : n.id === start ? "#a78bfa" : "rgba(255,255,255,0.2)"} strokeWidth={isVisited || isQ ? 2.5 : 1.5} style={{ transition: "all 0.3s" }} />
                                                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={13} fontWeight="700" fill="#f1f5f9">{n.id}</text>
                                            </g>;
                                        })}
                                    </svg>
                                </div>
                                {queue.length > 0 && <div style={{ marginTop: 8, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                                    <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 700 }}>Queue: [{queue.join(", ")}]</span>
                                </div>}
                                {inputSteps.length > 0 && <div style={{ marginTop: 12 }}>{inputSteps.map((s, i) => <div key={i} className="step-card" style={{ marginBottom: 6, padding: "12px 16px" }}><span className="step-number" style={{ width: 24, height: 24, fontSize: 12 }}>{i + 1}</span><span className="step-text" style={{ fontSize: 14 }}>{s}</span></div>)}</div>}
                            </div>
                        </div>

                        {/* Permanent Execution Log below Visualizer */}
                        <div className="log-panel" style={{ height: 200 }}>
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
                            <div className="panel-header"><p className="panel-title">Traversal Algorithms</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <label className="ctrl-label" style={{ marginBottom: -8 }}>Algorithm</label>
                                <select className="ctrl-input" value={algo} onChange={e => setAlgo(e.target.value)} disabled={isRunning}>
                                    <option value="bfs">Breadth-First Search (BFS)</option>
                                    <option value="dfs">Depth-First Search (DFS)</option>
                                </select>
                                
                                <label className="ctrl-label" style={{ marginBottom: -8 }}>Start Node</label>
                                <select className="ctrl-input" value={start} onChange={e => { setStart(parseInt(e.target.value)); reset(); }} disabled={isRunning}>
                                    {nodes.map(n => <option key={n.id} value={n.id}>Node {n.id}</option>)}
                                </select>
                                
                                <button className="btn-primary" onClick={algo === "bfs" ? runBFS : runDFS} disabled={isRunning} style={{ marginTop: 8 }}>
                                    {isRunning ? "Running..." : "▶ Run Traversal"}
                                </button>
                                <button className="btn-secondary" onClick={reset} disabled={isRunning}>↺ Reset State</button>
                            </div>
                        </div>
                        
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Legend</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[{ color: "#3b82f6", label: "Visited Node" }, { color: "#fbbf24", label: "In Queue (BFS)" }, { color: "#a78bfa", label: "Start Node" }, { color: "rgba(255,255,255,0.2)", label: "Unvisited" }].map(l => (
                                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: l.color }}></div>
                                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "input" && (
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div className="viz-panel">
                        <div className="panel-header"><p className="panel-title">✏️ Build Custom Graph</p></div>
                        <div className="panel-body" style={{ padding: "32px" }}>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16 }}>
                                Enter graph edges as hyphen-separated pairs, separated by commas. 
                                The visualizer will arrange them in a circle layout.
                            </p>
                            <label className="ctrl-label" style={{ fontSize: 13, marginBottom: 8 }}>Edges (u-v format)</label>
                            <input 
                                className="ctrl-input" 
                                placeholder="e.g. 0-1, 1-2, 2-3, 3-0" 
                                value={userInput} 
                                onChange={e => setUserInput(e.target.value)} 
                                style={{ margin: "0 0 20px", fontSize: 16, padding: "14px 18px" }} 
                            />
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput} style={{ padding: "14px 24px", fontSize: 15 }}>
                                Generate Graph & Layout →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card" style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Graph Theory</p></div>
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

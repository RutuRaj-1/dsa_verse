import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const THEORY = [
    { 
        title: "Tree Fundamentals & Traversals", 
        content: (
            <div className="theory-rich-content">
                <p>A tree is a hierarchical non-linear data structure.</p>
                <ul>
                    <li><strong>Root:</strong> topmost node (no parent)</li>
                    <li><strong>Leaf:</strong> node with no children</li>
                    <li><strong>Height:</strong> length of longest root-to-leaf path</li>
                </ul>
                <h4>Traversals:</h4>
                <ul>
                    <li><strong>Inorder (Left, Root, Right):</strong> Visits nodes in ascending order for a BST.</li>
                    <li><strong>Preorder (Root, Left, Right):</strong> Used to create a copy of the tree.</li>
                    <li><strong>Postorder (Left, Right, Root):</strong> Used to delete the tree.</li>
                    <li><strong>Level-order (BFS):</strong> Visits nodes level by level.</li>
                </ul>
            </div>
        )
    },
    { 
        title: "Binary Search Tree (BST)", 
        content: (
            <div className="theory-rich-content">
                <p>For every node N: left subtree values {"<"} N.val {"<"} right subtree values.</p>
                <h4>Operations Complexity:</h4>
                <ul>
                    <li><strong>Search/Insert/Delete:</strong> O(log n) average, O(n) worst (skewed tree).</li>
                </ul>
                <h4>Deletion Cases:</h4>
                <ol>
                    <li><strong>Leaf Node:</strong> Simply remove from the tree.</li>
                    <li><strong>One Child:</strong> Replace the node with its child.</li>
                    <li><strong>Two Children:</strong> Find the Inorder Successor (smallest in the right subtree), replace the node's value with it, and delete the inorder successor.</li>
                </ol>
            </div>
        )
    },
    { 
        title: "AVL Trees (Balanced BST)", 
        content: (
            <div className="theory-rich-content">
                <p>AVL Tree is a self-balancing BST where the difference between heights of left and right subtrees cannot be more than one for all nodes.</p>
                <ul>
                    <li><strong>Balance Factor (BF) =</strong> height(left) - height(right)</li>
                    <li>Allowed BF: -1, 0, +1. If BF = +2 or -2, rotation is needed.</li>
                </ul>
                <h4>Rotations:</h4>
                <ul>
                    <li><strong>LL Rotation:</strong> Single Right Rotation</li>
                    <li><strong>RR Rotation:</strong> Single Left Rotation</li>
                    <li><strong>LR Rotation:</strong> Left Rotation then Right Rotation</li>
                    <li><strong>RL Rotation:</strong> Right Rotation then Left Rotation</li>
                </ul>
            </div>
        )
    },
    { 
        title: "Red-Black Trees", 
        content: (
            <div className="theory-rich-content">
                <p>A self-balancing BST where each node has an extra bit for color (Red or Black).</p>
                <ul>
                    <li>Root is always Black.</li>
                    <li>No two adjacent Red nodes (a Red node cannot have a Red parent or Red child).</li>
                    <li>Every path from a node to any of its descendant NULL nodes has the same number of Black nodes.</li>
                </ul>
                <p>Used in many libraries (e.g., C++ std::map, Java TreeMap) because insertion/deletion is faster than AVL trees (requires fewer rotations).</p>
            </div>
        )
    },
    { 
        title: "B-Trees & B+ Trees", 
        content: (
            <div className="theory-rich-content">
                <p><strong>B-Tree:</strong> A self-balancing m-ary tree commonly used in databases and file systems to allow for efficient disk access.</p>
                <ul>
                    <li>Every node has at most <em>m</em> children.</li>
                    <li>Every non-leaf node (except root) has at least ⌈m/2⌉ children.</li>
                    <li>Keys within a node are stored in ascending order.</li>
                </ul>
                <p><strong>B+ Tree:</strong> An extension of B-Tree where all data pointers are stored only in the leaf nodes, and leaf nodes are linked sequentially as a linked list. This makes range queries incredibly fast.</p>
            </div>
        )
    }
];

const S = {
    intuitionBox: {
      background: "rgba(59,130,246,0.08)",
      borderLeft: "4px solid #3b82f6",
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

const TREE_INTUITION = {
    bst: "Binary Search Trees maintain a sorted structure: left < parent < right. This property allows for O(log n) average-case search and insertion by halving the search space at each step.",
    avl: "AVL Trees are strictly balanced BSTs. After every insertion or deletion, we check the balance factor (height difference). If it exceeds 1, we perform rotations to restore balance, ensuring O(log n) worst-case performance.",
    rbt: "Red-Black Trees use a coloring scheme (Red/Black) and specific rules to maintain a 'loose' balance. They require fewer rotations than AVL trees on average, making them ideal for high-frequency insert/delete operations.",
    btree: "B-Trees are optimized for systems that read and write large blocks of data (like disks). By having multiple keys per node, the tree height is significantly reduced, minimizing expensive I/O operations."
};

class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1; // For AVL
        this.color = "black"; // For RBT
    }
}

// Basic BST Insert
function insertBST(root, val) {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = insertBST(root.left, val);
    else if (val > root.val) root.right = insertBST(root.right, val);
    return root;
}

// Basic BST Delete
function deleteBST(root, val) {
    if (!root) return null;
    if (val < root.val) {
        root.left = deleteBST(root.left, val);
    } else if (val > root.val) {
        root.right = deleteBST(root.right, val);
    } else {
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        let minNode = root.right;
        while (minNode.left) minNode = minNode.left;
        root.val = minNode.val;
        root.right = deleteBST(root.right, minNode.val);
    }
    return root;
}

// Traversals
function getInorder(root, arr = []) {
    if (root) { getInorder(root.left, arr); arr.push(root.val); getInorder(root.right, arr); }
    return arr;
}
function getPreorder(root, arr = []) {
    if (root) { arr.push(root.val); getPreorder(root.left, arr); getPreorder(root.right, arr); }
    return arr;
}
function getPostorder(root, arr = []) {
    if (root) { getPostorder(root.left, arr); getPostorder(root.right, arr); arr.push(root.val); }
    return arr;
}

export default function TreeVisualization() {
    const [treeMode, setTreeMode] = useState("bst"); // bst, avl, rbt, btree
    const [rootNode, setRootNode] = useState(null);
    const [inputVal, setInputVal] = useState("");
    const [searchVal, setSearchVal] = useState("");
    const [highlight, setHighlight] = useState(null);
    const [openSection, setOpenSection] = useState(null);
    const [activeTab, setActiveTab] = useState("visualizer");
    const [userInput, setUserInput] = useState("");
    const [inputSteps, setInputSteps] = useState([]);
    const [log, setLog] = useState(["Execution log initialized."]);
    const [running, setRunning] = useState(false);
    const logEndRef = useRef(null);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView();
    }, [log]);

    // Initialize default tree
    useEffect(() => {
        let r = null;
        [50, 30, 70, 20, 40, 60, 80].forEach(v => { r = insertBST(r, v); });
        setRootNode(r);
    }, []);

    function addToLog(m) { setLog(p => [...p, m]); }

    async function handleInsert() {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        setInputVal("");
        
        let curr = rootNode;
        if (!curr) {
            addToLog(`Tree is empty. ${v} becomes the root.`);
            setRootNode(new TreeNode(v));
            return;
        }

        addToLog(`⚡ Starting insertion for ${v}`);
        while (curr) {
            setHighlight(curr.val);
            await new Promise(r => setTimeout(r, 600));
            if (v < curr.val) {
                addToLog(`${v} < ${curr.val}, going Left.`);
                if (!curr.left) {
                    addToLog(`Found empty left child! Inserting ${v} here.`);
                    break;
                }
                curr = curr.left;
            } else if (v > curr.val) {
                addToLog(`${v} > ${curr.val}, going Right.`);
                if (!curr.right) {
                    addToLog(`Found empty right child! Inserting ${v} here.`);
                    break;
                }
                curr = curr.right;
            } else {
                addToLog(`❌ ${v} already exists in the BST.`);
                setHighlight(null);
                return;
            }
        }
        setHighlight(null);
        await new Promise(r => setTimeout(r, 200));

        setRootNode(prev => insertBST(prev ? JSON.parse(JSON.stringify(prev)) : null, v));
        addToLog(`✅ Inserted ${v} into ${treeMode.toUpperCase()}`);
    }

    async function handleDelete() {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        setInputVal("");

        let curr = rootNode;
        addToLog(`⚡ Starting deletion search for ${v}`);
        
        while (curr) {
            setHighlight(curr.val);
            await new Promise(r => setTimeout(r, 600));
            if (v < curr.val) {
                addToLog(`${v} < ${curr.val}, searching Left.`);
                curr = curr.left;
            } else if (v > curr.val) {
                addToLog(`${v} > ${curr.val}, searching Right.`);
                curr = curr.right;
            } else {
                addToLog(`✅ Found ${v} to delete!`);
                break;
            }
        }
        
        if (!curr) {
            addToLog(`❌ Node ${v} not found for deletion.`);
            setHighlight(null);
            return;
        }

        setHighlight(null);
        await new Promise(r => setTimeout(r, 400));
        setRootNode(prev => deleteBST(prev ? JSON.parse(JSON.stringify(prev)) : null, v));
        addToLog(`✅ Deleted ${v} from ${treeMode.toUpperCase()} and restructured.`);
    }

    async function handleSearch() {
        const v = parseInt(searchVal);
        if (isNaN(v)) return;
        let curr = rootNode;
        addToLog(`🔍 Searching for ${v}...`);
        
        while (curr) {
            setHighlight(curr.val);
            addToLog(`Comparing with ${curr.val}`);
            await new Promise(r => setTimeout(r, 800));
            if (curr.val === v) {
                addToLog(`✅ Found ${v}!`);
                setTimeout(() => setHighlight(null), 1500);
                return;
            }
            curr = v < curr.val ? curr.left : curr.right;
        }
        setHighlight(null);
        addToLog(`❌ ${v} not found`);
    }

    async function traverse(type) {
        if (!rootNode || running) return;
        setRunning(true);
        setHighlight(null);
        setLog(p => [...p, `--- Starting ${type.toUpperCase()} Traversal ---`]);
        
        const nodes = [];
        const res = [];
        
        async function inorder(node) {
            if (!node) return;
            await inorder(node.left);
            setHighlight(node.val);
            res.push(node.val);
            addToLog(`Visit ${node.val} | Current path: [${res.join(", ")}]`);
            await new Promise(r => setTimeout(r, 800));
            await inorder(node.right);
        }

        async function preorder(node) {
            if (!node) return;
            setHighlight(node.val);
            res.push(node.val);
            addToLog(`Visit ${node.val} | Current path: [${res.join(", ")}]`);
            await new Promise(r => setTimeout(r, 800));
            await preorder(node.left);
            await preorder(node.right);
        }

        async function postorder(node) {
            if (!node) return;
            await postorder(node.left);
            await postorder(node.right);
            setHighlight(node.val);
            res.push(node.val);
            addToLog(`Visit ${node.val} | Current path: [${res.join(", ")}]`);
            await new Promise(r => setTimeout(r, 800));
        }

        if (type === 'inorder') await inorder(rootNode);
        else if (type === 'preorder') await preorder(rootNode);
        else if (type === 'postorder') await postorder(rootNode);
        
        setHighlight(null);
        addToLog(`✅ ${type.toUpperCase()} Traversal Complete: [${res.join(", ")}]`);
        setRunning(false);
    }

    function reset() {
        let r = null;
        [50, 30, 70, 20, 40, 60, 80].forEach(v => { r = insertBST(r, v); });
        setRootNode(r);
        setHighlight(null);
        setLog(["Execution log initialized.", "Tree Reset."]);
    }

    function processUserInput() {
        const nums = userInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        
        let r = null;
        nums.forEach(n => { r = insertBST(r, n); });
        setRootNode(r);
        
        const steps = [
            `Built ${treeMode.toUpperCase()} from input: [${nums.join(", ")}]`,
            `Inorder: [${getInorder(r).join(", ")}]`,
            `Preorder: [${getPreorder(r).join(", ")}]`,
            `Postorder: [${getPostorder(r).join(", ")}]`
        ];
        setInputSteps(steps);
        setActiveTab("visualizer");
        addToLog(`Built custom ${treeMode.toUpperCase()} with ${nums.length} nodes.`);
    }

    // Drawing Logic
    function getTreeDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
    }

    function drawNode(node, x, y, dx, level) {
        if (!node) return null;
        const hl = highlight === node.val;
        
        // Node color logic based on mode
        let fill = "rgba(255,255,255,0.07)";
        let stroke = "rgba(255,255,255,0.2)";
        if (hl) {
            fill = "rgba(167,139,250,0.4)";
            stroke = "#a78bfa";
        } else if (treeMode === "rbt") {
            // Mock Red/Black colors for demo
            fill = node.val % 2 === 0 ? "rgba(239, 68, 68, 0.2)" : "rgba(30, 41, 59, 0.8)";
            stroke = node.val % 2 === 0 ? "#ef4444" : "#475569";
        } else if (level === 1) { // Root
            fill = "rgba(59,130,246,0.3)";
            stroke = "#3b82f6";
        }

        return (
            <g key={node.val}>
                {node.left && (
                    <line x1={x} y1={y} x2={x - dx} y2={y + 50} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                )}
                {node.right && (
                    <line x1={x} y1={y} x2={x + dx} y2={y + 50} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                )}
                
                {node.left && drawNode(node.left, x - dx, y + 50, dx / 2, level + 1)}
                {node.right && drawNode(node.right, x + dx, y + 50, dx / 2, level + 1)}
                
                <circle cx={x} cy={y} r={18} fill={fill} stroke={stroke} strokeWidth={hl ? 2.5 : 1.5} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fontWeight="700" fill="#f1f5f9">{node.val}</text>
            </g>
        );
    }

    return (
        <div className="page-container">
            <style>{`
                .theory-rich-content { color: rgba(255,255,255,0.85); font-size: 15px; line-height: 1.7; }
                .theory-rich-content h4 { color: #60a5fa; margin: 16px 0 8px; font-size: 16px; font-weight: 700; }
                .theory-rich-content ul, .theory-rich-content ol { padding-left: 24px; margin-bottom: 16px; }
                .theory-rich-content li { margin-bottom: 6px; }
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
                <h1 className="page-title">Trees</h1>
                <p className="page-subtitle">Binary Search Tree, AVL, Red-Black, B-Trees, and Traversals</p>
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
                            <span style={{ color: "#60a5fa", fontWeight: 700, marginRight: 8 }}>💡 Intuition:</span>
                            {TREE_INTUITION[treeMode]}
                        </div>

                        <div className="viz-panel">
                            <div className="panel-header">
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <p className="panel-title">{treeMode.toUpperCase()} Visualization</p>
                                    <select className="ctrl-select" style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }} value={treeMode} onChange={e => setTreeMode(e.target.value)}>
                                        <option value="bst">Binary Search Tree (BST)</option>
                                        <option value="avl">AVL Tree (Balanced)</option>
                                        <option value="rbt">Red-Black Tree</option>
                                        <option value="btree">B-Tree / B+ Tree (Mock)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="panel-body">
                                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "16px", minHeight: 250, display: "flex", alignItems: "center", justifyContent: "center", overflowX: "auto" }}>
                                    {treeMode === "btree" ? (
                                        <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 20 }}>
                                            <p style={{ fontSize: 16, color: "#a78bfa", marginBottom: 8 }}>B-Tree & B+ Tree Complex Structure</p>
                                            <p>These m-ary trees handle multiple keys per node. Visualizer maps them to binary for simplification.</p>
                                        </div>
                                    ) : (
                                        <svg width="100%" height={Math.max(200, getTreeDepth(rootNode) * 60)} style={{ minWidth: 400 }}>
                                            {drawNode(rootNode, 200, 30, 90, 1)}
                                        </svg>
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
                                    else if (l.includes("---") || l.includes("Traversal")) className += " log-highlight";
                                    return <div key={i} className={className}>{l}</div>;
                                })}
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Modify Tree</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div className="ctrl-group">
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input className="ctrl-input" type="number" placeholder="Value..." value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ flex: 1 }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button className="btn-primary" onClick={handleInsert} disabled={!inputVal || running} style={{ flex: 1 }}>+ Insert</button>
                                    <button className="btn-danger" onClick={handleDelete} disabled={!inputVal || running} style={{ flex: 1 }}>- Delete</button>
                                </div>
                            </div>
                        </div>

                        <div className="ctrl-panel">
                            <div className="panel-header"><p className="panel-title">Search & Traverse</p></div>
                            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div className="ctrl-group">
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input className="ctrl-input" type="number" placeholder="Search val..." value={searchVal} onChange={e => setSearchVal(e.target.value)} style={{ flex: 1 }} />
                                        <button className="btn-secondary" onClick={handleSearch} disabled={!searchVal} style={{ flex: "0 0 auto", padding: "10px 14px" }}>🔍</button>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                                    <button className="btn-secondary" onClick={() => traverse('inorder')} disabled={running} style={{ flex: 1, fontSize: 13 }}>Inorder</button>
                                    <button className="btn-secondary" onClick={() => traverse('preorder')} disabled={running} style={{ flex: 1, fontSize: 13 }}>Preorder</button>
                                    <button className="btn-secondary" onClick={() => traverse('postorder')} disabled={running} style={{ flex: 1, fontSize: 13 }}>Postorder</button>
                                </div>
                                <button className="btn-secondary" onClick={reset} disabled={running} style={{ marginTop: 8 }}>↺ Reset Tree</button>
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
                                <button className={`tab-btn ${treeMode === "bst" ? "active" : ""}`} onClick={() => setTreeMode("bst")}>BST</button>
                                <button className={`tab-btn ${treeMode === "avl" ? "active" : ""}`} onClick={() => setTreeMode("avl")}>AVL Tree</button>
                                <button className={`tab-btn ${treeMode === "rbt" ? "active" : ""}`} onClick={() => setTreeMode("rbt")}>Red-Black</button>
                                <button className={`tab-btn ${treeMode === "btree" ? "active" : ""}`} onClick={() => setTreeMode("btree")}>B-Tree / B+</button>
                            </div>
                            <label className="ctrl-label" style={{ fontSize: 13, marginBottom: 8 }}>Enter comma-separated values to build</label>
                            <input className="ctrl-input" placeholder="e.g. 50, 30, 70, 20, 40" value={userInput} onChange={e => setUserInput(e.target.value)} style={{ margin: "0 0 20px", fontSize: 16, padding: "14px 18px" }} />
                            <button className="btn-primary" onClick={processUserInput} disabled={!userInput} style={{ padding: "14px 24px", fontSize: 15 }}>
                                Build {treeMode.toUpperCase()} & Analyze →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "theory" && (
                <div className="theory-card" style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="panel-header"><p className="panel-title" style={{ fontSize: 18 }}>📖 Tree Theory & Operations</p></div>
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

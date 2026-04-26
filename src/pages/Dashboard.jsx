import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const DS_TOPICS = [
    { route: "/array", title: "Arrays", desc: "Operations, searching, sparse matrix, polynomial representation", icon: "🗃️", diff: "Beginner", color: "#3b82f6" },
    { route: "/linked-list", title: "Linked Lists", desc: "Singly, doubly, circular, and generalized linked lists", icon: "🔗", diff: "Beginner", color: "#06b6d4" },
    { route: "/stack-queue", title: "Stacks & Queues", desc: "LIFO/FIFO, circular queue, deque, and priority queue", icon: "📚", diff: "Beginner", color: "#10b981" },
    { route: "/tree", title: "Trees / BST", desc: "BST, AVL, Red-Black, B-Trees, traversals, rotations", icon: "🌳", diff: "Advanced", color: "#f59e0b" },
    { route: "/heap", title: "Heaps", desc: "Min-heap, max-heap, heap sort, Fibonacci heap", icon: "⛰️", diff: "Advanced", color: "#ef4444" },
    { route: "/hashing", title: "Hashing", desc: "Hash tables, collision resolution, load factor, rehashing", icon: "#️⃣", diff: "Intermediate", color: "#8b5cf6" },
    { route: "/graph", title: "Graphs", desc: "BFS, DFS, MST, adjacency matrix and list representations", icon: "🕸️", diff: "Advanced", color: "#ec4899" },
];

const ALGO_TOPICS = [
    { route: "/algorithms", title: "Sorting & Searching", desc: "All comparison and non-comparison based algorithms", icon: "↕️", diff: "Intermediate", color: "#3b82f6" },
    { route: "/algorithms", title: "Divide & Conquer", desc: "Quick sort, merge sort, binary search, recurrences", icon: "✂️", diff: "Intermediate", color: "#06b6d4" },
    { route: "/algorithms", title: "Greedy Algorithms", desc: "Knapsack, job scheduling, Huffman coding, MST", icon: "💡", diff: "Advanced", color: "#10b981" },
    { route: "/algorithms", title: "Dynamic Programming", desc: "0/1 Knapsack, LCS, matrix chain multiplication, TSP", icon: "🧩", diff: "Advanced", color: "#f59e0b" },
    { route: "/algorithms", title: "Graph Algorithms", desc: "Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal", icon: "🗺️", diff: "Advanced", color: "#ef4444" },
    { route: "/algorithms", title: "Backtracking", desc: "N-Queens, subset sum, constraint satisfaction problems", icon: "↩️", diff: "Advanced", color: "#8b5cf6" },
];

const DIFF_COLORS = {
    Beginner: { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
    Intermediate: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.25)" },
    Advanced: { bg: "rgba(239,68,68,0.12)", text: "#ef4444", border: "rgba(239,68,68,0.25)" },
};

function TopicCard({ topic }) {
    const dc = DIFF_COLORS[topic.diff];
    return (
        <Link to={topic.route} className="topic-card">
            <div className="topic-card-header">
                <span className="topic-icon">{topic.icon}</span>
                <span className="topic-badge" style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
                    {topic.diff}
                </span>
            </div>
            <h3 className="topic-title">{topic.title}</h3>
            <p className="topic-desc">{topic.desc}</p>
            <div className="topic-cta">Explore →</div>
        </Link>
    );
}

export default function Dashboard() {
    const { currentUser } = useAuth();
    const firstName = currentUser?.displayName?.split(" ")[0] || "Learner";

    return (
        <div className="main-content">
            <div className="dashboard">
                {/* Hero */}
                <section className="dashboard-hero">
                    <div className="hero-content">
                        <div className="hero-badge">🎓 Complete DSA Learning Platform</div>
                        <h1 className="hero-title">
                            Welcome back,{" "}
                            <span className="hero-name">{firstName}</span>!
                        </h1>
                        <p className="hero-subtitle">
                            Master Data Structures &amp; Algorithms through interactive visualisations,
                            step-by-step explanations, and hands-on problem solving.
                        </p>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">12</span>
                                <span className="stat-label">Units</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Topics</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <span className="stat-number">∞</span>
                                <span className="stat-label">Practice</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="floating-node n1">BST</div>
                        <div className="floating-node n2">O(n)</div>
                        <div className="floating-node n3">DFS</div>
                        <div className="floating-node n4">DP</div>
                        <div className="floating-node n5">BFS</div>
                        <div className="floating-node n6">O(log n)</div>
                    </div>
                </section>

                {/* Data Structures */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">📊 Data Structures</h2>
                            <p className="section-sub">Linear and non-linear structures with interactive visualisers and full theory</p>
                        </div>
                    </div>
                    <div className="topics-grid">
                        {DS_TOPICS.map((t) => <TopicCard key={t.route + t.title} topic={t} />)}
                    </div>
                </section>

                {/* Algorithms */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">⚡ Algorithms</h2>
                            <p className="section-sub">Sorting, searching, greedy, DP, graph algorithms — with pseudocode and examples</p>
                        </div>
                        <Link to="/algorithms" className="section-link">View all →</Link>
                    </div>
                    <div className="topics-grid">
                        {ALGO_TOPICS.map((t) => <TopicCard key={t.title} topic={t} />)}
                    </div>
                </section>

                {/* Practice CTA */}
                <section className="practice-cta">
                    <div className="practice-cta-inner">
                        <h2>🧠 Ready to Practice?</h2>
                        <p>
                            Enter any problem statement and get a complete analysis: ranked approaches,
                            SVG flowchart, pseudocode template — covering all topics in your syllabus.
                        </p>
                        <Link to="/practice" className="cta-btn">Start Practicing →</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

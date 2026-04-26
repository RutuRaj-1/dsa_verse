import { Link } from "react-router-dom";

const DS_TOPICS = [
    { icon: "🗃️", label: "Arrays", route: "/array" },
    { icon: "🔗", label: "Linked Lists", route: "/linked-list" },
    { icon: "📚", label: "Stacks & Queues", route: "/stack-queue" },
    { icon: "🌳", label: "Trees / BST", route: "/tree" },
    { icon: "⛰️", label: "Heaps", route: "/heap" },
    { icon: "#️⃣", label: "Hashing", route: "/hashing" },
    { icon: "🕸️", label: "Graphs", route: "/graph" },
];

const FEATURES = [
    {
        icon: "🔭",
        title: "Interactive Visualizers",
        desc: "Watch data structures come alive — step-by-step animations show exactly what happens at each operation.",
        color: "#3b82f6",
        bg: "rgba(59,130,246,0.12)"
    },
    {
        icon: "✏️",
        title: "Try It Yourself",
        desc: "Enter your own inputs and get personalised step-by-step breakdowns of how the algorithm processes your data.",
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.12)"
    },
    {
        icon: "📖",
        title: "Deep Theory",
        desc: "Complete theory sections covering definitions, complexity analysis, variants, and real-world applications.",
        color: "#06b6d4",
        bg: "rgba(6,182,212,0.12)"
    },
    {
        icon: "⚡",
        title: "Algorithms Reference",
        desc: "20+ algorithms with pseudocode, worked examples, and complexity tables — Sorting, DP, Graphs, and more.",
        color: "#10b981",
        bg: "rgba(16,185,129,0.12)"
    },
    {
        icon: "🧠",
        title: "Problem Analyser",
        desc: "Paste any problem statement and get ranked approaches, an SVG flowchart, and ready-to-use pseudocode.",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)"
    },
    {
        icon: "🔐",
        title: "Secure Accounts",
        desc: "Sign in with Google or email to track your learning progress. Your data is private and always available.",
        color: "#ec4899",
        bg: "rgba(236,72,153,0.12)"
    },
];

export default function LandingPage() {
    return (
        <div className="landing">
            {/* ── Hero ── */}
            <section className="landing-hero">
                {/* Background glows */}
                <div className="hero-glow">
                    <div className="hero-glow-orb glow-1"></div>
                    <div className="hero-glow-orb glow-2"></div>
                    <div className="hero-glow-orb glow-3"></div>
                </div>

                <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
                    <div className="landing-badge">
                        🎓 Complete DSA Learning Platform for VIT
                    </div>

                    <h1 className="landing-title">
                        Master{" "}
                        <span className="landing-title-accent">Data Structures</span>
                        <br />& Algorithms
                    </h1>

                    <p className="landing-subtitle">
                        Interactive visualisations, step-by-step explanations, and hands-on practice
                        for every topic in your DSA syllabus. From arrays to graph algorithms —
                        all in one beautifully designed platform.
                    </p>

                    <div className="landing-ctas">
                        <Link to="/dashboard" className="btn-hero-primary">
                            🚀 Start Learning Free
                        </Link>
                        <Link to="/algorithms" className="btn-hero-secondary">
                            ⚡ Browse Algorithms
                        </Link>
                    </div>

                    {/* Stats bar */}
                    <div className="stats-bar">
                        {[
                            { num: "12", label: "DSA Units" },
                            { num: "20+", label: "Algorithms" },
                            { num: "7", label: "Visualizers" },
                            { num: "100%", label: "Free" },
                        ].map((s) => (
                            <div key={s.label} className="stats-bar-item">
                                <strong>{s.num}</strong>
                                <span>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-features">
                <div className="main-content">
                    <div className="features-heading">
                        <h2>Everything you need to ace DSA</h2>
                        <p>Hand-crafted tools for every learning style</p>
                    </div>

                    <div className="features-grid">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="feature-card">
                                <div className="feature-icon" style={{ background: f.bg }}>
                                    <span style={{ fontSize: 26 }}>{f.icon}</span>
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DS Topics Preview ── */}
            <section className="topics-preview">
                <div className="main-content">
                    <div className="features-heading" style={{ marginBottom: 32 }}>
                        <h2>Explore Every Data Structure</h2>
                        <p>Click any topic to jump straight to its interactive visualizer</p>
                    </div>

                    <div className="topics-row">
                        {DS_TOPICS.map((t) => (
                            <Link key={t.label} to={t.route} className="mini-topic">
                                <span>{t.icon}</span> {t.label}
                            </Link>
                        ))}
                        <Link to="/algorithms" className="mini-topic" style={{ color: "#60a5fa", borderColor: "rgba(96,165,250,0.2)" }}>
                            🗺️ Graph Algorithms
                        </Link>
                        <Link to="/algorithms" className="mini-topic" style={{ color: "#a78bfa", borderColor: "rgba(167,139,250,0.2)" }}>
                            🧩 Dynamic Programming
                        </Link>
                        <Link to="/algorithms" className="mini-topic" style={{ color: "#34d399", borderColor: "rgba(52,211,153,0.2)" }}>
                            💡 Greedy Algorithms
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section style={{ padding: "60px 0 100px" }}>
                <div className="main-content">
                    <div
                        style={{
                            background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.15))",
                            border: "1px solid rgba(139,92,246,0.25)",
                            borderRadius: 28, padding: "64px 40px", textAlign: "center",
                            position: "relative", overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                position: "absolute", width: 300, height: 300,
                                background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent)",
                                borderRadius: "50%", top: "50%", left: "50%",
                                transform: "translate(-50%,-50%)", pointerEvents: "none"
                            }}
                        ></div>
                        <h2
                            style={{
                                fontFamily: "Outfit, sans-serif", fontSize: 36, fontWeight: 900,
                                color: "#f1f5f9", margin: "0 0 14px", position: "relative"
                            }}
                        >
                            Ready to get started?
                        </h2>
                        <p
                            style={{
                                fontSize: 16, color: "rgba(255,255,255,0.55)", margin: "0 auto 36px",
                                maxWidth: 480, lineHeight: 1.7, position: "relative"
                            }}
                        >
                            Create a free account and unlock all visualizers, algorithm references, and the problem analyser instantly.
                        </p>
                        <div
                            style={{
                                display: "flex", gap: 14, justifyContent: "center",
                                flexWrap: "wrap", position: "relative"
                            }}
                        >
                            <Link to="/signup" className="btn-hero-primary">
                                Create Free Account →
                            </Link>
                            <Link to="/login" className="btn-hero-secondary">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="main-content">
                    <p>
                        Built with ❤️ for VIT students · DSA Verse ·{" "}
                        <Link to="/dashboard" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Open App
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}

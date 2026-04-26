import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const DS_LINKS = [
    { label: "Arrays", to: "/array" },
    { label: "Linked Lists", to: "/linked-list" },
    { label: "Stacks & Queues", to: "/stack-queue" },
    { label: "Trees / BST", to: "/tree" },
    { label: "Heaps", to: "/heap" },
    { label: "Hashing", to: "/hashing" },
    { label: "Graphs", to: "/graph" },
];

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dsMenuOpen, setDsMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const initial = currentUser?.displayName?.[0]?.toUpperCase()
        || currentUser?.email?.[0]?.toUpperCase()
        || "U";

    async function handleLogout() {
        try { await logout(); navigate("/"); } catch { }
        setDropdownOpen(false);
    }

    return (
        <>
            <nav className="dsa-navbar">
                <div className="navbar-inner">
                    {/* Brand */}
                    <Link to="/" className="navbar-brand">
                        <div className="navbar-logo-icon">🧠</div>
                        <span className="navbar-brand-text">DSA Verse</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="navbar-links">
                        <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                            🏠 Dashboard
                        </NavLink>

                        {/* Data Structures dropdown */}
                        <div style={{ position: "relative" }}
                            onMouseEnter={() => setDsMenuOpen(true)}
                            onMouseLeave={() => setDsMenuOpen(false)}
                        >
                            <button
                                className="navbar-link"
                                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                            >
                                📊 Data Structures <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
                            </button>
                            {dsMenuOpen && (
                                <div style={{
                                    position: "absolute", top: "100%", left: "50%", transform: "translateX(-45%)",
                                    background: "rgba(8,14,30,0.98)", backdropFilter: "blur(24px)",
                                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
                                    padding: "8px", minWidth: 200,
                                    boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zIndex: 300
                                }}>
                                    {DS_LINKS.map(l => (
                                        <Link key={l.to} to={l.to} className="dropdown-item"
                                            onClick={() => setDsMenuOpen(false)}>
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <NavLink to="/algorithms" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                            ⚡ Algorithms
                        </NavLink>
                        <NavLink to="/practice" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                            🧠 Practice
                        </NavLink>
                    </div>

                    {/* User / Auth */}
                    <div className="navbar-user">
                        {currentUser ? (
                            <div style={{ position: "relative" }}>
                                <div className="user-avatar" onClick={() => setDropdownOpen(o => !o)}>
                                    {initial}
                                </div>
                                {dropdownOpen && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-info">
                                            <p className="dropdown-name">{currentUser.displayName || "User"}</p>
                                            <p className="dropdown-email">{currentUser.email}</p>
                                        </div>
                                        <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            🏠 Dashboard
                                        </Link>
                                        <button className="dropdown-item dropdown-logout danger" onClick={handleLogout}>
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: "flex", gap: 8 }}>
                                <Link to="/login" className="navbar-auth-btn outline">Sign In</Link>
                                <Link to="/signup" className="navbar-auth-btn filled">Sign Up</Link>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button className="navbar-hamburger" onClick={() => setMobileOpen(o => !o)}>
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="navbar-mobile">
                        <NavLink to="/dashboard" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>🏠 Dashboard</NavLink>
                        {DS_LINKS.map(l => (
                            <NavLink key={l.to} to={l.to} className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                                {l.label}
                            </NavLink>
                        ))}
                        <NavLink to="/algorithms" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>⚡ Algorithms</NavLink>
                        <NavLink to="/practice" className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>🧠 Practice</NavLink>
                        {!currentUser && (
                            <>
                                <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Sign In</Link>
                                <Link to="/signup" className="mobile-link" style={{ color: "#60a5fa" }} onClick={() => setMobileOpen(false)}>Sign Up →</Link>
                            </>
                        )}
                        {currentUser && (
                            <button className="mobile-link" style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", textAlign: "left" }} onClick={handleLogout}>
                                🚪 Sign Out
                            </button>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}

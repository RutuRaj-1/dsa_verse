import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import { Toaster } from "sonner";

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ArrayVisualization from "./pages/ArrayVisualization.jsx";
import LinkedListVisualization from "./pages/LinkedListVisualization.jsx";
import StackQueueVisualization from "./pages/StackQueueVisualization.jsx";
import SortingVisualization from "./pages/SortingVisualization.jsx";
import SearchVisualization from "./pages/SearchVisualization.jsx";
import TreeVisualization from "./pages/TreeVisualization.jsx";
import GraphVisualization from "./pages/GraphVisualization.jsx";
import HeapVisualization from "./pages/HeapVisualization.jsx";
import HashingVisualization from "./pages/HashingVisualization.jsx";
import AlgorithmsPage from "./pages/AlgorithmsPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";

import "./index.css";
import "./auth.css";

// Pages that should NOT have the main-content wrapper (full-width pages)
const FULL_WIDTH_PATHS = ["/", "/login", "/signup"];

function PageWrapper({ children }) {
    const location = useLocation();
    const isFullWidth = FULL_WIDTH_PATHS.includes(location.pathname);
    if (isFullWidth) return children;
    return <div className="main-content">{children}</div>;
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Toaster position="top-center" richColors />
                <PageWrapper>
                    <Routes>
                        {/* Landing - full width, public */}
                        <Route path="/" element={<LandingPage />} />

                        {/* Auth - full width */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Dashboard & sections — open to all */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/algorithms" element={<AlgorithmsPage />} />
                        <Route path="/practice" element={<PracticePage />} />

                        {/* Data Structure Visualizers */}
                        <Route path="/array" element={<ArrayVisualization />} />
                        <Route path="/linked-list" element={<LinkedListVisualization />} />
                        <Route path="/stack-queue" element={<StackQueueVisualization />} />
                        <Route path="/sorting" element={<SortingVisualization />} />
                        <Route path="/searching" element={<SearchVisualization />} />
                        <Route path="/tree" element={<TreeVisualization />} />
                        <Route path="/graph" element={<GraphVisualization />} />
                        <Route path="/heap" element={<HeapVisualization />} />
                        <Route path="/hashing" element={<HashingVisualization />} />

                        {/* Catch-all */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </PageWrapper>
            </AuthProvider>
        </Router>
    );
}

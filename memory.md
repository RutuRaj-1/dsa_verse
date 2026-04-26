# 🧠 DSA Verse — Project Memory & Documentation

## 1. Project Summary
**DSA Verse** is a premium, interactive educational platform designed to help students and developers master **Data Structures and Algorithms (DSA)**. It combines high-fidelity visualisations with hands-on "Try It Yourself" modules, deep theoretical foundations, and an AI-powered problem analyser. Built specifically with the **VIT (Vellore Institute of Technology)** syllabus in mind, it provides a comprehensive learning journey from basic arrays to complex graph algorithms and dynamic programming.

---

## 2. Tech Stack
The project leverages a modern, high-performance stack for a seamless user experience:

### Frontend
- **React 18**: Core UI framework for component-based architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first styling for the "Glassmorphism" and "Tech-Noir" aesthetic.
- **Lucide React**: Premium iconography.
- **Sonner**: Sleek, non-blocking toast notifications.
- **React Router Dom (v6)**: Client-side routing for seamless page transitions.
- **Firebase Auth**: Secure user authentication (Email/Password & Google OAuth).
- **Firebase Firestore**: Real-time database for tracking user progress.

### Backend
- **Node.js & Express**: Lightweight API server.
- **Google Generative AI (Gemini 1.5 Pro)**: Advanced AI logic for the "Practice" section's problem analysis.
- **Axios**: HTTP client for frontend-backend communication.
- **Dotenv**: Environment variable management for security.

---

## 3. DSA Logic Used
The platform covers an extensive range of algorithmic paradigms:

- **Linear Data Structures**: Array operations, Linked List (Singly, Doubly, Circular) traversal/insertion/deletion, Stack/Queue (LIFO/FIFO) mechanics.
- **Hierarchical Structures**: 
    - **Trees**: Binary Search Trees (BST), AVL (Self-balancing), Heaps (Max/Min), and B+/B- Trees.
    - **Graphs**: Adjacency List/Matrix representations, DFS/BFS traversals, Dijkstra's Shortest Path, Prim's/Kruskal's MST.
- **Algorithms**:
    - **Sorting**: Bubble, Selection, Insertion, Merge, Quick, Heap Sort.
    - **Searching**: Linear, Binary, Interpolation.
    - **Hashing**: Division, Multiplication, DJB2 methods with collision handling.
    - **Backtracking**: N-Queens (4, 8, 16), Subset Sum.
    - **Divide & Conquer**: Karatsuba Multiplication, Merge Sort, Strassen’s Matrix Multiplication.
    - **Greedy & DP**: Knapsack, Huffman Coding, Fibonacci, LCS.

---

## 4. All Pages Summary
1.  **Landing Page (`/`)**: A high-impact hero section with 3D-like glows, feature cards, and quick-links to topic visualisers.
2.  **Dashboard (`/dashboard`)**: The central hub for authenticated users to see their progress and jump into learning modules.
3.  **Visualiser Pages**: 7+ dedicated pages (e.g., `/tree`, `/graph`, `/heap`) featuring:
    *   **Visualisation Panel**: Canvas/SVG/HTML-based animations of algorithms.
    *   **Execution Log**: Real-time breakdown of internal steps.
    *   **Theory Panel**: Deep-dive into definitions, complexity ($O(n)$), and variants.
4.  **Algorithms Page (`/algorithms`)**: A searchable library of 20+ algorithms with pseudocode and mathematical proofs.
5.  **Practice Page (`/practice`)**: An "AI Problem Analyser" where users paste questions and get step-by-step logic, flowcharts, and ranked approaches.
6.  **Auth Pages (`/login`, `/signup`)**: Minimalist, secure entry points for user accounts.

---

## 5. All Code Summary
### Frontend Structure (`/src`)
- **`/pages`**: Contains the main functional components for each route.
- **`/components`**: Reusable UI elements (Navbar, Button, Cards, Modals).
- **`/contexts`**: State management for Authentication (`AuthContext.jsx`).
- **`/lib`**: Utility functions like `cn` (class merging).
- **`/theory`**: Static data and markdown content for algorithm theory.

### Backend Structure (`/backend`)
- **`server.js`**: The main entry point. Handles CORS, environment variables, and the `/api/analyze` endpoint.
- **Gemini Integration**: Uses a system prompt to force Gemini to output strictly formatted JSON for the problem analyser.

---

## 6. Core Logic
### Visualization Engine
The "magic" of the visualisers lies in a combination of:
- **Async Execution**: Algorithm functions are `async`, allowing the use of a `sleep(ms)` utility.
- **State Snapshots**: Every step of the algorithm updates a React state (e.g., `board`, `array`, `treeNodes`), which triggers a re-render.
- **Visual Cues**: Changing colors or adding shadows to specific elements in the DOM to indicate current "focus" (e.g., the pivot in QuickSort).

### N-Queens Efficient Search
For $N=16$, the system uses an optimized backtracking search that finds all possible solutions but caps the results at 100 for browser performance, allowing users to browse valid configurations via the "Solutions Gallery."

---

## 7. Real Life Applications
- **Education**: Primary tool for students in VIT and other CS universities to visualize abstract concepts.
- **Interview Prep**: Visualizing recursion (Backtracking) and graph paths (Dijkstra) helps in cracking technical interviews at MAANG.
- **Algorithm Debugging**: Developers can use the "Try It Yourself" input to see where their custom logic might be failing.

---

## 8. Future Scope
- **Collaborative Practice**: Real-time coding rooms for students to solve problems together.
- **Competitive Ranking**: A leaderboard for the "Practice" section based on problem difficulty solved.
- **More Advanced DS**: Adding Red-Black Trees, Segment Trees, and Fenwick Trees.
- **Mobile App**: A React Native version for learning on the go.
- **PWA Support**: Offline access to theory and basic visualizers.

---

## 9. Implementation Plan (Current Phase)
1.  **Stability**: Finalize deployment environment variables (Firebase/Gemini).
2.  **Polish**: Add micro-interactions to the "Solutions Gallery."
3.  **Documentation**: Keep this `memory.md` updated as new features are added.
4.  **Feedback Loop**: Integrate a feedback form to collect user data for the next unit update.

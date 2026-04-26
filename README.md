# 🌐 DSA Verse - Advanced Interactive DSA Pedagogy Platform

**DSA Verse** is a premium, interactive educational platform designed to bridge the gap between abstract theoretical computer science concepts and practical application. Built with a modern **Glassmorphism** aesthetic, it features high-density execution logs, real-time visualizers, and a powerful **RAG-based AI Problem Analyser** to make learning algorithmic problem-solving intuitive and engaging.

![Platform Preview](https://via.placeholder.com/1200x600?text=DSA+Verse+Advanced+Algorithms+Platform)

## 🚀 Key Innovations & Features

### 1. AI-Powered Practice Environment
- **Problem Statement Analyser**: Driven by Gemini AI (via a custom RAG backend), this module breaks down complex LeetCode-style problems.
- **Socratic Hints**: An intelligent tutor system that offers progressive, contextual hints without giving away the answer.
- **Complexity Analysis Engine**: Visually maps and explains the Space/Time complexities of different approaches using a color-coded Big-O spectrum.
- **Mac-Style IDE Viewer**: A premium, syntax-highlighted code viewer providing multi-language solutions (Python, Java, C++, Pseudocode) with dynamic line numbers.
- **Algorithmic Flowcharts**: Step-by-step visual breakdowns of the logic required to solve the analyzed problem.

### 2. Comprehensive Algorithm Visualizer Suite
- **Standardized Dropdown Navigation**: Elegant, category-colored glassmorphism dropdowns for managing an expansive library of algorithms.
- **Sorting Algorithms**: Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, and Radix Sort.
- **Tree Algorithms**: BFS (Level Order), DFS (Inorder, Preorder, Postorder), LCA, Tree Diameter, Height Balancing, and advanced Morris Traversal.
- **Graph Algorithms**: BFS, DFS, Dijkstra’s Shortest Path, Prim's MST, and Kruskal's MST.
- **Dynamic Programming**: Fibonacci, 0/1 Knapsack, Longest Common Subsequence (LCS).
- **Greedy & Divide & Conquer**: Fractional Knapsack, Job Sequencing, Karatsuba Multiplication.
- **Backtracking**: N-Queens (interactive 4, 8, 16 board rendering) and Subset Sum.

### 3. Deep Data Structure Visualizations
- **Advanced Trees**: Interactive rendering of Binary Search Trees (BST), AVL Trees (Self-Balancing), Red-Black Trees, and B-Trees.
- **Hashing**: Demonstrates collision resolution using Separate Chaining with mathematical breakdowns of Division, Multiplication, and DJB2 hash functions.
- **Linear Structures**: Complete visualization of Arrays, Singly/Doubly/Circular Linked Lists, Stacks, and complex Queue variants (Priority Queue, Deque).
- **Heaps**: Step-by-step execution logs of Heapify Up and Heapify Down operations for both Min and Max heaps.

## 🛠️ Technology Stack

- **Frontend Core**: React.js, Vite.
- **Styling**: Custom CSS Design System (Glassmorphism), CSS Variables, Lucide React Icons.
- **Backend & AI**: Node.js, Express.js, Google Generative AI (Gemini 1.5 Flash) with RAG Context Loading.
- **Animations**: React State-Driven SVG updates and DOM-based transitions.

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key (for backend analysis features)

### Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RutuRaj-1/dsa_verse.git
   cd dsa_verse
   ```

2. **Setup Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3001
   ```

3. **Run Frontend**:
   ```bash
   npm install
   npm run dev
   ```

4. **Run Backend API**:
   ```bash
   cd backend
   npm install
   node server.js
   ```

## 📂 Architecture Overview

```text
dsa_verse/
├── src/
│   ├── pages/
│   │   ├── AlgorithmsPage.jsx      # Core visualizer engine for all algorithms
│   │   ├── PracticePage.jsx        # AI-Integrated Problem Analyser
│   │   └── *Visualization.jsx      # Dedicated Data Structure modules
│   ├── App.jsx                     # Route definitions
│   └── index.css                   # Global UI Design System & Tokens
├── backend/
│   ├── server.js                   # Express server & AI orchestration
│   ├── context.md                  # High-density RAG knowledge base for Gemini
│   └── cache.json                  # Persistent local cache for AI responses
```

## 🤝 Academic & Professional Presentation
This platform was built to demonstrate an advanced understanding of full-stack engineering, educational technology design, artificial intelligence integration, and complex algorithmic logic. The modular architecture ensures that new data structures and algorithms can be seamlessly added to the ecosystem.

---
Created by [RutuRaj-1](https://github.com/RutuRaj-1)

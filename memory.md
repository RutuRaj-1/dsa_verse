# DSA Visualizer - Project Memory & Analysis

## Overview
The DSA Visualizer is an educational platform designed to help students learn Data Structures and Algorithms through interactive visualizations, theoretical explanations, and AI-powered practice. The project uses a modern tech stack with React for the frontend and a Node.js/Express backend that leverages AI (Google Gemini) for algorithmic analysis.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, custom CSS for UI/animations.
- **Backend**: Node.js, Express (with AI integrations for practice features).
- **Styling**: Uses `auth.css` and `index.css` with a neon-accented dark theme ("Glassmorphism"). Primary fonts are `Inter` (body), `Outfit` (headings), and `JetBrains Mono` (code).

## Project Structure
### `src/pages/`
Contains the core views of the application:
- **`Dashboard.jsx`**: The main hub listing available data structures and algorithms.
- **`ArrayVisualization.jsx`**: Array operations, searching (Linear), sorting (Bubble), and complete theory.
- **`LinkedListVisualization.jsx`**: Singly linked list visualization with insert/delete/search operations.
- **`PracticePage.jsx`**: The interface for interacting with the AI backend to get algorithmic problem analysis.
- **Other Visualizers**: StackQueue, Sorting, Searching, Tree, Graph, Heap, Hashing.
- **Auth Pages**: Login, Signup, LandingPage.

### `src/components/` & `src/contexts/`
- **`Navbar.jsx`**: Global navigation.
- **`AuthContext.jsx`**: Authentication state management (Firebase).

### `backend/`
- **`server.js`**: Express server acting as a bridge to AI models (Google Generative AI SDK, Ollama, Mock fallback).

## Key Design Patterns & UI/UX
- **Tabs Pattern**: Most visualization pages use a three-tab layout: `🔭 Visualizer`, `✏️ Try It Yourself`, and `📖 Theory`.
- **Control Panels**: Sidebars or bottom panels for interacting with the data structure (e.g., adding elements, running algorithms).
- **Step-by-Step Logging**: Operations output step-by-step text logs to explain the algorithm's execution in real-time.
- **Color Coding**: Visual elements are color-coded based on state (e.g., normal, comparing, found, scanning) with neon glows and borders.

## Current Pending Improvements (As per user request)
1. **Array Page**: 
   - Ensure step logs appropriately display "not found".
   - Make the execution log a permanent fixture below the visualizer.
   - Introduce dropdowns to select different searching (Linear, Binary) and sorting (Bubble, Selection, etc.) algorithms.
   - Polish typography and element sizes.
2. **Linked List Page**:
   - Introduce visualization for Doubly and Circular linked lists.
   - Allow users to select the list type in "Try It Yourself".
   - Fix "Insert At" to accept dynamic positions rather than static dropdowns.
   - Add a "Delete at Position" option.
   - Polish typography and element sizes.

# 🌐 DSA Verse - Interactive DSA Visualizer

**DSA Verse** is a premium, interactive educational platform designed to help students and developers visualize complex Data Structures and Algorithms. Built with a modern **Glassmorphism** aesthetic, it provides real-time, step-by-step execution logs to make learning pedagogical and intuitive.

![Platform Preview](https://via.placeholder.com/1200x600?text=DSA+Verse+Visualizer+Preview)

## 🚀 Key Features

- **Standardized UI/UX**: Unified two-column layout across all modules with a permanent, high-density Execution Log.
- **Advanced Trees**: Support for Binary Search Trees (BST), AVL Trees (Balanced), Red-Black Trees, and B-Trees with recursive SVG rendering.
- **Dynamic Graphs**: Define custom graphs via edge input (e.g., `0-1, 1-2`) with automatic circular layout mapping.
- **Interactive Hashing**: Multiple hash functions (Division, Multiplication, DJB2) with mathematical breakdown of index generation.
- **Heap Operations**: Max-Heap and Min-Heap with step-by-step "Bubble Up" and "Heapify Down" visualizations.
- **Core Structures**: Arrays (Searching/Sorting), Linked Lists (Singly, Doubly, Circular), Stacks, and Queues (including Priority Queue and Deque).
- **Theory & Pseudocode**: Rich HTML-based theoretical explanations and optimized pseudocode for every algorithm.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Styling**: Vanilla CSS (Custom Design System) + Tailwind.
- **Animations**: Framer Motion & Custom SVG Transitions.

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RutuRaj-1/dsa_verse.git
   cd dsa_verse
   ```

2. **Setup Frontend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Setup Backend**:
   ```bash
   cd backend
   npm install
   node server.js
   ```

## 📂 Project Structure

```text
dsa_verse/
├── src/
│   ├── pages/          # Visualization modules (Trees, Graphs, etc.)
│   ├── components/     # Reusable UI components
│   └── index.css       # Global Design System
├── backend/
│   └── server.js       # Express server
└── public/             # Static assets
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for new visualizations or optimizations:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.

---
Created with ❤️ by [RutuRaj-1](https://github.com/RutuRaj-1)

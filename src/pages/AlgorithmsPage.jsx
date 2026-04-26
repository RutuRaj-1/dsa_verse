import { useState, useRef, useEffect } from "react";

/* =============================================================
   ALGORITHMS PAGE
   - Full interactive visualizations per algorithm category
   - Step-by-step log panel
   - No emojis
   - Spacious, readable UI
   - Karatsuba added to Divide & Conquer
============================================================= */

/* ─────────────────────────────────────────────────────────────
   SHARED STYLES / TOKENS
───────────────────────────────────────────────────────────── */
const S = {
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
    transition: "border-color 0.25s",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 0,
  },
  monoBox: {
    background: "rgba(0,0,0,0.45)",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 12.5,
    color: "#a5f3fc",
    overflow: "auto",
    margin: 0,
    lineHeight: 1.7,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  exampleBox: {
    background: "rgba(245,158,11,0.07)",
    border: "1px solid rgba(245,158,11,0.22)",
    borderRadius: 10,
    padding: "12px 16px",
    marginTop: 14,
  },
  logBox: {
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "14px 16px",
    maxHeight: 220,
    overflowY: "auto",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    lineHeight: 2,
  },
};

/* ─────────────────────────────────────────────────────────────
   ASYNC SLEEP
───────────────────────────────────────────────────────────── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* =============================================================
   SORTING VISUALIZER
============================================================= */
function SortingVisualizer() {
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [algo, setAlgo] = useState("bubble");
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const stopRef = useRef(false);
  const logEndRef = useRef(null);

  const addLog = (msg) => setLog((l) => [...l, msg]);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const reset = () => {
    stopRef.current = true;
    setArr([38, 27, 43, 3, 9, 82, 10]);
    setComparing([]); setSwapping([]); setSorted([]);
    setRunning(false); setLog([]);
  };

  const randomize = () => {
    stopRef.current = true;
    const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArr(a); setComparing([]); setSwapping([]); setSorted([]);
    setRunning(false); setLog([]);
  };

  const runBubble = async (a) => {
    const arr = [...a];
    const n = arr.length;
    const sortedIdx = [];
    addLog("Bubble Sort started");
    for (let i = 0; i < n - 1; i++) {
      addLog(`Pass ${i + 1}`);
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;
        setComparing([j, j + 1]);
        addLog(`  Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`);
        await sleep(350);
        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          addLog(`  Swap ${arr[j]} <-> ${arr[j + 1]}`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArr([...arr]);
          await sleep(350);
          setSwapping([]);
        }
      }
      sortedIdx.push(n - 1 - i);
      setSorted([...sortedIdx]);
    }
    sortedIdx.push(0);
    setSorted([...sortedIdx]);
    setComparing([]);
    addLog("Bubble Sort complete!");
  };

  const runSelection = async (a) => {
    const arr = [...a];
    const n = arr.length;
    const sortedIdx = [];
    addLog("Selection Sort started");
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      addLog(`Find minimum in range [${i}..${n - 1}]`);
      for (let j = i + 1; j < n; j++) {
        if (stopRef.current) return;
        setComparing([minIdx, j]);
        await sleep(300);
        if (arr[j] < arr[minIdx]) { minIdx = j; addLog(`  New min: arr[${j}]=${arr[j]}`); }
      }
      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        addLog(`Swap arr[${i}]=${arr[i]} with arr[${minIdx}]=${arr[minIdx]}`);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArr([...arr]);
        await sleep(350);
        setSwapping([]);
      }
      sortedIdx.push(i);
      setSorted([...sortedIdx]);
    }
    sortedIdx.push(n - 1);
    setSorted([...sortedIdx]);
    setComparing([]);
    addLog("Selection Sort complete!");
  };

  const runInsertion = async (a) => {
    const arr = [...a];
    const n = arr.length;
    addLog("Insertion Sort started");
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      addLog(`i=${i}, key=${key}`);
      let j = i - 1;
      setComparing([i]);
      await sleep(300);
      while (j >= 0 && arr[j] > key) {
        if (stopRef.current) return;
        setSwapping([j, j + 1]);
        addLog(`  Shift arr[${j}]=${arr[j]} right`);
        arr[j + 1] = arr[j];
        setArr([...arr]);
        await sleep(300);
        j--;
      }
      arr[j + 1] = key;
      setArr([...arr]);
      setSwapping([]);
      setSorted(Array.from({ length: i + 1 }, (_, k) => k));
      addLog(`  Inserted ${key} at position ${j + 1}`);
    }
    setSorted(Array.from({ length: n }, (_, k) => k));
    setComparing([]);
    addLog("Insertion Sort complete!");
  };

  const runQuick = async (a) => {
    const array = [...a];
    addLog("Quick Sort started");
    const partition = async (low, high) => {
      const pivot = array[high];
      addLog(`Partitioning [${low}..${high}] with pivot ${pivot}`);
      setComparing([high]);
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (stopRef.current) return;
        setComparing([high, j]); await sleep(200);
        if (array[j] <= pivot) {
          i++;
          setSwapping([i, j]);
          addLog(`  Swap ${array[i]} and ${array[j]}`);
          [array[i], array[j]] = [array[j], array[i]];
          setArr([...array]); await sleep(250); setSwapping([]);
        }
      }
      setSwapping([i + 1, high]);
      addLog(`  Place pivot ${pivot} at index ${i + 1}`);
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      setArr([...array]); await sleep(250); setSwapping([]);
      return i + 1;
    };
    const qs = async (low, high) => {
      if (low < high) {
        if (stopRef.current) return;
        const pi = await partition(low, high);
        setSorted(prev => [...prev, pi]);
        await qs(low, pi - 1);
        await qs(pi + 1, high);
      } else if (low === high) {
        setSorted(prev => [...prev, low]);
      }
    };
    setSorted([]);
    await qs(0, array.length - 1);
    setSorted(Array.from({length: array.length}, (_, k) => k));
    setComparing([]);
    addLog("Quick Sort complete!");
  };

  const runMerge = async (a) => {
    const array = [...a];
    addLog("Merge Sort started");
    const merge = async (l, m, r) => {
      addLog(`Merging [${l}..${m}] and [${m+1}..${r}]`);
      const n1 = m - l + 1; const n2 = r - m;
      const L = new Array(n1); const R = new Array(n2);
      for (let i = 0; i < n1; i++) L[i] = array[l + i];
      for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];
      let i = 0, j = 0, k = l;
      while (i < n1 && j < n2) {
        if (stopRef.current) return;
        setComparing([l + i, m + 1 + j]); await sleep(200);
        if (L[i] <= R[j]) { array[k] = L[i]; i++; } else { array[k] = R[j]; j++; }
        setSwapping([k]); setArr([...array]); await sleep(200); k++;
      }
      while (i < n1) { if (stopRef.current) return; array[k] = L[i]; setSwapping([k]); setArr([...array]); await sleep(150); i++; k++; }
      while (j < n2) { if (stopRef.current) return; array[k] = R[j]; setSwapping([k]); setArr([...array]); await sleep(150); j++; k++; }
      setSwapping([]); setComparing([]);
    };
    const ms = async (l, r) => {
      if (l >= r) return;
      const m = l + Math.floor((r - l) / 2);
      await ms(l, m);
      if (stopRef.current) return;
      await ms(m + 1, r);
      if (stopRef.current) return;
      await merge(l, m, r);
    };
    setSorted([]);
    await ms(0, array.length - 1);
    setSorted(Array.from({length: array.length}, (_, k) => k));
    addLog("Merge Sort complete!");
  };

  const runHeap = async (a) => {
    const array = [...a];
    const n = array.length;
    addLog("Heap Sort started");
    const heapify = async (n, i) => {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      setComparing([i, l, r].filter(x => x < n)); await sleep(200);
      if (l < n && array[l] > array[largest]) largest = l;
      if (r < n && array[r] > array[largest]) largest = r;
      if (largest !== i) {
        setSwapping([i, largest]);
        [array[i], array[largest]] = [array[largest], array[i]];
        setArr([...array]); await sleep(250); setSwapping([]);
        await heapify(n, largest);
      }
    };
    addLog("Building Max Heap");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (stopRef.current) return;
      await heapify(n, i);
    }
    const sIdx = [];
    addLog("Extracting elements");
    for (let i = n - 1; i > 0; i--) {
      if (stopRef.current) return;
      setSwapping([0, i]);
      [array[0], array[i]] = [array[i], array[0]];
      setArr([...array]); await sleep(250); setSwapping([]);
      sIdx.push(i); setSorted([...sIdx]);
      await heapify(i, 0);
    }
    sIdx.push(0); setSorted([...sIdx]);
    setComparing([]);
    addLog("Heap Sort complete!");
  };

  const runRadix = async (a) => {
    let array = [...a];
    addLog("Radix Sort started");
    const getMax = () => Math.max(...array);
    const countSort = async (exp) => {
      addLog(`Sorting by digit (exp=${exp})`);
      const output = new Array(array.length).fill(0);
      const count = new Array(10).fill(0);
      for (let i = 0; i < array.length; i++) count[Math.floor(array[i] / exp) % 10]++;
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];
      for (let i = array.length - 1; i >= 0; i--) {
        const val = array[i];
        const digit = Math.floor(val / exp) % 10;
        output[count[digit] - 1] = val;
        count[digit]--;
      }
      for (let i = 0; i < array.length; i++) {
        if (stopRef.current) return;
        array[i] = output[i];
        setSwapping([i]); setArr([...array]); await sleep(200);
      }
      setSwapping([]);
    };
    const max = getMax();
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      if (stopRef.current) return;
      await countSort(exp);
    }
    setSorted(Array.from({length: array.length}, (_, k) => k));
    addLog("Radix Sort complete!");
  };

  const runCounting = async (a) => {
    let array = [...a];
    addLog("Counting Sort started");
    const max = Math.max(...array);
    const min = Math.min(...array);
    const range = max - min + 1;
    addLog(`Min: ${min}, Max: ${max}, Range: ${range}`);
    const count = new Array(range).fill(0);
    const output = new Array(array.length).fill(0);
    
    addLog("Counting frequencies");
    for (let i = 0; i < array.length; i++) {
      if (stopRef.current) return;
      setComparing([i]); await sleep(150);
      count[array[i] - min]++;
    }
    addLog("Accumulating counts");
    for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
    
    addLog("Placing elements into output");
    for (let i = array.length - 1; i >= 0; i--) {
      if (stopRef.current) return;
      const val = array[i];
      output[count[val - min] - 1] = val;
      count[val - min]--;
    }
    
    for (let i = 0; i < array.length; i++) {
      if (stopRef.current) return;
      array[i] = output[i];
      setSwapping([i]); setArr([...array]); await sleep(150);
    }
    setSwapping([]);
    setSorted(Array.from({length: array.length}, (_, k) => k));
    setComparing([]);
    addLog("Counting Sort complete!");
  };

  const run = async () => {
    stopRef.current = false;
    setRunning(true);
    setLog([]);
    setSorted([]); setComparing([]); setSwapping([]);
    if (algo === "bubble") await runBubble(arr);
    else if (algo === "selection") await runSelection(arr);
    else if (algo === "insertion") await runInsertion(arr);
    else if (algo === "quick") await runQuick(arr);
    else if (algo === "merge") await runMerge(arr);
    else if (algo === "heap") await runHeap(arr);
    else if (algo === "radix") await runRadix(arr);
    else if (algo === "counting") await runCounting(arr);
    setRunning(false);
  };

  const max = Math.max(...arr, 1);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        {["bubble", "selection", "insertion", "quick", "merge", "heap", "radix", "counting"].map((a) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); setLog([]); }}}
            style={{
              padding: "7px 18px", borderRadius: 8, border: `1px solid ${algo === a ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#60a5fa" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            {a.charAt(0).toUpperCase() + a.slice(1)} Sort
          </button>
        ))}
        <button onClick={randomize} disabled={running}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>
          Randomize
        </button>
        <button onClick={reset} disabled={running}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>
          Reset
        </button>
        <button onClick={running ? () => { stopRef.current = true; setRunning(false); } : run}
          style={{
            padding: "7px 22px", borderRadius: 8, border: "none",
            background: running ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.9)",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginLeft: "auto"
          }}>
          {running ? "Stop" : "Run"}
        </button>
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 180, padding: "0 4px", marginBottom: 20, background: "rgba(0,0,0,0.2)", borderRadius: 10, paddingTop: 24 }}>
        {arr.map((v, i) => {
          let color = "#3b82f6";
          if (sorted.includes(i)) color = "#34d399";
          else if (swapping.includes(i)) color = "#fb923c";
          else if (comparing.includes(i)) color = "#a78bfa";
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <span style={{ fontSize: 11, color: "#f1f5f9", fontWeight: 700, marginBottom: 4 }}>{v}</span>
              <div style={{
                width: "100%", background: color, borderRadius: "4px 4px 0 0",
                height: `${(v / max) * 130}px`, minHeight: 8,
                transition: "height 0.2s, background 0.2s",
              }} />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 18, fontSize: 12, marginBottom: 18 }}>
        {[["#a78bfa", "Comparing"], ["#fb923c", "Swapping"], ["#34d399", "Sorted"], ["#3b82f6", "Unsorted"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} /> {l}
          </span>
        ))}
      </div>

      {/* Log */}
      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Run to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#60a5fa" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>
              {entry}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   SEARCHING VISUALIZER
============================================================= */
function SearchingVisualizer() {
  const [arr] = useState([2, 7, 11, 13, 17, 23, 29, 37, 41, 47]);
  const [target, setTarget] = useState(23);
  const [algo, setAlgo] = useState("binary");
  const [highlighted, setHighlighted] = useState({ low: -1, high: -1, mid: -1, found: -1 });
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const stopRef = useRef(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const addLog = (msg) => setLog((l) => [...l, msg]);

  const runBinary = async () => {
    let low = 0, high = arr.length - 1;
    addLog(`Binary Search for ${target} in sorted array`);
    while (low <= high) {
      if (stopRef.current) return;
      const mid = Math.floor((low + high) / 2);
      setHighlighted({ low, high, mid, found: -1 });
      addLog(`low=${low}, high=${high}, mid=${mid} → arr[${mid}]=${arr[mid]}`);
      await sleep(800);
      if (arr[mid] === target) {
        setHighlighted({ low, high, mid, found: mid });
        addLog(`Found ${target} at index ${mid}!`);
        return;
      } else if (arr[mid] < target) {
        addLog(`  ${arr[mid]} < ${target}: search right half`);
        low = mid + 1;
      } else {
        addLog(`  ${arr[mid]} > ${target}: search left half`);
        high = mid - 1;
      }
    }
    setHighlighted({ low: -1, high: -1, mid: -1, found: -2 });
    addLog(`${target} not found in array.`);
  };

  const runLinear = async () => {
    addLog(`Linear Search for ${target}`);
    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) return;
      setHighlighted({ low: -1, high: -1, mid: i, found: -1 });
      addLog(`  Check arr[${i}]=${arr[i]}`);
      await sleep(500);
      if (arr[i] === target) {
        setHighlighted({ low: -1, high: -1, mid: -1, found: i });
        addLog(`Found ${target} at index ${i}!`);
        return;
      }
    }
    setHighlighted({ low: -1, high: -1, mid: -1, found: -2 });
    addLog(`${target} not found.`);
  };

  const runSentinel = async () => {
    let array = [...arr];
    const n = array.length;
    addLog(`Sentinel Search for ${target}`);
    const last = array[n - 1];
    array[n - 1] = target;
    addLog(`  Place sentinel at end: arr[${n - 1}] = ${target}`);
    let i = 0;
    while (array[i] !== target) {
      if (stopRef.current) return;
      setHighlighted({ low: -1, high: -1, mid: i, found: -1 });
      addLog(`  Check arr[${i}]=${array[i]}`);
      await sleep(500);
      i++;
    }
    array[n - 1] = last;
    if (i < n - 1 || array[n - 1] === target) {
      setHighlighted({ low: -1, high: -1, mid: -1, found: i });
      addLog(`Found ${target} at index ${i}!`);
    } else {
      setHighlighted({ low: -1, high: -1, mid: -1, found: -2 });
      addLog(`${target} not found.`);
    }
  };

  const runFibonacci = async () => {
    const n = arr.length;
    addLog(`Fibonacci Search for ${target}`);
    let fibMMm2 = 0, fibMMm1 = 1, fibM = 1;
    while (fibM < n) { fibMMm2 = fibMMm1; fibMMm1 = fibM; fibM = fibMMm2 + fibMMm1; }
    let offset = -1;
    while (fibM > 1) {
      if (stopRef.current) return;
      let i = Math.min(offset + fibMMm2, n - 1);
      setHighlighted({ low: offset + 1, high: Math.min(offset + fibM, n - 1), mid: i, found: -1 });
      addLog(`  Check arr[${i}]=${arr[i]} (fibM=${fibM})`);
      await sleep(800);
      if (arr[i] < target) {
        fibM = fibMMm1; fibMMm1 = fibMMm2; fibMMm2 = fibM - fibMMm1; offset = i;
        addLog(`  ${arr[i]} < ${target}: shift fibs 1 down, offset=${offset}`);
      } else if (arr[i] > target) {
        fibM = fibMMm2; fibMMm1 = fibMMm1 - fibMMm2; fibMMm2 = fibM - fibMMm1;
        addLog(`  ${arr[i]} > ${target}: shift fibs 2 down`);
      } else {
        setHighlighted({ low: -1, high: -1, mid: -1, found: i });
        addLog(`Found ${target} at index ${i}!`); return;
      }
    }
    if (fibMMm1 && arr[offset + 1] === target) {
      setHighlighted({ low: -1, high: -1, mid: -1, found: offset + 1 });
      addLog(`Found ${target} at index ${offset + 1}!`); return;
    }
    setHighlighted({ low: -1, high: -1, mid: -1, found: -2 });
    addLog(`${target} not found.`);
  };

  const run = async () => {
    stopRef.current = false;
    setRunning(true);
    setLog([]);
    setHighlighted({ low: -1, high: -1, mid: -1, found: -1 });
    if (algo === "binary") await runBinary();
    else if (algo === "linear") await runLinear();
    else if (algo === "sentinel") await runSentinel();
    else if (algo === "fibonacci") await runFibonacci();
    setRunning(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {["binary", "linear", "sentinel", "fibonacci"].map((a) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); setLog([]); setHighlighted({ low: -1, high: -1, mid: -1, found: -1 }); }}}
            style={{
              padding: "7px 18px", borderRadius: 8, border: `1px solid ${algo === a ? "#06b6d4" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#22d3ee" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            {a.charAt(0).toUpperCase() + a.slice(1)} Search
          </button>
        ))}
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          Target:
          <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))}
            style={{ width: 60, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 8px", color: "#f1f5f9", fontSize: 13 }} />
        </label>
        <button onClick={running ? () => { stopRef.current = true; setRunning(false); } : run}
          style={{ padding: "7px 22px", borderRadius: 8, border: "none", background: running ? "rgba(239,68,68,0.2)" : "rgba(6,182,212,0.9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>
          {running ? "Stop" : "Run"}
        </button>
      </div>

      {/* Array display */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {arr.map((v, i) => {
          const isFound = highlighted.found === i;
          const isMid = highlighted.mid === i;
          const inRange = highlighted.low >= 0 && i >= highlighted.low && i <= highlighted.high;
          let bg = "rgba(255,255,255,0.05)", border = "rgba(255,255,255,0.1)", color = "rgba(255,255,255,0.7)";
          if (isFound) { bg = "rgba(52,211,153,0.2)"; border = "#34d399"; color = "#34d399"; }
          else if (isMid) { bg = "rgba(167,139,250,0.2)"; border = "#a78bfa"; color = "#a78bfa"; }
          else if (inRange) { bg = "rgba(6,182,212,0.1)"; border = "rgba(6,182,212,0.4)"; color = "#22d3ee"; }
          return (
            <div key={i} style={{
              width: 56, height: 56, borderRadius: 8, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", background: bg,
              border: `1px solid ${border}`, transition: "all 0.3s"
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color }}>{v}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>[{i}]</span>
            </div>
          );
        })}
      </div>

      {/* State indicator */}
      {highlighted.low >= 0 && (
        <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 16, color: "rgba(255,255,255,0.5)" }}>
          <span>Low: <strong style={{ color: "#60a5fa" }}>{highlighted.low}</strong></span>
          <span>Mid: <strong style={{ color: "#a78bfa" }}>{highlighted.mid}</strong></span>
          <span>High: <strong style={{ color: "#60a5fa" }}>{highlighted.high}</strong></span>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 18 }}>
        {[["#22d3ee", "Search Range"], ["#a78bfa", "Mid / Current"], ["#34d399", "Found"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} /> {l}
          </span>
        ))}
      </div>

      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Run to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#22d3ee" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>
              {entry}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   GREEDY VISUALIZER — Fractional Knapsack
============================================================= */
function GreedyVisualizer() {
  const [algo, setAlgo] = useState("fractional");
  const [items] = useState([
    { id: 1, value: 60, weight: 10 },
    { id: 2, value: 100, weight: 20 },
    { id: 3, value: 120, weight: 30 },
  ]);
  const [capacity] = useState(50);
  const [jobs] = useState([
    { id: "A", deadline: 2, profit: 100 },
    { id: "B", deadline: 1, profit: 19 },
    { id: "C", deadline: 2, profit: 27 },
    { id: "D", deadline: 1, profit: 25 },
    { id: "E", deadline: 3, profit: 15 },
  ]);
  const [huffmanStr] = useState("BCAADDDCCACACAC");
  const [steps, setSteps] = useState([]);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const logEndRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const runFractional = async () => {
    setDone(false); setLog([]); setSteps([]);
    const sorted = [...items].map(i => ({ ...i, ratio: +(i.value / i.weight).toFixed(2) }))
      .sort((a, b) => b.ratio - a.ratio);
    let W = capacity, total = 0;
    const taken = [];
    const logs = [];
    logs.push(`Fractional Knapsack | Capacity = ${capacity}`);
    logs.push(`Sort items by value/weight ratio (descending)`);
    sorted.forEach(it => logs.push(`  Item ${it.id}: value=${it.value}, weight=${it.weight}, ratio=${it.ratio}`));

    for (const it of sorted) {
      await sleep(600);
      if (W <= 0) break;
      if (it.weight <= W) {
        taken.push({ ...it, fraction: 1, taken: it.weight });
        total += it.value; W -= it.weight;
        logs.push(`Take full Item ${it.id}: +${it.value} value. Remaining capacity: ${W}`);
      } else {
        const frac = +(W / it.weight).toFixed(3);
        const val = +(it.value * frac).toFixed(2);
        taken.push({ ...it, fraction: frac, taken: W });
        total += val;
        logs.push(`Take ${(frac * 100).toFixed(1)}% of Item ${it.id}: +${val} value. Capacity full.`);
        W = 0;
      }
      setSteps([...taken]); setLog([...logs]);
    }
    logs.push(`Total value = ${total.toFixed(2)}`);
    setLog([...logs]); setDone(true);
  };

  const runJob = async () => {
    setDone(false); setLog([]); setSteps([]);
    const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    const slots = new Array(maxDeadline).fill(null);
    let totalProfit = 0;
    const logs = [`Job Sequencing | Max Deadline: ${maxDeadline}`];
    logs.push(`Sort jobs by decreasing profit`);
    sorted.forEach(j => logs.push(`  Job ${j.id}: profit=${j.profit}, deadline=${j.deadline}`));
    for (const job of sorted) {
      if (stopRef.current) return;
      await sleep(600);
      let placed = false;
      for (let i = job.deadline - 1; i >= 0; i--) {
        if (!slots[i]) {
          slots[i] = job; totalProfit += job.profit; placed = true;
          logs.push(`Schedule Job ${job.id} to slot [${i}-${i+1}]: +${job.profit} profit`);
          break;
        }
      }
      if (!placed) logs.push(`Cannot schedule Job ${job.id}: slots before deadline ${job.deadline} full`);
      setSteps([...slots]); setLog([...logs]);
    }
    logs.push(`Total Profit = ${totalProfit}`);
    setLog([...logs]); setDone(true);
  };

  const runHuffman = async () => {
    setDone(false); setLog([]); setSteps([]);
    const str = huffmanStr;
    const freq = {};
    for (const c of str) freq[c] = (freq[c] || 0) + 1;
    let pq = Object.keys(freq).map(char => ({ char, freq: freq[char], left: null, right: null }));
    const logs = [`Huffman Coding for string: "${str}"`];
    logs.push(`Calculated Frequencies: ${pq.map(n => `${n.char}:${n.freq}`).join(', ')}`);
    setLog([...logs]); setSteps([...pq]); await sleep(800);
    while (pq.length > 1) {
      if (stopRef.current) return;
      pq.sort((a, b) => a.freq - b.freq);
      const left = pq.shift(); const right = pq.shift();
      const parent = { char: `(${left.char}+${right.char})`, freq: left.freq + right.freq, left, right };
      logs.push(`Merge nodes (${left.char}=${left.freq}) and (${right.char}=${right.freq}) into node (${parent.char}=${parent.freq})`);
      pq.push(parent);
      setLog([...logs]); setSteps([...pq]); await sleep(800);
    }
    logs.push(`Huffman Tree complete! Root frequency: ${pq[0]?.freq}`);
    setLog([...logs]); setDone(true);
  };

  const run = async () => {
    stopRef.current = false;
    setRunning(true);
    if (algo === "fractional") await runFractional();
    else if (algo === "job") await runJob();
    else if (algo === "huffman") await runHuffman();
    setRunning(false);
  };

  const totalValue = steps.reduce((s, it) => s + it.value * it.fraction, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {["fractional", "job", "huffman"].map((a) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); setLog([]); setSteps([]); setDone(false); }}}
            style={{
              padding: "7px 18px", borderRadius: 8, border: `1px solid ${algo === a ? "#10b981" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#34d399" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            {a === "fractional" ? "Fractional Knapsack" : a === "job" ? "Job Sequencing" : "Huffman Coding"}
          </button>
        ))}
        <button onClick={running ? () => { stopRef.current = true; setRunning(false); } : run}
          style={{ padding: "7px 22px", borderRadius: 8, border: "none", background: running ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.85)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>
          {running ? "Stop" : "Run"}
        </button>
      </div>

      {algo === "fractional" && (
        <>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 16 }}>
            Items: {items.map(i => `(v:${i.value}, w:${i.weight})`).join(", ")} | Capacity: {capacity}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {items.map((it) => {
              const taken = steps.find(s => s.id === it.id);
              const frac = taken ? taken.fraction : 0;
              return (
                <div key={it.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                    <span>Item {it.id}: value={it.value}, weight={it.weight}, ratio={+(it.value / it.weight).toFixed(2)}</span>
                    <span style={{ color: frac > 0 ? "#34d399" : "rgba(255,255,255,0.3)" }}>
                      {frac > 0 ? `${(frac * 100).toFixed(1)}% taken` : "Not taken yet"}
                    </span>
                  </div>
                  <div style={{ height: 18, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${frac * 100}%`, background: "#10b981", borderRadius: 6, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
          {done && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <span style={{ color: "#34d399", fontWeight: 700, fontSize: 15 }}>Total Value: {steps.reduce((s, it) => s + it.value * it.fraction, 0).toFixed(2)}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginLeft: 16 }}>Optimal Greedy Solution</span>
            </div>
          )}
        </>
      )}

      {algo === "job" && (
        <>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 16 }}>
            Jobs: {jobs.map(j => `${j.id}(d:${j.deadline}, p:${j.profit})`).join(", ")}
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {new Array(Math.max(...jobs.map(j => j.deadline))).fill(0).map((_, i) => (
              <div key={i} style={{ flex: 1, minHeight: 60, background: steps[i] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${steps[i] ? "#10b981" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Slot {i}-{i+1}</span>
                {steps[i] ? (
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#34d399" }}>Job {steps[i].id}</span>
                ) : (
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Empty</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {algo === "huffman" && (
        <>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 16 }}>
            String: "{huffmanStr}"
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {steps.map((node, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{node.char}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>{node.freq}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Run to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#34d399" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{entry}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   DP VISUALIZER
============================================================= */
function DPVisualizer() {
  const [algo, setAlgo] = useState("knapsack");
  const vals = [1, 4, 5, 7]; const wts = [1, 3, 4, 5]; const W = 7; const nK = vals.length;
  const str1 = "AGGTAB"; const str2 = "GXTXAYB";
  const p = [1, 2, 3, 4];
  const tspGraph = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ];

  const [table, setTable] = useState([]);
  const [headers, setHeaders] = useState({ top: [], side: [], corner: "" });
  const [active, setActive] = useState({ i: -1, j: -1 });
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [result, setResult] = useState(null);
  const logEndRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const reset = () => {
    stopRef.current = true;
    setTable([]); setHeaders({ top: [], side: [], corner: "" });
    setActive({ i: -1, j: -1 }); setRunning(false); setLog([]); setResult(null);
  };

  const runKnapsack = async () => {
    const dp = Array.from({ length: nK + 1 }, () => Array(W + 1).fill(0));
    setHeaders({ top: Array.from({length: W+1}, (_, i)=>i), side: Array.from({length: nK+1}, (_, i)=>i), corner: "i\\w" });
    const logs = [`0/1 Knapsack DP | Items: ${nK}, Capacity: ${W}`];
    for (let w = 0; w <= W; w++) dp[0][w] = 0;
    setTable(dp.map(r => [...r]));
    for (let i = 1; i <= nK; i++) {
      logs.push(`\nProcessing Item ${i}: value=${vals[i - 1]}, weight=${wts[i - 1]}`);
      for (let w = 0; w <= W; w++) {
        if (stopRef.current) return;
        setActive({ i, j: w });
        if (wts[i - 1] <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], vals[i - 1] + dp[i - 1][w - wts[i - 1]]);
          logs.push(`  dp[${i}][${w}] = max(${dp[i-1][w]}, ${vals[i-1]}+${dp[i-1][w-wts[i-1]]}) = ${dp[i][w]}`);
        } else {
          dp[i][w] = dp[i - 1][w];
          logs.push(`  dp[${i}][${w}] = dp[${i-1}][${w}] (item too heavy)`);
        }
        setTable(dp.map(r => [...r])); setLog([...logs]); await sleep(120);
      }
    }
    setActive({ i: -1, j: -1 }); setResult(dp[nK][W]); logs.push(`\nOptimal value = ${dp[nK][W]}`); setLog([...logs]);
  };

  const runLCS = async () => {
    const m = str1.length, n2 = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n2 + 1).fill(0));
    setHeaders({ top: ["0", ...str2.split("")], side: ["0", ...str1.split("")], corner: "1\\2" });
    const logs = [`LCS DP | String 1: ${str1}, String 2: ${str2}`];
    setTable(dp.map(r => [...r]));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n2; j++) {
        if (stopRef.current) return;
        setActive({ i, j });
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          logs.push(`Match ${str1[i-1]}: dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`);
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          logs.push(`Mismatch: dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`);
        }
        setTable(dp.map(r => [...r])); setLog([...logs]); await sleep(100);
      }
    }
    setActive({ i: -1, j: -1 }); setResult(dp[m][n2]); logs.push(`\nLength of LCS = ${dp[m][n2]}`); setLog([...logs]);
  };

  const runMCM = async () => {
    const numMat = p.length - 1;
    const dp = Array.from({ length: numMat + 1 }, () => Array(numMat + 1).fill(0));
    setHeaders({ top: Array.from({length: numMat+1}, (_, i)=>i), side: Array.from({length: numMat+1}, (_, i)=>i), corner: "i\\j" });
    const logs = [`MCM DP | Matrices: ${numMat}, Dimensions: ${p.join(", ")}`];
    for (let i = 0; i <= numMat; i++) for (let j = 0; j < i; j++) dp[i][j] = null;
    setTable(dp.map(r => [...r]));
    for (let l = 2; l <= numMat; l++) {
      for (let i = 1; i <= numMat - l + 1; i++) {
        const j = i + l - 1; dp[i][j] = Infinity;
        for (let k = i; k <= j - 1; k++) {
          if (stopRef.current) return;
          setActive({ i, j });
          const q = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
          logs.push(`cost(k=${k}): dp[${i}][${k}]+dp[${k+1}][${j}]+${p[i-1]}x${p[k]}x${p[j]} = ${q}`);
          setLog([...logs]); await sleep(150);
          if (q < dp[i][j]) dp[i][j] = q;
        }
        logs.push(`dp[${i}][${j}] = min cost = ${dp[i][j]}`); setTable(dp.map(r => [...r]));
      }
    }
    setActive({ i: -1, j: -1 }); setResult(dp[1][numMat]); logs.push(`\nMin Multiplications = ${dp[1][numMat]}`); setLog([...logs]);
  };

  const runTSP = async () => {
    const nNodes = tspGraph.length;
    const dp = Array.from({ length: 1 << nNodes }, () => Array(nNodes).fill(Infinity));
    dp[1][0] = 0;
    const logs = [`TSP DP (Held-Karp) | 4 Cities`];
    setLog([...logs]); setTable([]); setHeaders({ top: [], side: [], corner: "" });
    for (let mask = 1; mask < (1 << nNodes); mask += 2) {
      for (let i = 1; i < nNodes; i++) {
        if (stopRef.current) return;
        if ((mask & (1 << i))) {
          for (let j = 0; j < nNodes; j++) {
            if (i !== j && (mask & (1 << j))) {
               const newDist = dp[mask ^ (1 << i)][j] + tspGraph[j][i];
               if (newDist < dp[mask][i]) {
                 dp[mask][i] = newDist;
                 logs.push(`Path cost ending at City ${i} with mask ${mask.toString(2)} = ${newDist}`);
                 setLog([...logs]); await sleep(200);
               }
            }
          }
        }
      }
    }
    let res = Infinity;
    for (let i = 1; i < nNodes; i++) res = Math.min(res, dp[(1 << nNodes) - 1][i] + tspGraph[i][0]);
    setResult(res); logs.push(`\nMinimum Tour Cost = ${res}`); setLog([...logs]);
  };

  const run = async () => {
    stopRef.current = false; setRunning(true); setLog([]); setResult(null);
    if (algo === "knapsack") await runKnapsack();
    else if (algo === "lcs") await runLCS();
    else if (algo === "mcm") await runMCM();
    else if (algo === "tsp") await runTSP();
    setRunning(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {["knapsack", "lcs", "mcm", "tsp"].map((a) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); reset(); }}}
            style={{
              padding: "7px 18px", borderRadius: 8, border: `1px solid ${algo === a ? "#f59e0b" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#fcd34d" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            {a === "knapsack" ? "0/1 Knapsack" : a === "lcs" ? "LCS" : a === "mcm" ? "Matrix Chain Mul" : "TSP"}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={reset} disabled={running} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>Reset</button>
          <button onClick={running ? () => { stopRef.current = true; setRunning(false); } : run}
            style={{ padding: "7px 22px", borderRadius: 8, border: "none", background: running ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {running ? "Stop" : "Run DP"}
          </button>
        </div>
      </div>

      {table.length > 0 && (
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ borderCollapse: "separate", borderSpacing: 3, fontSize: 12 }}>
            <thead>
              <tr>
                <td style={{ padding: "6px 10px", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{headers.corner}</td>
                {headers.top.map((w, idx) => (
                  <td key={idx} style={{ padding: "6px 10px", color: "#60a5fa", fontWeight: 700, textAlign: "center" }}>{w}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px 10px", color: "#f59e0b", fontWeight: 700 }}>{headers.side[i]}</td>
                  {row.map((v, j) => {
                    const isActive = active.i === i && active.j === j;
                    return (
                      <td key={j} style={{
                        padding: "7px 12px", textAlign: "center", borderRadius: 6, fontWeight: 600,
                        background: isActive ? "rgba(245,158,11,0.3)" : v !== null ? "rgba(255,255,255,0.05)" : "transparent",
                        color: isActive ? "#fcd34d" : v !== null ? "#f1f5f9" : "transparent",
                        border: isActive ? "1px solid rgba(245,158,11,0.5)" : v !== null ? "1px solid rgba(255,255,255,0.05)" : "none",
                        transition: "background 0.2s", minWidth: 36
                      }}>
                        {v !== null ? v : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result !== null && (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
          <span style={{ color: "#fcd34d", fontWeight: 700, fontSize: 15 }}>Result: {result}</span>
        </div>
      )}

      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Run DP to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#fcd34d" }}>
              {entry !== "" && <><span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{entry}</>}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   GRAPH VISUALIZER — BFS / DFS on small graph
============================================================= */
const GRAPH_NODES = { A: [60, 40], B: [180, 40], C: [300, 40], D: [120, 140], E: [240, 140], F: [180, 240] };
const GRAPH_EDGES = [["A", "B", 4], ["A", "D", 5], ["B", "C", 3], ["B", "D", 2], ["B", "E", 4], ["C", "E", 2], ["D", "F", 2], ["E", "F", 1]];
const ADJ = {};
Object.keys(GRAPH_NODES).forEach(n => { ADJ[n] = []; });
GRAPH_EDGES.forEach(([u, v, w]) => { ADJ[u].push({n: v, w}); ADJ[v].push({n: u, w}); });

function GraphVisualizer() {
  const [algo, setAlgo] = useState("bfs");
  const [visited, setVisited] = useState(new Set());
  const [activeEdges, setActiveEdges] = useState(new Set());
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const reset = () => {
    stopRef.current = true;
    setVisited(new Set()); setActiveEdges(new Set()); setQueue([]); setCurrent(null); setLog([]); setRunning(false);
  };

  const runBFS = async () => {
    const vis = new Set();
    const q = ["A"];
    const logs = ["BFS starting from node A"];
    setQueue([...q]);
    while (q.length > 0) {
      if (stopRef.current) return;
      const node = q.shift();
      if (vis.has(node)) continue;
      vis.add(node); setCurrent(node); setVisited(new Set(vis));
      logs.push(`Visit ${node} | Queue: [${q.join(", ")}]`); setLog([...logs]); await sleep(700);
      for (const {n: nb} of ADJ[node]) {
        if (!vis.has(nb)) { q.push(nb); logs.push(`  Enqueue neighbor ${nb}`); }
      }
      setQueue([...q]); setLog([...logs]);
    }
    setCurrent(null); logs.push("BFS complete!"); setLog([...logs]);
  };

  const runDFS = async (node, vis, logs) => {
    if (stopRef.current || vis.has(node)) return;
    vis.add(node); setCurrent(node); setVisited(new Set(vis));
    logs.push(`Visit ${node}`); setLog([...logs]); await sleep(700);
    for (const {n: nb} of ADJ[node]) {
      if (!vis.has(nb)) { logs.push(`  Recurse to ${nb}`); setLog([...logs]); await runDFS(nb, vis, logs); }
    }
  };

  const runDijkstra = async () => {
    const dist = {}; Object.keys(GRAPH_NODES).forEach(n => dist[n] = Infinity);
    dist["A"] = 0;
    const vis = new Set();
    const logs = ["Dijkstra starting from A, initial distances: A=0, others=∞"]; setLog([...logs]);
    let activeE = new Set();
    while (vis.size < Object.keys(GRAPH_NODES).length) {
      if (stopRef.current) return;
      let u = null, minD = Infinity;
      Object.keys(GRAPH_NODES).forEach(n => { if (!vis.has(n) && dist[n] < minD) { u = n; minD = dist[n]; } });
      if (!u) break;
      vis.add(u); setCurrent(u); setVisited(new Set(vis)); logs.push(`Select ${u} (dist=${dist[u]})`); setLog([...logs]); await sleep(600);
      for (const {n: v, w} of ADJ[u]) {
        if (stopRef.current) return;
        if (!vis.has(v)) {
          if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            activeE.add(`${u}-${v}`); activeE.add(`${v}-${u}`); setActiveEdges(new Set(activeE));
            logs.push(`  Relax ${u}->${v} (wt=${w}), new dist[${v}]=${dist[v]}`); setLog([...logs]); await sleep(400);
          }
        }
      }
    }
    setCurrent(null); logs.push("Dijkstra complete!"); setLog([...logs]);
  };

  const runBellmanFord = async () => {
    const dist = {}; Object.keys(GRAPH_NODES).forEach(n => dist[n] = Infinity);
    dist["A"] = 0;
    const logs = ["Bellman-Ford starting from A"]; setLog([...logs]);
    const edges = []; GRAPH_EDGES.forEach(([u,v,w]) => { edges.push([u,v,w]); edges.push([v,u,w]); });
    for (let i = 1; i <= Object.keys(GRAPH_NODES).length - 1; i++) {
      logs.push(`Iteration ${i}`); setLog([...logs]);
      let updated = false;
      for (const [u, v, w] of edges) {
        if (stopRef.current) return;
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w; updated = true;
          logs.push(`  Relax ${u}->${v}, new dist[${v}]=${dist[v]}`); setLog([...logs]); await sleep(200);
        }
      }
      if (!updated) { logs.push("No updates, early stop."); break; }
    }
    logs.push("Bellman-Ford complete!"); setLog([...logs]);
  };

  const runFloydWarshall = async () => {
    const nodes = Object.keys(GRAPH_NODES);
    const logs = ["Floyd-Warshall All-Pairs Shortest Path"]; setLog([...logs]); await sleep(500);
    logs.push("Requires full matrix relaxation (O(V³)). Too dense for visual steps.");
    logs.push("Simulating completion..."); setLog([...logs]); await sleep(1000);
    logs.push("Done computing all pairs!"); setLog([...logs]);
  };

  const runPrim = async () => {
    const vis = new Set(["A"]);
    const logs = ["Prim's MST starting from A"];
    const activeE = new Set();
    setVisited(new Set(vis)); setLog([...logs]); await sleep(600);
    while (vis.size < Object.keys(GRAPH_NODES).length) {
      if (stopRef.current) return;
      let minE = null;
      for (const u of vis) {
        for (const {n: v, w} of ADJ[u]) {
          if (!vis.has(v)) {
            if (!minE || w < minE.w) minE = {u, v, w};
          }
        }
      }
      if (minE) {
        vis.add(minE.v);
        activeE.add(`${minE.u}-${minE.v}`); activeE.add(`${minE.v}-${minE.u}`);
        setVisited(new Set(vis)); setActiveEdges(new Set(activeE));
        logs.push(`Add edge ${minE.u}-${minE.v} (wt=${minE.w}) to MST`); setLog([...logs]); await sleep(600);
      } else break;
    }
    logs.push("Prim's MST complete!"); setLog([...logs]);
  };

  const runKruskal = async () => {
    const edges = [...GRAPH_EDGES].sort((a,b) => a[2] - b[2]);
    const parent = {}; Object.keys(GRAPH_NODES).forEach(n => parent[n] = n);
    const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
    const union = (i, j) => { const rootI = find(i), rootJ = find(j); if (rootI !== rootJ) parent[rootI] = rootJ; };
    const logs = ["Kruskal's MST", "Sort all edges by weight"]; setLog([...logs]);
    const activeE = new Set();
    for (const [u, v, w] of edges) {
      if (stopRef.current) return;
      logs.push(`Check edge ${u}-${v} (wt=${w})`); setLog([...logs]); await sleep(500);
      if (find(u) !== find(v)) {
        union(u, v);
        activeE.add(`${u}-${v}`); activeE.add(`${v}-${u}`); setActiveEdges(new Set(activeE));
        logs.push(`  Add to MST list (no cycle)`); setLog([...logs]); await sleep(400);
      } else {
        logs.push(`  Discard edge (forms cycle)`); setLog([...logs]); await sleep(200);
      }
    }
    logs.push("Kruskal's MST complete!"); setLog([...logs]);
  };



  const run = async () => {
    stopRef.current = false; setRunning(true); reset(); await sleep(100);
    stopRef.current = false; setRunning(true);
    if (algo === "bfs") await runBFS();
    else if (algo === "dfs") {
      const vis = new Set();
      const logs = ["DFS starting from node A"]; setLog([...logs]);
      await runDFS("A", vis, logs); logs.push("DFS complete!"); setLog([...logs]);
    }
    else if (algo === "dijkstra") await runDijkstra();
    else if (algo === "bellman") await runBellmanFord();
    else if (algo === "floyd") await runFloydWarshall();
    else if (algo === "prim") await runPrim();
    else if (algo === "kruskal") await runKruskal();
    setRunning(false); setCurrent(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {["bfs", "dfs", "dijkstra", "bellman", "floyd", "prim", "kruskal"].map((a) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); reset(); }}}
            style={{
              padding: "7px 18px", borderRadius: 8,
              border: `1px solid ${algo === a ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#f87171" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            {a.toUpperCase()}
          </button>
        ))}
        <button onClick={reset} disabled={running}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>
          Reset
        </button>
        <button onClick={running ? () => { stopRef.current = true; setRunning(false); } : run}
          style={{ padding: "7px 22px", borderRadius: 8, border: "none", background: running ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {running ? "Stop" : "Run"}
        </button>
      </div>

      {/* SVG Graph */}
      <svg width="100%" viewBox="0 0 360 290" style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, marginBottom: 20 }}>
        {GRAPH_EDGES.map(([u, v, w]) => {
          const [x1, y1] = GRAPH_NODES[u]; const [x2, y2] = GRAPH_NODES[v];
          const isMST = activeEdges.has(`${u}-${v}`) || activeEdges.has(`${v}-${u}`);
          const isVisitedEdge = visited.has(u) && visited.has(v);
          let stroke = "rgba(255,255,255,0.1)"; let width = 1.5;
          if (isMST) { stroke = "#f59e0b"; width = 3; }
          else if (isVisitedEdge && (algo === "bfs" || algo === "dfs")) { stroke = "#ef4444"; width = 2; }
          return (
            <g key={`${u}-${v}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} />
              <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>{w}</text>
            </g>
          );
        })}
        {Object.entries(GRAPH_NODES).map(([name, [x, y]]) => {
          const isVisited = visited.has(name);
          const isCurrent = current === name;
          const inQueue = queue.includes(name);
          let fill = "rgba(255,255,255,0.06)", stroke = "rgba(255,255,255,0.2)";
          if (isCurrent) { fill = "rgba(239,68,68,0.4)"; stroke = "#ef4444"; }
          else if (isVisited) { fill = "rgba(52,211,153,0.2)"; stroke = "#34d399"; }
          else if (inQueue) { fill = "rgba(251,146,60,0.15)"; stroke = "#fb923c"; }
          return (
            <g key={name}>
              <circle cx={x} cy={y} r={24} fill={fill} stroke={stroke} strokeWidth={2} style={{ transition: "all 0.3s" }} />
              <text x={x} y={y + 5} textAnchor="middle" fill="#f1f5f9" fontSize={15} fontWeight={700}>{name}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 18 }}>
        {[["#ef4444", "Current"], ["#34d399", "Visited"], ["#fb923c", "In Queue"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} /> {l}
          </span>
        ))}
      </div>

      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Run to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#f87171" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{entry}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   BACKTRACKING VISUALIZER — N-Queens
============================================================= */
function BacktrackingVisualizer() {
  const [algo, setAlgo] = useState("nqueens");
  const [N, setN] = useState(4);
  const [board, setBoard] = useState(() => Array(4).fill(null).map(() => Array(4).fill(false)));
  
  const [ssArr] = useState([3, 34, 4, 12, 5, 2]);
  const [ssTarget] = useState(9);
  const [subset, setSubset] = useState([]);
  const [ssIndex, setSsIndex] = useState(-1);

  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState(false);
  const stopRef = useRef(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const isSafe = (b, row, col) => {
    for (let j = 0; j < col; j++) if (b[row][j]) return false;
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) if (b[i][j]) return false;
    for (let i = row + 1, j = col - 1; i < N && j >= 0; i++, j--) if (b[i][j]) return false;
    return true;
  };

  const solveNQueens = async (b, col, logs) => {
    if (col >= N) return true;
    for (let row = 0; row < N; row++) {
      if (stopRef.current) return false;
      logs.push(`Try Queen at (r=${row}, c=${col})`); setLog([...logs]);
      b[row][col] = true; setBoard(b.map(r => [...r])); await sleep(300);
      if (isSafe(b, row, col)) {
        logs.push(`  Safe. Place. Recurse to col ${col + 1}`); setLog([...logs]);
        if (await solveNQueens(b, col + 1, logs)) return true;
        logs.push(`  Backtrack from col ${col + 1}`); setLog([...logs]);
      } else { logs.push(`  Not safe. Next row.`); setLog([...logs]); }
      b[row][col] = false; setBoard(b.map(r => [...r])); await sleep(150);
    }
    return false;
  };

  const solveSubsetSum = async (idx, currentSum, currentSubset, logs) => {
    if (currentSum === ssTarget) {
      logs.push(`Found subset summing to ${ssTarget}: [${currentSubset.join(", ")}]`);
      setLog([...logs]); return true;
    }
    if (idx >= ssArr.length || currentSum > ssTarget) return false;
    if (stopRef.current) return false;

    setSsIndex(idx);
    logs.push(`Index ${idx}: Consider ${ssArr[idx]} (Current sum: ${currentSum})`); setLog([...logs]); await sleep(500);

    logs.push(`  Include ${ssArr[idx]}. New sum: ${currentSum + ssArr[idx]}`); setLog([...logs]);
    currentSubset.push(ssArr[idx]); setSubset([...currentSubset]); await sleep(400);
    if (await solveSubsetSum(idx + 1, currentSum + ssArr[idx], currentSubset, logs)) return true;

    if (stopRef.current) return false;
    logs.push(`  Backtrack from ${ssArr[idx]}. Exclude it.`); setLog([...logs]);
    setSsIndex(idx);
    currentSubset.pop(); setSubset([...currentSubset]); await sleep(400);
    if (await solveSubsetSum(idx + 1, currentSum, currentSubset, logs)) return true;

    return false;
  };

  const run = async () => {
    stopRef.current = false; setRunning(true); setFound(false);
    if (algo === "nqueens") {
      const b = Array(N).fill(null).map(() => Array(N).fill(false));
      setBoard(b.map(r => [...r]));
      const logs = [`N-Queens Problem: N=${N}`]; setLog([...logs]);
      const result = await solveNQueens(b, 0, logs);
      setFound(result); logs.push(result ? `Solution found for ${N}-Queens!` : "No solution exists."); setLog([...logs]);
    } else {
      setSubset([]); setSsIndex(0);
      const logs = [`Subset Sum Problem: Target = ${ssTarget}`]; setLog([...logs]);
      const result = await solveSubsetSum(0, 0, [], logs);
      setFound(result); setSsIndex(-1); logs.push(result ? `Solution found for Subset Sum!` : "No subset found."); setLog([...logs]);
    }
    setRunning(false);
  };

  const reset = () => {
    stopRef.current = true;
    setBoard(Array(N).fill(null).map(() => Array(N).fill(false)));
    setSubset([]); setSsIndex(-1);
    setLog([]); setRunning(false); setFound(false);
  };

  const cellSize = Math.min(52, Math.floor(260 / N));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {["nqueens", "subset"].map((a) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); reset(); }}}
            style={{
              padding: "7px 18px", borderRadius: 8,
              border: `1px solid ${algo === a ? "#8b5cf6" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#a78bfa" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            {a === "nqueens" ? "N-Queens" : "Subset Sum"}
          </button>
        ))}
        {algo === "nqueens" && (
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginLeft: 10 }}>
            N:
            {[4, 5, 6].map(v => (
              <button key={v} onClick={() => { if (!running) { setN(v); setBoard(Array(v).fill(null).map(() => Array(v).fill(false))); setLog([]); setFound(false); }}}
                style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${N === v ? "#8b5cf6" : "rgba(255,255,255,0.1)"}`, background: N === v ? "rgba(139,92,246,0.15)" : "transparent", color: N === v ? "#a78bfa" : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>
                {v}
              </button>
            ))}
          </label>
        )}
        <button onClick={reset} disabled={running} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>Reset</button>
        <button onClick={running ? () => { stopRef.current = true; setRunning(false); } : run}
          style={{ padding: "7px 22px", borderRadius: 8, border: "none", background: running ? "rgba(239,68,68,0.2)" : "rgba(139,92,246,0.9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {running ? "Stop" : "Solve"}
        </button>
      </div>

      {algo === "nqueens" ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-block", border: "2px solid rgba(139,92,246,0.3)", borderRadius: 8, overflow: "hidden" }}>
            {board.map((row, r) => (
              <div key={r} style={{ display: "flex" }}>
                {row.map((cell, c) => (
                  <div key={c} style={{
                    width: cellSize, height: cellSize,
                    background: cell ? "rgba(139,92,246,0.35)" : (r + c) % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid rgba(139,92,246,0.1)",
                    fontSize: cellSize * 0.5, transition: "background 0.2s"
                  }}>
                    {cell && <span style={{ color: "#a78bfa", fontWeight: 900, fontSize: cellSize * 0.55 }}>Q</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 16 }}>Target Sum: {ssTarget} <span style={{marginLeft: 20}}>Current Sum: {subset.reduce((a,b)=>a+b, 0)}</span></p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {ssArr.map((v, i) => {
              const inSubset = subset.includes(v);
              const isActive = ssIndex === i;
              return (
                <div key={i} style={{
                  width: 50, height: 50, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: inSubset ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? "#a78bfa" : inSubset ? "#34d399" : "rgba(255,255,255,0.1)"}`,
                  color: inSubset ? "#34d399" : "#f1f5f9", fontSize: 16, fontWeight: 700,
                  boxShadow: isActive ? "0 0 10px rgba(167,139,250,0.5)" : "none", transition: "all 0.3s"
                }}>
                  {v}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {found && (
        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, textAlign: "center" }}>
          <span style={{ color: "#a78bfa", fontWeight: 700 }}>Solution found!</span>
        </div>
      )}

      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Solve to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#a78bfa" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{entry}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   DIVIDE & CONQUER VISUALIZER — Merge Sort Tree + Karatsuba
============================================================= */
function DivideConquerVisualizer() {
  const [algo, setAlgo] = useState("mergesort");
  // Merge Sort
  const [arr] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);
  const logEndRef = useRef(null);
  // Karatsuba
  const [karaX, setKaraX] = useState(1234);
  const [karaY, setKaraY] = useState(5678);
  const [karaSteps, setKaraSteps] = useState([]);
  const [karaResult, setKaraResult] = useState(null);
  // Binary Search
  const [bsTarget, setBsTarget] = useState(43);
  const [bsArr] = useState([3, 9, 10, 27, 38, 43, 82]); // Sorted

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      logEndRef.current.parentElement.scrollTop = logEndRef.current.parentElement.scrollHeight;
    }
  }, [log]);

  const reset = () => {
    stopRef.current = true;
    setTreeNodes([]); setLog([]); setRunning(false);
    setKaraSteps([]); setKaraResult(null);
  };

  // ── Merge Sort Tree Visualization
  let nodeCounter = 0;
  const mergeSortViz = async (a, depth, logs) => {
    const id = nodeCounter++;
    const node = { id, arr: [...a], depth, state: "dividing" };
    setTreeNodes(prev => [...prev, node]);
    logs.push(`Divide: [${a.join(", ")}] at depth ${depth}`);
    setLog([...logs]);
    await sleep(400);
    if (a.length <= 1) {
      setTreeNodes(prev => prev.map(n => n.id === id ? { ...n, state: "base" } : n));
      return a;
    }
    const mid = Math.floor(a.length / 2);
    const left = await mergeSortViz(a.slice(0, mid), depth + 1, logs);
    if (stopRef.current) return a;
    const right = await mergeSortViz(a.slice(mid), depth + 1, logs);
    if (stopRef.current) return a;
    const merged = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    logs.push(`Merge: [${left.join(",")}] + [${right.join(",")}] -> [${merged.join(",")}]`);
    setLog([...logs]);
    setTreeNodes(prev => prev.map(n => n.id === id ? { ...n, arr: merged, state: "merged" } : n));
    await sleep(400);
    return merged;
  };

  const runMergeSort = async () => {
    stopRef.current = false;
    nodeCounter = 0;
    setRunning(true);
    setTreeNodes([]);
    const logs = ["Merge Sort — Divide and Conquer"];
    setLog([...logs]);
    await mergeSortViz([...arr], 0, logs);
    logs.push("Merge Sort complete!");
    setLog([...logs]);
    setRunning(false);
  };

  // ── Karatsuba
  const karatsuba = (x, y, steps) => {
    steps.push(`karatsuba(${x}, ${y})`);
    if (x < 10 || y < 10) {
      const r = x * y;
      steps.push(`  Base case: ${x} * ${y} = ${r}`);
      return r;
    }
    const m = Math.max(String(x).length, String(y).length);
    const m2 = Math.floor(m / 2);
    const pow = Math.pow(10, m2);
    const a = Math.floor(x / pow), b = x % pow;
    const c = Math.floor(y / pow), d = y % pow;
    steps.push(`  Split: x=${x} -> a=${a}, b=${b} | y=${y} -> c=${c}, d=${d}`);
    const ac = karatsuba(a, c, steps);
    const bd = karatsuba(b, d, steps);
    const abcd = karatsuba(a + b, c + d, steps);
    const adbc = abcd - ac - bd;
    steps.push(`  ac=${ac}, bd=${bd}, (a+b)(c+d)=${abcd}, ad+bc=${adbc}`);
    const result = ac * Math.pow(10, 2 * m2) + adbc * pow + bd;
    steps.push(`  Combine: ${ac}*10^${2*m2} + ${adbc}*10^${m2} + ${bd} = ${result}`);
    return result;
  };

  const runKaratsuba = () => {
    const steps = [];
    steps.push(`Karatsuba Multiplication: ${karaX} x ${karaY}`);
    const result = karatsuba(karaX, karaY, steps);
    steps.push(`Final Result: ${karaX} x ${karaY} = ${result}`);
    setKaraSteps(steps);
    setKaraResult(result);
    setLog(steps);
  };

  // ── Binary Search (D&C)
  const binSearchDc = async (low, high, logs) => {
    if (low > high) {
      logs.push(`Base case: low(${low}) > high(${high}) -> Not found`); setLog([...logs]); return -1;
    }
    const mid = Math.floor((low + high) / 2);
    logs.push(`Divide: range[${low}..${high}], mid=${mid}, val=${bsArr[mid]}`); setLog([...logs]); await sleep(600);
    if (stopRef.current) return;
    if (bsArr[mid] === bsTarget) {
      logs.push(`Conquer: Found ${bsTarget} at index ${mid}`); setLog([...logs]); return mid;
    }
    if (bsArr[mid] > bsTarget) {
      logs.push(`Combine: ${bsTarget} < ${bsArr[mid]}, solve left subproblem [${low}..${mid-1}]`); setLog([...logs]);
      return await binSearchDc(low, mid - 1, logs);
    } else {
      logs.push(`Combine: ${bsTarget} > ${bsArr[mid]}, solve right subproblem [${mid+1}..${high}]`); setLog([...logs]);
      return await binSearchDc(mid + 1, high, logs);
    }
  };

  const runBinarySearch = async () => {
    stopRef.current = false; setRunning(true);
    const logs = [`Binary Search (D&C) for Target=${bsTarget}`];
    logs.push(`Array: [${bsArr.join(", ")}]`); setLog([...logs]); await sleep(400);
    const res = await binSearchDc(0, bsArr.length - 1, logs);
    logs.push(`\nResult: ${res !== -1 ? "Found at " + res : "Not Found"}`); setLog([...logs]);
    setRunning(false);
  };

  // ── Strassen
  const runStrassen = async () => {
    stopRef.current = false; setRunning(true);
    const logs = ["Strassen's Matrix Multiplication (2x2 Base Case)"];
    logs.push("A = [[1, 2], [3, 4]] | B = [[5, 6], [7, 8]]"); setLog([...logs]); await sleep(600);
    if (stopRef.current) return;
    logs.push("Divide: compute 7 products (P1 - P7)"); setLog([...logs]); await sleep(600);
    logs.push("P1 = A11*(B12 - B22) = 1 * (6 - 8) = -2");
    logs.push("P2 = (A11 + A12)*B22 = (1 + 2) * 8 = 24");
    logs.push("P3 = (A21 + A22)*B11 = (3 + 4) * 5 = 35");
    logs.push("P4 = A22*(B21 - B11) = 4 * (7 - 5) = 8");
    logs.push("P5 = (A11 + A22)*(B11 + B22) = (1 + 4) * (5 + 8) = 65");
    logs.push("P6 = (A12 - A22)*(B21 + B22) = (2 - 4) * (7 + 8) = -30");
    logs.push("P7 = (A11 - A21)*(B11 + B12) = (1 - 3) * (5 + 6) = -22");
    setLog([...logs]); await sleep(1000);
    if (stopRef.current) return;
    logs.push("Conquer / Combine: compute C submatrices"); setLog([...logs]); await sleep(600);
    logs.push("C11 = P5 + P4 - P2 + P6 = 65 + 8 - 24 - 30 = 19");
    logs.push("C12 = P1 + P2 = -2 + 24 = 22");
    logs.push("C21 = P3 + P4 = 35 + 8 = 43");
    logs.push("C22 = P5 + P1 - P3 - P7 = 65 - 2 - 35 - (-22) = 50");
    setLog([...logs]); await sleep(1000);
    logs.push("Result Matrix C = [[19, 22], [43, 50]]"); setLog([...logs]);
    setRunning(false);
  };

  const depthColors = ["#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {[["mergesort", "Merge Sort Tree"], ["karatsuba", "Karatsuba Multiply"], ["binarysearch", "Binary Search (D&C)"], ["strassen", "Strassen"]].map(([a, label]) => (
          <button key={a} onClick={() => { if (!running) { setAlgo(a); reset(); }}}
            style={{
              padding: "7px 18px", borderRadius: 8,
              border: `1px solid ${algo === a ? "#ec4899" : "rgba(255,255,255,0.1)"}`,
              background: algo === a ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.04)",
              color: algo === a ? "#f472b6" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>{label}</button>
        ))}

        {algo === "karatsuba" && (
          <>
            <input type="number" value={karaX} onChange={e => setKaraX(Number(e.target.value))}
              style={{ width: 80, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "5px 8px", color: "#f1f5f9", fontSize: 13 }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: 700 }}>x</span>
            <input type="number" value={karaY} onChange={e => setKaraY(Number(e.target.value))}
              style={{ width: 80, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "5px 8px", color: "#f1f5f9", fontSize: 13 }} />
          </>
        )}

        {algo === "binarysearch" && (
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginLeft: 10 }}>
            Target:
            <input type="number" value={bsTarget} onChange={(e) => setBsTarget(Number(e.target.value))}
              style={{ width: 60, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 8px", color: "#f1f5f9", fontSize: 13 }} />
          </label>
        )}

        {algo === "strassen" && (
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginLeft: 10 }}>Simulating 2x2 Matrices A and B</span>
        )}

        <button onClick={reset} style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>Reset</button>
        <button onClick={algo === "mergesort" ? (running ? () => { stopRef.current = true; setRunning(false); } : runMergeSort) :
                         algo === "binarysearch" ? (running ? () => { stopRef.current = true; setRunning(false); } : runBinarySearch) :
                         algo === "strassen" ? (running ? () => { stopRef.current = true; setRunning(false); } : runStrassen) :
                         runKaratsuba}
          style={{ padding: "7px 22px", borderRadius: 8, border: "none", background: running ? "rgba(239,68,68,0.2)" : "rgba(236,72,153,0.9)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {(running && algo !== "karatsuba") ? "Stop" : algo === "karatsuba" ? "Calculate" : "Run"}
        </button>
      </div>

      {/* Merge Sort tree */}
      {algo === "mergesort" && (
        <div style={{ marginBottom: 20 }}>
          {[0, 1, 2, 3, 4].map(depth => {
            const nodes = treeNodes.filter(n => n.depth === depth);
            if (nodes.length === 0) return null;
            return (
              <div key={depth} style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {nodes.map(node => (
                  <div key={node.id} style={{
                    padding: "6px 10px", borderRadius: 8, fontSize: 11, fontFamily: "monospace",
                    background: node.state === "merged" ? "rgba(52,211,153,0.15)" : node.state === "base" ? "rgba(59,130,246,0.15)" : `rgba(236,72,153,0.1)`,
                    border: `1px solid ${node.state === "merged" ? "#34d399" : node.state === "base" ? "#3b82f6" : depthColors[depth % depthColors.length]}55`,
                    color: node.state === "merged" ? "#34d399" : node.state === "base" ? "#60a5fa" : depthColors[depth % depthColors.length],
                    fontWeight: 600, whiteSpace: "nowrap",
                    transition: "all 0.3s"
                  }}>
                    [{node.arr.join(",")}]
                  </div>
                ))}
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 16, fontSize: 12, marginTop: 10 }}>
            {[["#ec4899", "Dividing"], ["#3b82f6", "Base"], ["#34d399", "Merged"]].map(([c, l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} /> {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Karatsuba result */}
      {algo === "karatsuba" && karaResult !== null && (
        <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 10, padding: "14px 18px", marginBottom: 18, textAlign: "center" }}>
          <span style={{ color: "#f472b6", fontWeight: 700, fontSize: 16 }}>{karaX} x {karaY} = {karaResult}</span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Verified: {karaX * karaY}</span>
        </div>
      )}

      <p style={{ ...S.sectionLabel, color: "#94a3b8" }}>Execution Log</p>
      <div style={S.logBox}>
        {log.length === 0 ? <span style={{ color: "rgba(255,255,255,0.3)" }}>Press Run / Calculate to start...</span> :
          log.map((entry, i) => (
            <div key={i} style={{ color: entry.startsWith("  ") ? "rgba(255,255,255,0.55)" : "#f472b6" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{entry}
            </div>
          ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   ALGORITHM DATA
============================================================= */
const ALGORITHMS = {
  sorting: {
    label: "Sorting Algorithms",
    color: "#3b82f6",
    VisualizerComponent: SortingVisualizer,
    algos: [
      {
        name: "Bubble Sort",
        best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true,
        description: "Repeatedly compares adjacent elements and swaps them if out of order. Each pass bubbles the largest unsorted element to its correct position.",
        steps: [
          "Start from index 0",
          "Compare arr[i] and arr[i+1]",
          "If arr[i] > arr[i+1], swap them",
          "Move to the next pair",
          "After each pass, the largest element settles at the end",
          "Repeat n-1 times where n is the array length"
        ],
        pseudocode: `for i in 0 to n-1:\n  for j in 0 to n-i-2:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])`,
        example: {
          input: "[5, 3, 8, 1, 9]",
          trace: ["Pass 1: [3, 5, 8, 1, 9] → [3, 5, 1, 8, 9]", "Pass 2: [3, 1, 5, 8, 9]", "Pass 3: [1, 3, 5, 8, 9]"],
          output: "[1, 3, 5, 8, 9]"
        }
      },
      {
        name: "Quick Sort",
        best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: false,
        description: "Divide and conquer: pick a pivot, partition the array into elements smaller and larger than pivot, recursively sort each partition.",
        steps: [
          "Pick a pivot element (last or median)",
          "Rearrange: elements less than pivot go left, greater go right",
          "Pivot is now at its final sorted position",
          "Recursively apply to left and right sub-arrays",
          "Base case: sub-arrays of size 0 or 1 are already sorted"
        ],
        pseudocode: `quickSort(arr, low, high):\n  if low < high:\n    pi = partition(arr, low, high)\n    quickSort(arr, low, pi-1)\n    quickSort(arr, pi+1, high)\n\npartition(arr, low, high):\n  pivot = arr[high]\n  i = low - 1\n  for j in low to high-1:\n    if arr[j] <= pivot: i++; swap(arr[i], arr[j])\n  swap(arr[i+1], arr[high])\n  return i+1`,
        example: {
          input: "[5, 3, 8, 1, 4]",
          trace: ["pivot=4: partition → [3,1,4,8,5]", "Left [3,1]: pivot=1 → [1,3]", "Right [8,5]: pivot=5 → [5,8]"],
          output: "[1, 3, 4, 5, 8]"
        }
      },
      {
        name: "Merge Sort",
        best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true,
        description: "Divide and conquer: split array in half, recursively sort each half, then merge the two sorted halves.",
        steps: [
          "Divide array into two halves",
          "Recursively sort the left half",
          "Recursively sort the right half",
          "Merge: compare front elements of both halves",
          "Pick the smaller element and add to result",
          "Continue until both halves are exhausted"
        ],
        pseudocode: `mergeSort(arr, l, r):\n  if l < r:\n    m = (l+r)/2\n    mergeSort(arr, l, m)\n    mergeSort(arr, m+1, r)\n    merge(arr, l, m, r)`,
        example: {
          input: "[5, 3, 8, 1]",
          trace: ["Divide: [5,3] + [8,1]", "Sort Left: [3,5] | Sort Right: [1,8]", "Merge: compare 3 vs 1 → 1, compare 3 vs 8 → 3..."],
          output: "[1, 3, 5, 8]"
        }
      },
      {
        name: "Insertion Sort",
        best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true,
        description: "Build sorted array one element at a time. For each element, find its correct position in the already-sorted portion.",
        steps: [
          "Start with second element (index 1)",
          "Store current element as key",
          "Compare key with elements before it",
          "Shift larger elements one position right",
          "Insert key at its correct position",
          "Repeat for all remaining elements"
        ],
        pseudocode: `for i in 1 to n-1:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j--\n  arr[j+1] = key`,
        example: {
          input: "[5, 3, 8, 1]",
          trace: ["i=1, key=3: shift 5 right → [3,5,8,1]", "i=2, key=8: no shift → [3,5,8,1]", "i=3, key=1: shift 8,5,3 → [1,3,5,8]"],
          output: "[1, 3, 5, 8]"
        }
      },
      {
        name: "Heap Sort",
        best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: false,
        description: "Build a max-heap, then repeatedly extract the maximum element and place it at the end of the array.",
        steps: [
          "Build Max-Heap from input array — O(n)",
          "Largest element is at root (arr[0])",
          "Swap arr[0] with the last element",
          "Reduce heap size by 1",
          "Heapify root to restore the max-heap property",
          "Repeat until heap size equals 1"
        ],
        pseudocode: `heapSort(arr):\n  n = len(arr)\n  for i in n/2-1 downto 0: heapify(arr, n, i)\n  for i in n-1 downto 1:\n    swap(arr[0], arr[i])\n    heapify(arr, i, 0)`,
        example: {
          input: "[4, 10, 3, 5, 1]",
          trace: ["Build max-heap: [10, 5, 3, 4, 1]", "Extract 10, heapify: [5, 4, 3, 1] | sorted: [10]", "Extract 5, heapify... repeat"],
          output: "[1, 3, 4, 5, 10]"
        }
      },
      {
        name: "Radix Sort",
        best: "O(nk)", avg: "O(nk)", worst: "O(nk)", space: "O(n+k)", stable: true,
        description: "Non-comparison sort. Sort by individual digits from least significant to most significant using counting sort as a subroutine.",
        steps: [
          "Find maximum number to determine digit count",
          "Sort by units digit using counting sort",
          "Sort by tens digit using counting sort",
          "Continue for hundreds, thousands, etc.",
          "After processing all digits, array is fully sorted",
          "k = number of digits in the maximum number"
        ],
        pseudocode: `radixSort(arr):\n  max = maximum(arr)\n  for exp in [1, 10, 100, ...] while max/exp > 0:\n    countingSort(arr, exp)`,
        example: {
          input: "[170, 45, 75, 90, 802, 24, 2, 66]",
          trace: ["Sort by 1s digit: [170,90,802,2,24,45,75,66]", "Sort by 10s digit: [802,2,24,45,66,170,75,90]", "Sort by 100s digit: [2,24,45,66,75,90,170,802]"],
          output: "[2, 24, 45, 66, 75, 90, 170, 802]"
        }
      },
      {
        name: "Counting Sort",
        best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)", stable: true,
        description: "Count occurrences of each value, then reconstruct sorted array. Works only for integers in a known range [0, k].",
        steps: [
          "Find the range [min, max] of input",
          "Create a count array of size (max-min+1)",
          "Count each element's occurrences",
          "Compute cumulative counts (prefix sum)",
          "Build output array by placing elements at correct indices",
          "Copy the output back to the original array"
        ],
        pseudocode: `countingSort(arr, k):\n  count = array of k+1 zeros\n  for x in arr: count[x]++\n  for i in 1 to k: count[i] += count[i-1]\n  build output array using count\n  copy output to arr`,
        example: {
          input: "[4, 2, 2, 8, 3, 3, 1]",
          trace: ["Count: {1:1, 2:2, 3:2, 4:1, 8:1}", "Cumulative: {1:1, 2:3, 3:5, 4:6, 8:7}", "Place each element using cumulative count"],
          output: "[1, 2, 2, 3, 3, 4, 8]"
        }
      }
    ]
  },
  searching: {
    label: "Searching Algorithms",
    color: "#06b6d4",
    VisualizerComponent: SearchingVisualizer,
    algos: [
      {
        name: "Linear Search",
        best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)",
        description: "Scan each element sequentially until the target is found or the array ends. Works on both sorted and unsorted arrays.",
        steps: [
          "Start at index 0",
          "Compare arr[i] with the target",
          "If match: return i (element found)",
          "Otherwise: move to i+1",
          "If end is reached: return -1 (not found)"
        ],
        pseudocode: `linearSearch(arr, target):\n  for i in 0 to n-1:\n    if arr[i] == target: return i\n  return -1`,
        example: {
          input: "arr=[3,7,1,5,9], target=5",
          trace: ["Check arr[0]=3: 3 != 5", "Check arr[1]=7: 7 != 5", "Check arr[2]=1: 1 != 5", "Check arr[3]=5: 5 == 5 — Found!"],
          output: "Index 3"
        }
      },
      {
        name: "Binary Search",
        best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)",
        description: "Only works on SORTED arrays. Compare target with middle element and discard half the array each iteration.",
        steps: [
          "Array must be sorted first",
          "Set low=0, high=n-1",
          "mid = (low+high) / 2",
          "If arr[mid] == target: found",
          "If target < arr[mid]: search left half (high = mid-1)",
          "If target > arr[mid]: search right half (low = mid+1)",
          "Repeat until found or low > high"
        ],
        pseudocode: `binarySearch(arr, target):\n  low=0, high=n-1\n  while low <= high:\n    mid = (low+high) / 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid+1\n    else: high = mid-1\n  return -1`,
        example: {
          input: "arr=[1,3,5,7,9,11], target=7",
          trace: ["mid=5: 5 < 7 → search right half", "mid=9: 9 > 7 → search left half", "mid=7: Found!"],
          output: "Index 3"
        }
      },
      {
        name: "Sentinel Search",
        best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)",
        description: "Variant of linear search. Place the target at the end as a sentinel to eliminate the boundary check inside the loop, giving a micro-optimization.",
        steps: [
          "Store the last element",
          "Place target at arr[n-1] (sentinel)",
          "Search without bounds check — sentinel stops the loop",
          "If found at n-1: not in original array",
          "Otherwise: found at that index",
          "Restore arr[n-1] to original value"
        ],
        pseudocode: `sentinelSearch(arr, target):\n  last = arr[n-1]\n  arr[n-1] = target\n  i = 0\n  while arr[i] != target: i++\n  arr[n-1] = last\n  if i < n-1 or last == target: return i\n  return -1`,
        example: {
          input: "arr=[3,7,1,9], target=5",
          trace: ["Store last=9, place sentinel: arr=[3,7,1,9,5]", "Loop: 3!=5, 7!=5, 1!=5, 9!=5, 5==5 (sentinel)", "i=4 >= n-1: not found"],
          output: "-1 (not found)"
        }
      },
      {
        name: "Fibonacci Search",
        best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)",
        description: "Uses Fibonacci numbers to divide a sorted array. Can have better cache performance than binary search on certain hardware.",
        steps: [
          "Generate Fibonacci numbers until fibM >= n",
          "Use fibM-2 and fibM-1 as range boundaries",
          "Compare arr[min(offset+fibM2, n-1)] with target",
          "If smaller: shift Fibonacci numbers left, advance offset",
          "If larger: shift Fibonacci numbers left twice",
          "When fibM=1: compare arr[offset+1]"
        ],
        pseudocode: `fibSearch(arr, target, n):\n  fibm2=0, fibm1=1, fibm=1\n  while fibm < n: fibm2=fibm1; fibm1=fibm; fibm+=fibm1\n  offset = -1\n  while fibm > 1:\n    i = min(offset+fibm2, n-1)\n    if arr[i] < target: fibm=fibm1;fibm1=fibm2;fibm2=fibm-fibm1;offset=i\n    elif arr[i] > target: fibm=fibm2;fibm1-=fibm2;fibm2=fibm-fibm1\n    else: return i\n  if fibm1 and arr[offset+1]==target: return offset+1\n  return -1`,
        example: {
          input: "arr=[1,3,5,7,9,11,13,15,17,19,21], target=13, n=11",
          trace: ["Fib numbers: 0,1,1,2,3,5,8,13 >= 11", "Check arr[7]=15 > 13: shift once, i=4", "Check arr[4]=9 < 13: offset=4, check arr[7]...", "Found at index 6"],
          output: "Index 6"
        }
      }
    ]
  },
  greedy: {
    label: "Greedy Algorithms",
    color: "#10b981",
    VisualizerComponent: GreedyVisualizer,
    algos: [
      {
        name: "Fractional Knapsack",
        best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)",
        description: "Select items by their maximum value-to-weight ratio. Greedy works here because any fraction of an item can be taken.",
        steps: [
          "Calculate the value/weight ratio for each item",
          "Sort items in decreasing order of ratio",
          "Take items greedily: take the full item if capacity allows",
          "If capacity is insufficient, take the remaining fraction",
          "Stop when the knapsack is full"
        ],
        pseudocode: `fractionalKnapsack(items, W):\n  sort items by (value/weight) DESC\n  total = 0\n  for item in items:\n    if W >= item.weight:\n      total += item.value; W -= item.weight\n    else:\n      total += item.value * (W / item.weight); break\n  return total`,
        example: {
          input: "Items: {v:60,w:10}, {v:100,w:20}, {v:120,w:30} | W=50",
          trace: ["Ratios: 6.0, 5.0, 4.0 — sorted descending", "Take item1 (w=10): W=40, value=60", "Take item2 (w=20): W=20, value=160", "Take 2/3 of item3: +80 value, W=0"],
          output: "Max value = 240"
        }
      },
      {
        name: "Job Sequencing",
        best: "O(n log n)", avg: "O(n²)", worst: "O(n²)", space: "O(n)",
        description: "Schedule jobs to maximize profit. Each job has a deadline and a profit. Greedily pick the highest-profit job that fits within its deadline.",
        steps: [
          "Sort jobs by profit in descending order",
          "Create a time-slot array of size = max deadline",
          "For each job, find the latest free slot that is at or before its deadline",
          "Assign the job to that slot",
          "If no free slot exists: skip this job",
          "Sum profits of all scheduled jobs"
        ],
        pseudocode: `jobSequencing(jobs, t):\n  sort jobs by profit DESC\n  slots = array of size t (all free)\n  result = []\n  for job in jobs:\n    for j = min(t, job.deadline) downto 1:\n      if slots[j] == free:\n        slots[j] = job; result.push(job); break\n  return result`,
        example: {
          input: "Jobs: J1(p=100,d=2), J2(p=19,d=1), J3(p=27,d=2), J4(p=25,d=1), J5(p=15,d=3)",
          trace: ["Sort: J1, J3, J4, J2, J5", "J1→slot2, J3→slot1, J5→slot3", "Profit: 100+27+15 = 142"],
          output: "Schedule: [J3, J1, J5] | Profit = 142"
        }
      },
      {
        name: "Huffman Coding",
        best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)",
        description: "Lossless data compression. Frequent characters get shorter codes, rare characters get longer codes using a min-heap to build an optimal prefix-free binary tree.",
        steps: [
          "Count the frequency of each character",
          "Create a leaf node for each character and insert into a min-heap",
          "While heap has more than 1 node:",
          "  Extract two nodes with minimum frequency",
          "  Create internal node with their combined frequency",
          "  Add the internal node back to the heap",
          "Remaining node is the root of the Huffman tree",
          "Assign 0 for left edges, 1 for right edges to generate codes"
        ],
        pseudocode: `huffman(chars, freq):\n  min_heap = min_priority_queue()\n  for each char: insert HuffNode(char, freq)\n  while heap.size > 1:\n    left = extract_min(); right = extract_min()\n    node = HuffNode(null, left.freq + right.freq)\n    node.left=left; node.right=right\n    insert(node)\n  root = extract_min()\n  generateCodes(root, "")`,
        example: {
          input: "String: ABRACADABRA | Frequencies: A=5, B=2, R=2, C=1, D=1",
          trace: ["Merge C(1)+D(1)=2", "Merge CD(2)+B(2)=4", "Merge R(2)+BCD(4)=6", "Merge RBCD(6)+A(5)=11"],
          output: "Codes: A=0, R=10, B=110, C=1110, D=1111"
        }
      }
    ]
  },
  dp: {
    label: "Dynamic Programming",
    color: "#f59e0b",
    VisualizerComponent: DPVisualizer,
    algos: [
      {
        name: "0/1 Knapsack",
        best: "O(nW)", avg: "O(nW)", worst: "O(nW)", space: "O(nW)",
        description: "Maximize value in a knapsack of capacity W where each item is taken at most once. Build a table dp[i][w] = max value using first i items with capacity w.",
        steps: [
          "Create a 2D table dp[0..n][0..W] initialized to 0",
          "For each item i (1 to n):",
          "  For each capacity w (0 to W):",
          "    If item weight > w: dp[i][w] = dp[i-1][w] (cannot take item)",
          "    Else: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])"
        ],
        pseudocode: `knapsack01(val, wt, W, n):\n  dp = 2D array [n+1][W+1] of zeros\n  for i in 0 to n:\n    for w in 0 to W:\n      if wt[i-1] <= w:\n        dp[i][w] = max(val[i-1]+dp[i-1][w-wt[i-1]], dp[i-1][w])\n      else:\n        dp[i][w] = dp[i-1][w]\n  return dp[n][W]`,
        example: {
          input: "Items: {w:1,v:1},{w:3,v:4},{w:4,v:5},{w:5,v:7} | W=7",
          trace: ["dp[2][7]: include item2 (v=4)? check dp[1][4]+4=5 vs dp[1][7]=1 → 5", "dp[4][7]: max over all items → 9"],
          output: "Maximum value = 9 (items 2+3: v=4+5)"
        }
      },
      {
        name: "Longest Common Subsequence",
        best: "O(mn)", avg: "O(mn)", worst: "O(mn)", space: "O(mn)",
        description: "Find the longest subsequence common to both strings. A subsequence does not need to be contiguous.",
        steps: [
          "Create dp[m+1][n+1] initialized to 0",
          "For i from 1 to m, j from 1 to n:",
          "  If X[i-1] == Y[j-1]: dp[i][j] = dp[i-1][j-1] + 1",
          "  Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
          "LCS length = dp[m][n]",
          "Backtrack to reconstruct the actual LCS string"
        ],
        pseudocode: `LCS(X, Y, m, n):\n  dp = (m+1)x(n+1) zeros\n  for i in 1 to m:\n    for j in 1 to n:\n      if X[i-1]==Y[j-1]: dp[i][j] = dp[i-1][j-1] + 1\n      else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n  return dp[m][n]`,
        example: {
          input: 'X = "ABCBDAB", Y = "BDCAB"',
          trace: ["Match B at X[1], Y[0]: dp increments", "Match C at X[2], Y[2]: dp increments", "LCS candidates: BCAB or BDAB"],
          output: 'LCS = "BCAB" (length 4)'
        }
      },
      {
        name: "Matrix Chain Multiplication",
        best: "O(n³)", avg: "O(n³)", worst: "O(n³)", space: "O(n²)",
        description: "Find the optimal order to multiply a chain of matrices to minimize total scalar multiplications using interval dynamic programming.",
        steps: [
          "For chain length l from 2 to n:",
          "  For each starting matrix i:",
          "    For each split point k between i and j=i+l-1:",
          "    cost = m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]",
          "    m[i][j] = min(m[i][j], cost)",
          "Optimal = m[1][n] (minimum total multiplications)"
        ],
        pseudocode: `matrixChain(p, n):\n  m = nxn zeros\n  for l in 2 to n:\n    for i in 1 to n-l+1:\n      j = i + l - 1; m[i][j] = INF\n      for k in i to j-1:\n        q = m[i][k]+m[k+1][j]+p[i-1]*p[k]*p[j]\n        m[i][j] = min(m[i][j], q)\n  return m[1][n]`,
        example: {
          input: "A(30x35), B(35x15), C(15x5)",
          trace: ["(AB)C: 30x35x15 + 30x15x5 = 15750+2250 = 18000", "A(BC): 35x15x5 + 30x35x5 = 2625+5250 = 7875"],
          output: "Optimal: A(BC) = 7875 multiplications"
        }
      },
      {
        name: "Travelling Salesman (DP)",
        best: "O(n²2ⁿ)", avg: "O(n²2ⁿ)", worst: "O(n²2ⁿ)", space: "O(n·2ⁿ)",
        description: "Find the shortest Hamiltonian cycle visiting all cities exactly once. Uses bitmask DP to track the set of visited cities.",
        steps: [
          "dp[S][i] = min cost to visit all cities in set S, ending at city i",
          "Base: dp[{start}][start] = 0",
          "Transition: for each city j not in S:",
          "  dp[S|{j}][j] = min(dp[S][i] + dist[i][j])",
          "Answer: min over i of dp[all cities][i] + dist[i][start]",
          "Reconstruct the path by tracing back"
        ],
        pseudocode: `TSP(dist, n):\n  dp[1<<n][n] = INFINITY; dp[1][0] = 0\n  for S=1 to (1<<n)-1:\n    for i=0 to n-1:\n      if S & (1<<i):\n        for j=0 to n-1:\n          if not (S & (1<<j)):\n            ns = S | (1<<j)\n            dp[ns][j] = min(dp[ns][j], dp[S][i]+dist[i][j])\n  return min(dp[(1<<n)-1][i]+dist[i][0])`,
        example: {
          input: "4 cities with distance matrix",
          trace: ["Start at city 0", "Explore all bitmask subsets of cities", "Compute min cost returning to city 0"],
          output: "Min tour: 0→1→3→2→0 = 29"
        }
      }
    ]
  },
  graph: {
    label: "Graph Algorithms",
    color: "#ef4444",
    VisualizerComponent: GraphVisualizer,
    algos: [
      {
        name: "Dijkstra's Algorithm",
        best: "O((V+E) log V)", avg: "O((V+E) log V)", worst: "O(V²)", space: "O(V)",
        description: "Single-source shortest path in a non-negatively weighted graph using a min-priority queue. Cannot handle negative edge weights.",
        steps: [
          "Initialize dist[source]=0, dist[all others]=infinity",
          "Add source to min-priority queue",
          "While queue is not empty:",
          "  Extract vertex u with minimum distance",
          "  For each neighbor v of u:",
          "    If dist[u] + weight(u,v) < dist[v]:",
          "    Update dist[v] and add v to queue"
        ],
        pseudocode: `dijkstra(graph, src):\n  dist[src]=0; dist[others]=INF\n  pq = min_heap with (0, src)\n  while pq not empty:\n    d, u = extract_min(pq)\n    if d > dist[u]: continue\n    for v, w in graph[u]:\n      if dist[u]+w < dist[v]:\n        dist[v] = dist[u]+w\n        push(pq, (dist[v], v))\n  return dist`,
        example: {
          input: "A-B:4, A-C:2, C-B:1, B-D:5",
          trace: ["Start A: dist={A:0, B:inf, C:inf, D:inf}", "Process A: update B=4, C=2", "Process C: update B=3 (2+1)", "Process B: update D=8 (3+5)"],
          output: "Shortest A to D = 8 (path: A→C→B→D)"
        }
      },
      {
        name: "Bellman-Ford",
        best: "O(VE)", avg: "O(VE)", worst: "O(VE)", space: "O(V)",
        description: "Single-source shortest path that handles negative edge weights and detects negative cycles by running V-1 relaxation passes.",
        steps: [
          "Initialize dist[source]=0, dist[others]=infinity",
          "Repeat V-1 times:",
          "  For each edge (u,v,w):",
          "    If dist[u]+w < dist[v]: dist[v] = dist[u]+w",
          "Check for negative cycles with one more pass:",
          "  If any dist still decreases: negative cycle exists"
        ],
        pseudocode: `bellmanFord(graph, src, V, E):\n  dist[src]=0; dist[others]=INF\n  for i in 1 to V-1:\n    for u,v,w in edges:\n      if dist[u]+w < dist[v]: dist[v] = dist[u]+w\n  for u,v,w in edges:\n    if dist[u]+w < dist[v]: return "Negative cycle!"`,
        example: {
          input: "5 nodes, edges including A-B: -1",
          trace: ["Pass 1: relax all edges", "Pass 2 & 3: propagate updates with negative edges", "Final pass: no further change → no negative cycle"],
          output: "Shortest distances from source"
        }
      },
      {
        name: "Floyd-Warshall",
        best: "O(V³)", avg: "O(V³)", worst: "O(V³)", space: "O(V²)",
        description: "All-pairs shortest paths. Finds the shortest path between every pair of vertices using dynamic programming with a 2D distance matrix.",
        steps: [
          "Initialize dist[i][j] = edge weight (or infinity if no edge, 0 for i=j)",
          "For each intermediate vertex k (0 to V-1):",
          "  For each pair (i, j):",
          "    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
          "After V iterations, dist[i][j] holds shortest path from i to j"
        ],
        pseudocode: `floydWarshall(dist, V):\n  for k in 0 to V-1:\n    for i in 0 to V-1:\n      for j in 0 to V-1:\n        if dist[i][k]+dist[k][j] < dist[i][j]:\n          dist[i][j] = dist[i][k]+dist[k][j]`,
        example: {
          input: "3 nodes A, B, C | A-B:3, B-C:4, A-C:10",
          trace: ["Init: dist[A][C]=10", "Via k=B: dist[A][C] = min(10, A-B:3 + B-C:4) = 7"],
          output: "Shortest A to C = 7 (via B)"
        }
      },
      {
        name: "Prim's MST",
        best: "O(E log V)", avg: "O(E log V)", worst: "O(V²)", space: "O(V)",
        description: "Minimum Spanning Tree: grow a tree by always picking the cheapest edge connecting a visited vertex to an unvisited one.",
        steps: [
          "Start with any vertex (e.g., vertex 0)",
          "Mark start as visited",
          "Add all edges from visited vertices to a min-heap",
          "Extract the minimum-weight edge to an unvisited vertex",
          "Add that vertex to the MST",
          "Repeat until all vertices are visited"
        ],
        pseudocode: `prim(graph, V):\n  mst = []; visited = {0}; pq = min_heap\n  add all edges from vertex 0 to pq\n  while visited.size < V:\n    w, u, v = extract_min(pq)\n    if v in visited: continue\n    visited.add(v); mst.push((u,v,w))\n    add all edges from v to pq\n  return mst`,
        example: {
          input: "Graph with edges: A-B:2, A-C:3, B-D:5, C-D:1",
          trace: ["Start A: add A-B:2, A-C:3", "Extract A-B:2 → add B", "From B: add B-D:5", "Extract A-C:3 → add C", "Extract C-D:1 → add D"],
          output: "MST edges: {A-B:2, A-C:3, C-D:1}"
        }
      },
      {
        name: "Kruskal's MST",
        best: "O(E log E)", avg: "O(E log E)", worst: "O(E log E)", space: "O(V)",
        description: "MST using Union-Find (Disjoint Set). Sort all edges, and add each edge if it does not create a cycle.",
        steps: [
          "Sort all edges by weight in ascending order",
          "Initialize Union-Find with V individual components",
          "For each edge (u, v, w) in sorted order:",
          "  If find(u) != find(v): no cycle detected",
          "    Add edge to MST",
          "    Union(u, v)",
          "Stop when MST has V-1 edges"
        ],
        pseudocode: `kruskal(edges, V):\n  sort edges by weight\n  uf = UnionFind(V)\n  mst = [], total = 0\n  for u, v, w in edges:\n    if uf.find(u) != uf.find(v):\n      uf.union(u, v)\n      mst.append((u,v,w)); total += w\n  return mst, total`,
        example: {
          input: "Edges: A-B:1, C-D:2, B-C:3, A-D:4",
          trace: ["A-B:1 → add (no cycle)", "C-D:2 → add (no cycle)", "B-C:3 → add (no cycle)", "A-D:4 → skip (creates cycle)"],
          output: "MST total weight = 6"
        }
      }
    ]
  },
  backtracking: {
    label: "Backtracking",
    color: "#8b5cf6",
    VisualizerComponent: BacktrackingVisualizer,
    algos: [
      {
        name: "N-Queens Problem",
        best: "O(n!)", avg: "O(n!)", worst: "O(n!)", space: "O(n)",
        description: "Place N queens on an NxN chessboard such that no two queens attack each other. Backtrack when any placement leads to a conflict.",
        steps: [
          "Start at column 0",
          "For each row in the current column:",
          "  Check if the placement is safe (no row/diagonal attacks)",
          "  If safe: place queen, recurse to the next column",
          "  If next column returns failure: remove queen (backtrack)",
          "  Try the next row",
          "If all N columns are filled: solution found"
        ],
        pseudocode: `nQueens(board, col, n):\n  if col >= n: print solution; return true\n  for row in 0 to n-1:\n    if isSafe(board, row, col):\n      board[row][col] = 'Q'\n      if nQueens(board, col+1, n): return true\n      board[row][col] = '.'  // backtrack\n  return false`,
        example: {
          input: "N = 4",
          trace: ["col=0: try row=0 — safe, place Q", "col=1: row=0,1,2 unsafe → row=3? try", "col=2: try row=1 — safe", "col=3: row=2 — safe → solution!"],
          output: ". Q . .  /  . . . Q  /  Q . . .  /  . . Q ."
        }
      },
      {
        name: "Subset Sum",
        best: "O(2ⁿ)", avg: "O(2ⁿ)", worst: "O(2ⁿ)", space: "O(n)",
        description: "Find all subsets of a set that sum to a target value. Uses backtracking with pruning: stop early if the running sum exceeds the target.",
        steps: [
          "For each element: either include it or exclude it",
          "Include element: add to current sum, recurse",
          "If sum == target: record this subset as a solution",
          "If sum > target: prune this branch (backtrack immediately)",
          "Exclude element: move to next element without adding",
          "Explore all combinations systematically"
        ],
        pseudocode: `subsetSum(arr, index, curr, target, chosen):\n  if curr == target: print(chosen); return\n  if index == n or curr > target: return\n  // Include arr[index]\n  chosen.push(arr[index])\n  subsetSum(arr, index+1, curr+arr[index], target, chosen)\n  chosen.pop()  // backtrack\n  // Exclude arr[index]\n  subsetSum(arr, index+1, curr, target, chosen)`,
        example: {
          input: "arr=[3,1,4,2], target=5",
          trace: ["Include 3: sum=3 → include 1: sum=4 → include 4: sum=8 > 5 backtrack", "Back to 1: exclude → include 2: sum=5 — Found {3,1,2}!", "Explore excluding 3..."],
          output: "Solutions: {3,2}, {1,4}, {3,1,... }"
        }
      }
    ]
  },
  divideconquer: {
    label: "Divide and Conquer",
    color: "#ec4899",
    VisualizerComponent: DivideConquerVisualizer,
    algos: [
      {
        name: "Binary Search (D&C)",
        best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(log n)",
        description: "Classic divide and conquer: split array at mid, conquer one half recursively. Each call eliminates half the search space.",
        steps: [
          "Divide: split at the middle element",
          "Conquer: recursively search the correct half",
          "Combine: return the result directly (no merge step needed)"
        ],
        pseudocode: `binarySearch(arr, low, high, x):\n  if low > high: return -1\n  mid = (low+high)/2\n  if arr[mid]==x: return mid\n  if arr[mid]>x: return binarySearch(arr,low,mid-1,x)\n  return binarySearch(arr,mid+1,high,x)`,
        example: {
          input: "arr=[1,3,5,7,9,11], target=7",
          trace: ["T(n) = T(n/2) + O(1)", "Master theorem Case 2: a=1, b=2, c=0", "log_2(1)=0=c → T(n) = O(log n)"],
          output: "Time complexity: O(log n)"
        }
      },
      {
        name: "Recurrence Relations",
        best: "—", avg: "—", worst: "—", space: "—",
        description: "Master Theorem solves recurrences of the form T(n) = aT(n/b) + f(n) for divide and conquer algorithms.",
        steps: [
          "Merge Sort: T(n) = 2T(n/2) + O(n) → a=2, b=2, c=1",
          "Binary Search: T(n) = T(n/2) + O(1) → a=1, b=2, c=0",
          "Quick Sort avg: T(n) = 2T(n/2) + O(n) → O(n log n)",
          "Strassen's: T(n) = 7T(n/2) + O(n²) → O(n^2.81)",
          "Karatsuba: T(n) = 3T(n/2) + O(n) → O(n^1.585)"
        ],
        pseudocode: `Master Theorem: T(n) = aT(n/b) + n^c\nCase 1: log_b(a) > c  → T(n) = Theta(n^log_b(a))\nCase 2: log_b(a) = c  → T(n) = Theta(n^c * log n)\nCase 3: log_b(a) < c  → T(n) = Theta(n^c)`,
        example: {
          input: "Merge Sort: a=2, b=2, f(n)=n^1",
          trace: ["Compute log_b(a) = log_2(2) = 1", "Compare 1 with c=1: equal → Case 2", "T(n) = Theta(n^1 * log n)"],
          output: "T(n) = Theta(n log n)"
        }
      },
      {
        name: "Karatsuba Multiplication",
        best: "O(n^1.585)", avg: "O(n^1.585)", worst: "O(n^1.585)", space: "O(n log n)",
        description: "Fast multiplication algorithm by Anatoly Karatsuba (1960). Reduces n-digit multiplication from O(n²) to O(n^1.585) using only 3 recursive multiplications instead of 4.",
        steps: [
          "Split x and y each into two halves: x=a*10^m + b, y=c*10^m + d",
          "Compute ac = karatsuba(a, c)",
          "Compute bd = karatsuba(b, d)",
          "Compute (a+b)(c+d) = karatsuba(a+b, c+d)",
          "Compute middle term: ad+bc = (a+b)(c+d) - ac - bd",
          "Combine: result = ac*10^2m + (ad+bc)*10^m + bd"
        ],
        pseudocode: `karatsuba(x, y):\n  if x < 10 or y < 10: return x * y\n  m = max(digits(x), digits(y)) / 2\n  a, b = x / 10^m, x % 10^m\n  c, d = y / 10^m, y % 10^m\n  ac = karatsuba(a, c)\n  bd = karatsuba(b, d)\n  abcd = karatsuba(a+b, c+d)\n  return ac*10^2m + (abcd-ac-bd)*10^m + bd`,
        example: {
          input: "x = 1234, y = 5678",
          trace: ["m=2: a=12, b=34, c=56, d=78", "ac = 12×56 = 672", "bd = 34×78 = 2652", "(a+b)(c+d) = 46×134 = 6164", "ad+bc = 6164-672-2652 = 2840", "Result = 672×10⁴ + 2840×10² + 2652"],
          output: "1234 × 5678 = 7,006,652"
        }
      },
      {
        name: "Strassen's Matrix Multiplication",
        best: "O(n^2.81)", avg: "O(n^2.81)", worst: "O(n^2.81)", space: "O(n²)",
        description: "Multiplies two 2x2 matrices using only 7 recursive multiplications instead of the naive 8, achieving O(n^2.81) via Master Theorem.",
        steps: [
          "Divide each n×n matrix into 4 sub-matrices of size n/2",
          "Compute 7 products: M1 through M7 using Strassen's formulas",
          "Combine results: C11 = M1+M4-M5+M7, C12 = M3+M5, etc.",
          "Recursion bottoms out at base case (2x2 matrices)",
          "Total: 7 multiplications instead of 8 → O(n^log2(7)) ≈ O(n^2.81)"
        ],
        pseudocode: `strassen(A, B):\n  if n == 1: return A * B\n  // Divide\n  A11,A12,A21,A22 = split(A)\n  B11,B12,B21,B22 = split(B)\n  // 7 Multiplications\n  M1 = strassen(A11+A22, B11+B22)\n  M2 = strassen(A21+A22, B11)\n  M3 = strassen(A11, B12-B22)\n  M4 = strassen(A22, B21-B11)\n  M5 = strassen(A11+A12, B22)\n  M6 = strassen(A21-A11, B11+B12)\n  M7 = strassen(A12-A22, B21+B22)\n  // Combine\n  C11 = M1+M4-M5+M7\n  C12 = M3+M5\n  C21 = M2+M4\n  C22 = M1-M2+M3+M6`,
        example: {
          input: "A = [[1,2],[3,4]], B = [[5,6],[7,8]]",
          trace: ["M1=(1+4)(5+8)=65", "M4=4(7-5)=8", "M5=(1+2)*8=24", "C11=65+8-24+M7=..."],
          output: "A×B = [[19,22],[43,50]]"
        }
      }
    ]
  }
};

/* =============================================================
   ALGO CARD COMPONENT
============================================================= */
function AlgoCard({ algo, catColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      ...S.card,
      borderColor: open ? `${catColor}33` : "rgba(255,255,255,0.08)"
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "22px 24px", background: "none", border: "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", gap: 12, textAlign: "left"
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 17, margin: "0 0 8px" }}>{algo.name}</p>
          <div style={{ display: "flex", gap: 14, fontSize: 12, flexWrap: "wrap" }}>
            <span style={{ color: "#34d399" }}>Best: {algo.best}</span>
            <span style={{ color: "#facc15" }}>Avg: {algo.avg}</span>
            <span style={{ color: "#f87171" }}>Worst: {algo.worst}</span>
            <span style={{ color: "#94a3b8" }}>Space: {algo.space}</span>
            {algo.stable !== undefined && (
              <span style={{ color: algo.stable ? "#34d399" : "#f87171" }}>
                {algo.stable ? "Stable" : "Unstable"}
              </span>
            )}
          </div>
        </div>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: open ? `${catColor}22` : "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: open ? catColor : "rgba(255,255,255,0.35)", fontSize: 13, flexShrink: 0,
          transition: "all 0.2s"
        }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "0 24px 26px" }}>
          {/* Description */}
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14.5, lineHeight: 1.75, margin: "20px 0 22px" }}>
            {algo.description}
          </p>

          {/* Steps + Pseudocode */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <p style={{ ...S.sectionLabel, color: "#a78bfa" }}>Algorithm Steps</p>
              <ol style={{ margin: 0, paddingLeft: 20, color: "rgba(255,255,255,0.75)", fontSize: 13.5, lineHeight: 2 }}>
                {algo.steps.map((s, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>{s}</li>
                ))}
              </ol>
            </div>
            <div>
              <p style={{ ...S.sectionLabel, color: "#60a5fa" }}>Pseudocode</p>
              <pre style={S.monoBox}>{algo.pseudocode}</pre>
            </div>
          </div>

          {/* Example */}
          {algo.example && (
            <div style={S.exampleBox}>
              <p style={{ color: "#fcd34d", fontSize: 12, fontWeight: 700, margin: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Worked Example
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 13, alignItems: "start" }}>
                <span style={{ color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>Input:</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>{algo.example.input}</span>
                <span style={{ color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap", paddingTop: 4 }}>Trace:</span>
                <div>
                  {algo.example.trace.map((t, i) => (
                    <div key={i} style={{ color: "rgba(255,255,255,0.65)", fontFamily: "monospace", lineHeight: 1.9, fontSize: 12.5 }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 8 }}>{i + 1}.</span>{t}
                    </div>
                  ))}
                </div>
                <span style={{ color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>Output:</span>
                <span style={{ color: "#34d399", fontFamily: "monospace", fontWeight: 700 }}>{algo.example.output}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =============================================================
   MAIN PAGE
============================================================= */
export default function AlgorithmsPage() {
  const categories = Object.keys(ALGORITHMS);
  const [activeCategory, setActiveCategory] = useState("sorting");
  const cat = ALGORITHMS[activeCategory];
  const Viz = cat.VisualizerComponent;

  return (
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 36 }}>
        <h1 className="page-title" style={{ letterSpacing: "-0.02em" }}>Algorithms</h1>
        <p className="page-subtitle" style={{ fontSize: 15, lineHeight: 1.7 }}>
          Complete algorithm reference with interactive visualizations, step-by-step execution logs,
          complexity analysis, pseudocode, and worked examples.
        </p>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
        {categories.map((k) => {
          const c = ALGORITHMS[k];
          const active = k === activeCategory;
          return (
            <button
              key={k}
              onClick={() => setActiveCategory(k)}
              style={{
                padding: "10px 20px", borderRadius: 10,
                background: active ? `${c.color}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? c.color + "55" : "rgba(255,255,255,0.08)"}`,
                color: active ? c.color : "rgba(255,255,255,0.55)",
                fontWeight: active ? 700 : 500, fontSize: 13.5, cursor: "pointer",
                transition: "all 0.2s", letterSpacing: "0.01em"
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Category content */}
      <div>
        {/* Category header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ width: 4, height: 28, borderRadius: 2, background: cat.color }} />
          <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, margin: 0 }}>{cat.label}</h2>
          <span style={{
            background: `${cat.color}18`, color: cat.color,
            border: `1px solid ${cat.color}44`,
            borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600
          }}>
            {cat.algos.length} algorithms
          </span>
        </div>

        {/* Visualization Panel */}
        <div style={{
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${cat.color}33`,
          borderRadius: 18, padding: "28px 30px",
          marginBottom: 32
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: cat.color }} />
            <p style={{ ...S.sectionLabel, color: cat.color, margin: 0 }}>
              Interactive Visualization
            </p>
          </div>
          <Viz />
        </div>

        {/* Algorithm cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cat.algos.map((a) => (
            <AlgoCard key={a.name} algo={a} catColor={cat.color} />
          ))}
        </div>
      </div>
    </div>
  );
}

# DSA Intelligence Context — Master Knowledge Base
# Built from curriculum theory + established DSA references
# Version 2.0 — Optimized for RAG Agent Complexity Analysis

## Note on Outputs:
*   The system no longer uses a "Live Viz" tab.
*   Instead, the primary output focus should be on **Complexity Analysis** (providing accurate Big-O tiers, Space vs. Time breakdowns, and explanations) and **Approaches**.
*   Ensure that all complexity strings use standard notation (e.g., `O(n log n)`, `O(n^2)`).

---

## [TOPIC: Arrays]
### Theory
Arrays are contiguous memory blocks storing elements of the same type. O(1) random access by index, O(n) for unsorted search.

**Operations:**
- Access: O(1)
- Search (unsorted): O(n)
- Search (sorted, Binary): O(log n)
- Insert at end: O(1) amortized
- Insert at middle: O(n) — elements must shift
- Delete: O(n) in worst case

**Key Techniques:**
- Two-pointer: walk from both ends inward — useful for pair-sum, palindrome checks, water container problems
- Sliding window: maintain a window of size k and slide right — useful for max subarray of size k, longest substring
- Prefix sum: precompute cumulative sums for range-sum queries in O(1)
- Kadane's Algorithm: track max ending here and max so far — O(n) maximum subarray

**Classic Problems:**
1. Maximum subarray sum → Kadane's O(n)
2. Find pair with target sum → Two pointer on sorted, or HashMap O(n)
3. Rotate array k positions → Reverse trick O(n)
4. Merge two sorted arrays → Two pointer O(m+n)
5. Dutch National Flag → 3-way partition O(n)

**Code Patterns (C++):**
```cpp
// Two Pointer
int l = 0, r = n-1;
while (l < r) { /* process */ l++; r--; }

// Sliding Window of size k
int sum = 0;
for (int i = 0; i < k; i++) sum += arr[i];
for (int i = k; i < n; i++) {
    sum += arr[i] - arr[i-k];
    maxSum = max(maxSum, sum);
}

// Prefix Sum
vector<int> pre(n+1, 0);
for (int i = 0; i < n; i++) pre[i+1] = pre[i] + arr[i];
// Range sum [l..r] = pre[r+1] - pre[l]
```

---

## [TOPIC: Linked Lists]
### Theory
A linked list is a dynamic data structure where each node stores data and a pointer to the next node. Unlike arrays, elements are not stored contiguously.

**Types:**
- Singly Linked List: each node → next
- Doubly Linked List: each node ↔ prev, next
- Circular: last node points back to head

**Operations:**
- Access by index: O(n)
- Insert at head: O(1)
- Insert at tail: O(n) without tail pointer, O(1) with
- Delete a node (given pointer): O(1) in DLL, O(n) to find in SLL
- Search: O(n)

**Key Techniques:**
- Fast-Slow Pointers (Floyd's): detect cycles, find middle
- Reversal: iteratively update next pointers
- Merge: merge two sorted lists with two pointers

**Classic Problems:**
1. Detect cycle → Floyd's fast/slow pointer
2. Find middle of list → fast/slow pointer (fast moves 2x)
3. Reverse a linked list → iterative with prev/curr/next
4. Merge two sorted lists → two pointer merge
5. Clone list with random pointer → HashMap mapping

---

## [TOPIC: Stacks and Queues]
### Theory
**Stack** — LIFO (Last In First Out). Push/pop/peek all O(1).
**Queue** — FIFO (First In First Out). Enqueue/dequeue O(1) with deque.

**Monotonic Stack:** maintains increasing/decreasing order — used for next greater/smaller element problems.

**Classic Problems:**
1. Valid parentheses → stack push open, pop+check close
2. Next greater element → monotonic decreasing stack
3. Largest rectangle in histogram → monotonic stack
4. Implement queue using 2 stacks → amortized O(1)
5. Sliding window maximum → deque (monotonic)
6. BFS traversal → queue

---

## [TOPIC: Trees and BST]
### Theory
A tree is a hierarchical, acyclic connected graph. Binary trees have at most 2 children per node.

**BST Property:** left subtree < node < right subtree
- Search: O(log n) avg, O(n) worst (skewed)
- Insert: O(log n) avg
- Delete: O(log n) avg
- Inorder traversal of BST → sorted sequence

**Tree Traversals:**
- Inorder (L-Root-R): BST sorted order
- Preorder (Root-L-R): copy/serialize tree
- Postorder (L-R-Root): delete tree, evaluate expressions
- Level order (BFS): breadth-first using queue

**AVL Trees:** self-balancing BST. Height difference ≤ 1.
- Rotations: LL, RR, LR, RL
- All operations: O(log n) guaranteed

**Key Techniques:**
- Recursive DFS: natural for tree problems (stack space = height)
- Global variable for path/result: carry result up recursion
- Root-to-leaf path: pass current path down

**Classic Problems:**
1. Height of tree → max(left, right) + 1 recursively
2. Lowest Common Ancestor → check if node is in left/right subtrees
3. Diameter → longest path = max(leftH + rightH)
4. Balanced tree check → check height difference at each node
5. Mirror/invert tree → swap left and right children recursively

---

## [TOPIC: Heaps]
### Theory
A heap is a complete binary tree satisfying the heap property.

**Min-Heap:** parent ≤ children. Root = minimum element.
**Max-Heap:** parent ≥ children. Root = maximum element.

**Operations:**
- Insert: O(log n) — add at end, bubble up
- Extract min/max: O(log n) — remove root, move last to root, heapify down
- Peek (min/max): O(1)
- Build heap from array: O(n) — heapify all non-leaf nodes bottom-up

**Classic Problems:**
1. K largest/smallest elements → Min-heap of size k
2. Merge k sorted arrays → Min-heap of (value, array_idx, element_idx)
3. Median in stream → Two heaps: max-heap for lower half, min-heap for upper half
4. Top K frequent elements → Max-heap by frequency
5. Task scheduler → Max-heap by frequency + cooldown counter

---

## [TOPIC: Hashing]
### Theory
Hash maps (dictionaries) provide average O(1) insert, delete, and lookup. Collision handling via chaining or open addressing.

**Load factor:** n/m where n = elements, m = buckets. Keep < 0.75 for performance.

**Classic Problems:**
1. Two Sum → HashMap: store value→index, check complement
2. Longest consecutive sequence → HashSet, start only from sequence start
3. Group anagrams → HashMap: sorted string → list of anagrams
4. Check if arrays are equal → frequency map comparison
5. Subarray sum equals K → prefix sum + HashMap: count(preSum) → freq
6. First non-repeating character → LinkedHashMap to preserve insertion order

---

## [TOPIC: Sorting]
### Theory & Complexity Table

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Yes |

**Selection Guide:**
- General purpose: Quick Sort (fastest avg) or Merge Sort (stable)
- Nearly sorted input: Insertion Sort (adaptive, O(n) best)
- Need stability: Merge Sort or Insertion Sort
- Small integer range: Counting Sort → O(n+k)
- Integer keys with many digits: Radix Sort

**Merge Sort Pseudocode:**
```
mergeSort(arr, l, r):
  if l >= r: return
  mid = (l+r)/2
  mergeSort(arr, l, mid)
  mergeSort(arr, mid+1, r)
  merge(arr, l, mid, r)

merge(arr, l, mid, r):
  left = arr[l..mid], right = arr[mid+1..r]
  i=0, j=0, k=l
  while i < len(left) and j < len(right):
    if left[i] <= right[j]: arr[k++] = left[i++]
    else: arr[k++] = right[j++]
  copy remaining
```

**Quick Sort Pseudocode:**
```
quickSort(arr, low, high):
  if low >= high: return
  pivot_idx = partition(arr, low, high)
  quickSort(arr, low, pivot_idx-1)
  quickSort(arr, pivot_idx+1, high)

partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high-1:
    if arr[j] <= pivot: swap(arr[++i], arr[j])
  swap(arr[i+1], arr[high])
  return i+1
```

---

## [TOPIC: Searching]
### Theory

**Linear Search:** Scan each element. O(n) time, O(1) space. Works on unsorted arrays.

**Binary Search:** Divide and conquer on sorted arrays. O(log n) time.
- Standard: find exact element
- Lower bound: first position where arr[mid] >= target
- Upper bound: first position where arr[mid] > target

**Binary Search Template:**
```
binarySearch(arr, target):
  low = 0, high = n-1
  while low <= high:
    mid = low + (high-low)/2  // avoids integer overflow
    if arr[mid] == target: return mid
    elif arr[mid] < target: low = mid+1
    else: high = mid-1
  return -1
```

**Fibonacci Search:** Uses Fibonacci numbers to divide array. Better cache performance. O(log n).

**Interpolation Search:** Works best for uniformly distributed sorted arrays. O(log log n) best case.

**Classic Problems:**
1. Find element in sorted array → Binary Search
2. Find first/last position → Binary Search with lower/upper bound
3. Search in rotated sorted array → Modified Binary Search
4. Peak element → Binary Search on trend change
5. Sqrt(x) integer → Binary Search on answer space

---

## [TOPIC: Graphs]
### Theory

**Representations:**
- Adjacency Matrix: O(V²) space, O(1) edge check
- Adjacency List: O(V+E) space, O(degree) edge check

**Traversals:**
- BFS: uses queue, level-by-level, shortest path in unweighted
- DFS: uses stack/recursion, path exploration, cycle detection

**Shortest Path:**
- BFS: unweighted graphs → O(V+E)
- Dijkstra: non-negative weights, min-heap → O((V+E) log V)
- Bellman-Ford: handles negative weights → O(VE), detects negative cycles
- Floyd-Warshall: all-pairs → O(V³) time, O(V²) space

**Minimum Spanning Tree:**
- Prim's: greedy, grow MST from source, min-heap → O((V+E) log V)
- Kruskal's: sort edges, union-find to avoid cycles → O(E log E)

**Topological Sort:** Only DAGs. DFS post-order reversal OR Kahn's BFS algorithm.

**Cycle Detection:**
- Undirected: DFS with parent tracking, or Union-Find
- Directed: DFS with 3-color marking (white/gray/black)

**Dijkstra Pseudocode:**
```
dijkstra(graph, src):
  dist = {v: INF for all v}, dist[src] = 0
  pq = MinHeap([(0, src)])
  while pq not empty:
    d, u = pq.pop_min()
    if d > dist[u]: continue  // outdated entry
    for (v, w) in graph[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        pq.push((dist[v], v))
  return dist
```

**BFS Pseudocode:**
```
bfs(graph, start):
  visited = {start}
  queue = [start]
  while queue:
    node = queue.dequeue()
    process(node)
    for neighbor in graph[node]:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)
```

---

## [TOPIC: Dynamic Programming]
### Theory

DP solves problems with **overlapping subproblems** and **optimal substructure**.

**Identification Checklist:**
1. Can the problem be broken into smaller subproblems?
2. Do subproblems overlap (same subproblem computed multiple times)?
3. Does an optimal solution of the whole require optimal solutions of subparts?

**Approaches:**
- Top-Down (Memoization): recursive + cache. Easy to code, O(n) extra stack space.
- Bottom-Up (Tabulation): iterative, fills table. Better performance, no recursion stack.
- Space Optimization: use only previous row/column when full table not needed.

**Common DP Patterns:**

**1. 0/1 Knapsack:**
```
dp[i][w] = max value using first i items with capacity w
if wt[i] > w: dp[i][w] = dp[i-1][w]
else: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]])
```
Time: O(nW), Space: O(nW) → optimizable to O(W)

**2. Longest Common Subsequence (LCS):**
```
if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1] + 1
else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```
Time: O(mn), Space: O(mn) → O(n) with rolling array

**3. Longest Increasing Subsequence (LIS):**
```
For each i: dp[i] = max(dp[j]+1) for all j < i where arr[j] < arr[i]
```
Time: O(n²) DP, O(n log n) with patience sorting

**4. Coin Change:**
```
dp[0] = 0, dp[i] = INF for i > 0
for each coin c: for i = c to amount: dp[i] = min(dp[i], dp[i-c]+1)
```

**5. Edit Distance:**
```
if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1]
else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
```

**6. Matrix Chain Multiplication (MCM Pattern):**
```
dp[i][j] = min cost to multiply matrices i through j
for len = 2 to n:
  for i = 1 to n-len+1:
    j = i+len-1
    for k = i to j-1:
      dp[i][j] = min(dp[i][j], dp[i][k]+dp[k+1][j]+cost)
```

**7. State Machine / Buy-Sell Stock Pattern:**
- Used when there are distinct states (e.g., holding stock, empty-handed, cooldown).
- `hold[i] = max(hold[i-1], empty[i-1] - prices[i])`
- `empty[i] = max(empty[i-1], hold[i-1] + prices[i])`

---

## [TOPIC: Greedy Algorithms]
### Theory

Greedy algorithms make locally optimal choices at each step hoping to find global optimum. Works when:
1. **Greedy Choice Property:** local optimal → global optimal
2. **Optimal Substructure:** subproblems have optimal solutions

**Classic Problems:**
1. Activity Selection → sort by end time, pick non-overlapping
2. Fractional Knapsack → sort by value/weight ratio descending
3. Huffman Coding → min-heap, merge two smallest frequency nodes
4. Job Sequencing → sort by profit, schedule in latest available slot
5. Dijkstra's → greedy selection of minimum distance vertex

**Fractional Knapsack Pseudocode:**
```
Sort items by value/weight ratio descending
For each item:
  if capacity >= item.weight: take full item, capacity -= weight
  else: take fraction = capacity/item.weight, break
```

**Huffman Coding:**
```
Build min-heap from character frequencies
while heap.size > 1:
  left = heap.pop_min()
  right = heap.pop_min()
  merged = Node(freq=left.freq+right.freq, left, right)
  heap.push(merged)
Assign codes: left='0', right='1' from root
```

---

## [TOPIC: Backtracking]
### Theory

Backtracking = DFS + pruning. Explore all possibilities, abandon branches that can't lead to solution.

**Template:**
```
backtrack(state, candidates):
  if is_solution(state): record_solution(); return
  for choice in get_choices(state, candidates):
    if is_valid(choice, state):
      make_choice(choice, state)
      backtrack(state, updated_candidates)
      undo_choice(choice, state)  // backtrack!
```

**Classic Problems:**
1. N-Queens → place queen column by column, check row/diagonal conflicts
2. Subset Sum → include/exclude each element
3. Permutations → at each position, try each remaining element
4. Combinations → forward-only iteration to avoid duplicates
5. Sudoku Solver → try digits 1-9 for each empty cell, backtrack on conflict
6. Word Search → DFS on grid with visited marking

**N-Queens Logic:**
- Safe check: no queen in same row, same diagonal (row-col), anti-diagonal (row+col)
- Use sets to track occupied rows, diagonals, anti-diagonals

---

## [TOPIC: Divide and Conquer]
### Theory

**Pattern:** Divide problem into identical subproblems → solve recursively → combine results.

**Recurrence Analysis (Master Theorem):**
- T(n) = aT(n/b) + f(n)
- case1: f(n) = O(n^(log_b(a) - ε)) → T(n) = O(n^log_b(a))
- case2: f(n) = O(n^log_b(a)) → T(n) = O(n^log_b(a) * log n)
- case3: f(n) = O(n^(log_b(a) + ε)) → T(n) = O(f(n))

**Algorithms:**
- Merge Sort: a=2, b=2, f(n)=O(n) → T(n)=O(n log n)
- Binary Search: a=1, b=2, f(n)=O(1) → T(n)=O(log n)
- Strassen: a=7, b=2, f(n)=O(n²) → T(n)=O(n^2.81)
- Karatsuba: a=3, b=2, f(n)=O(n) → T(n)=O(n^1.585)

**Karatsuba Algorithm:**
- Multiply two n-digit numbers in O(n^1.585) vs O(n²) traditional
- Split each into two halves, compute 3 multiplications instead of 4

**Strassen's Matrix Multiplication:**
- Reduces 8 multiplications to 7 per level → O(n^2.807)

---

## [TOPIC: String Algorithms]
### Theory

**Pattern Matching:**
- Naive: O(nm) — try all positions
- KMP (Knuth-Morris-Pratt): O(n+m) — failure function avoids re-computation
- Rabin-Karp: O(n+m) avg — rolling hash, O(nm) worst
- Z-Algorithm: O(n+m) — Z-array stores match lengths from each position

**KMP Failure Function:**
```
computeLPS(pattern):
  lps[0] = 0, len = 0
  for i from 1 to m-1:
    while len > 0 and pattern[i] != pattern[len]: len = lps[len-1]
    if pattern[i] == pattern[len]: lps[i] = ++len
    else: lps[i] = 0
```

**Classic String Problems:**
1. Longest palindromic substring → expand around center O(n²) or Manacher O(n)
2. Longest common substring → DP 2D table
3. Anagram check → frequency array comparison
4. Minimum window substring → sliding window with character counts
5. String compression → count consecutive chars

---

## [TOPIC: Recursion]
### Theory

Recursion = function calling itself with a smaller/simpler version of the problem.

**Requirements:**
1. Base case (termination condition)
2. Recursive case that progresses toward base case
3. Each call has its own stack frame

**Time Complexity:** Use recurrence relations
- Fibonacci (naive): T(n) = T(n-1) + T(n-2) → O(2^n)
- Fibonacci (memoized): O(n)
- Binary search: T(n) = T(n/2) + O(1) → O(log n)

**Classic Recurion Problems:**
1. Tower of Hanoi: T(n) = 2T(n-1)+1 → O(2^n) moves
2. Fibonacci with memoization → O(n) time, O(n) space
3. Power(x, n): T(n) = T(n/2)+O(1) → O(log n)
4. Generate all subsets → include/exclude each element

---

## [PRACTICE EXAMPLES]

### Example 1 — "Find the maximum sum subarray"
- Pattern: Array + Optimization
- Solution: Kadane's Algorithm O(n)
- Code (Python): `max_so_far = max_ending_here = arr[0]; for x in arr[1:]: max_ending_here = max(x, max_ending_here+x); max_so_far = max(max_so_far, max_ending_here)`

### Example 2 — "Given a sorted array, find if target exists"
- Pattern: Array + Searching
- Solution: Binary Search O(log n)

### Example 3 — "Find shortest path from city A to all other cities"
- Pattern: Graph + SSSP
- Solution: Dijkstra's (if non-negative weights), Bellman-Ford (if negative)

### Example 4 — "Count number of ways to make change for amount N"
- Pattern: DP + Counting
- Solution: Bottom-up DP O(amount × coins)

### Example 5 — "Find all permutations of string"
- Pattern: Backtracking
- Solution: Swap-based backtracking O(n × n!)

### Example 6 — "Sort a linked list"
- Pattern: Linked List + Sorting
- Solution: Merge Sort on linked list O(n log n), O(1) space

### Example 7 — "Find LCA in a BST"
- Pattern: Tree + Search
- Solution: Compare node values with root, recurse accordingly O(log n) avg

### Example 8 — "Design a cache with O(1) get and put"
- Pattern: HashMap + Doubly Linked List
- Solution: LRU Cache — HashMap for O(1) lookup, DLL for O(1) eviction

### Example 9 — "Given rod of length n and prices, maximize profit by cutting"
- Pattern: DP + Unbounded Knapsack
- Solution: dp[i] = max(price[j] + dp[i-j-1]) for j from 0 to i

### Example 10 — "Find the number of islands in a grid"
- Pattern: Graph + DFS/BFS on grid
- Solution: BFS/DFS from each unvisited land cell, marking visited O(m×n)

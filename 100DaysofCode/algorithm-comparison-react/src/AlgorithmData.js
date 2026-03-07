// src/AlgorithmData.js
export const algorithmData = [
    {
        type: "Sorting Algorithms",
        description: "Sorting algorithms arrange elements of a list in a certain order, either numerical or lexicographical.",
        algorithms: [
            {
                name: "Bubble Sort",
                link: "https://en.wikipedia.org/wiki/Bubble_sort",
                details: {
                    "Description": "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
                    "Mechanism": "Simple comparison and swapping of adjacent elements.",
                    "Time Complexity (Worst/Average)": "O(n^2)",
                    "Time Complexity (Best)": "O(n)",
                    "Space Complexity": "O(1)"
                },
                codeExample: `
function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
                `
            },
            {
                name: "Quick Sort",
                link: "https://en.wikipedia.org/wiki/Quicksort",
                details: {
                    "Description": "A divide-and-conquer algorithm that picks an element as a pivot and partitions the array around it.",
                    "Mechanism": "Divide and Conquer (pivot selection, partitioning, recursion).",
                    "Time Complexity (Average)": "O(n log n)",
                    "Time Complexity (Worst)": "O(n^2)",
                    "Space Complexity": "O(log n) (for recursion stack)"
                },
                codeExample: `
function quickSort(arr, low, high) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = (low - 1); // Index of smaller element

    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap
    return i + 1;
}
                `
            },
            {
                name: "Merge Sort",
                link: "https://en.wikipedia.org/wiki/Merge_sort",
                details: {
                    "Description": "Divides the unsorted list into n sublists, each containing one element, then repeatedly merges sublists to produce sorted sublists.",
                    "Mechanism": "Divide and Conquer (splitting, merging sorted sub-arrays).",
                    "Time Complexity (Worst/Average/Best)": "O(n log n)",
                    "Stability": "Stable (preserves relative order of equal elements).",
                    "Space Complexity": "O(n) (for temporary arrays)"
                },
                codeExample: `
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
                `
            },
            {
                name: "Insertion Sort",
                link: "https://en.wikipedia.org/wiki/Insertion_sort",
                details: {
                    "Description": "Builds the final sorted array one item at a time by inserting each element into its correct position among the already sorted elements.",
                    "Mechanism": "Iterative building, in-place sorting.",
                    "Time Complexity (Worst/Average)": "O(n^2)",
                    "Time Complexity (Best)": "O(n)",
                    "Space Complexity": "O(1)"
                },
                codeExample: `
function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;
    }
    return arr;
}
                `
            }
        ]
    },
    {
        type: "Searching Algorithms",
        description: "Searching algorithms are used to find an element or retrieve information from a data structure.",
        algorithms: [
            {
                name: "Linear Search",
                link: "https://en.wikipedia.org/wiki/Linear_search",
                details: {
                    "Description": "Checks each element in the list sequentially until a match is found or the list ends.",
                    "Mechanism": "Sequential comparison.",
                    "Data Requirement": "Applicable for both sorted and unsorted lists.",
                    "Time Complexity (Worst/Average)": "O(n)",
                    "Space Complexity": "O(1)"
                },
                codeExample: `
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Target found at index i
        }
    }
    return -1; // Target not found
}
                `
            },
            {
                name: "Binary Search",
                link: "https://en.wikipedia.org/wiki/Binary_search_algorithm",
                details: {
                    "Description": "Efficient search algorithm that repeatedly divides the search interval in half.",
                    "Mechanism": "Divide and Conquer (midpoint comparison).",
                    "Data Requirement": "Requires the data to be sorted.",
                    "Time Complexity": "O(log n)",
                    "Space Complexity": "O(1) iterative, O(log n) recursive"
                },
                codeExample: `
function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1; // Target not found
}
                `
            },
            {
                name: "Breadth-First Search (BFS)",
                link: "https://en.wikipedia.org/wiki/Breadth-first_search",
                details: {
                    "Description": "Explores all nodes at the present depth level before moving on to nodes at the next depth level in a graph.",
                    "Mechanism": "Graph traversal, uses a queue.",
                    "Guaranteed Property": "Finds shortest path in unweighted graphs.",
                    "Time Complexity": "O(V + E)",
                    "Space Complexity": "O(V)"
                },
                codeExample: `
function bfs(graph, startNode) {
    let visited = new Set();
    let queue = [startNode];
    visited.add(startNode);

    while (queue.length > 0) {
        let node = queue.shift(); // Dequeue
        // console.log(node); // Process node

        if (graph[node]) { // Check if node has neighbors defined
            for (let neighbor of graph[node]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor); // Enqueue
                }
            }
        }
    }
    return Array.from(visited); // Returns all visited nodes
}
                `
            },
            {
                name: "Depth-First Search (DFS)",
                link: "https://en.wikipedia.org/wiki/Depth-first_search",
                details: {
                    "Description": "Explores as far as possible along each branch before backtracking in a graph.",
                    "Mechanism": "Graph traversal, uses a stack (or recursion).",
                    "Guaranteed Property": "Will find a solution if one exists, but not necessarily the shortest.",
                    "Time Complexity": "O(V + E)",
                    "Space Complexity": "O(V)"
                },
                codeExample: `
function dfs(graph, startNode, visited = new Set(), result = []) {
    visited.add(startNode);
    result.push(startNode); // Process node

    if (graph[startNode]) { // Check if node has neighbors defined
        for (let neighbor of graph[startNode]) {
            if (!visited.has(neighbor)) {
                dfs(graph, neighbor, visited, result);
            }
        }
    }
    return result; // Returns all visited nodes
}
                `
            }
        ]
    },
    {
        type: "Graph Algorithms",
        description: "Graph algorithms are a set of instructions used to solve problems related to graphs (networks of nodes and edges).",
        algorithms: [
            {
                name: "Dijkstra's Algorithm",
                link: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm",
                details: {
                    "Description": "Finds the shortest paths from a single source node to all other nodes in a graph.",
                    "Constraint": "Works only with non-negative edge weights.",
                    "Approach": "Greedy approach, builds shortest path tree.",
                    "Time Complexity": "O(E log V) or O(E + V log V)",
                    "Applications": "Network routing, shortest routes in maps."
                }
            },
            {
                name: "Prim's Algorithm",
                link: "https://en.wikipedia.org/wiki/Prim%27s_algorithm",
                details: {
                    "Description": "Finds a Minimum Spanning Tree (MST) for a connected, undirected graph.",
                    "Approach": "Greedy approach, grows MST by adding minimum weight edges from current tree.",
                    "Graph Type": "Weighted, connected, undirected graphs.",
                    "Time Complexity": "O(E log V) or O(E + V log V)",
                    "Applications": "Network design, cluster analysis."
                }
            },
            {
                name: "Kruskal's Algorithm",
                link: "https://en.wikipedia.org/wiki/Kruskal%27s_algorithm",
                details: {
                    "Description": "Finds a Minimum Spanning Tree (MST) for a connected, undirected graph.",
                    "Approach": "Greedy approach, adds edges in increasing order of weight without forming cycles.",
                    "Data Structure Used": "Disjoint Set Union (DSU) for cycle detection.",
                    "Time Complexity": "O(E log E) or O(E log V)",
                    "Applications": "Network construction, circuit design."
                }
            },
            {
                name: "Floyd-Warshall Algorithm",
                link: "https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm",
                details: {
                    "Description": "Finds the shortest paths between all pairs of vertices in a weighted graph.",
                    "Approach": "Dynamic Programming.",
                    "Constraint": "Can handle negative edge weights, but no negative cycles.",
                    "Time Complexity": "O(V^3)",
                    "Applications": "Transitive closure, detecting negative cycles."
                }
            }
        ]
    },
    {
        type: "Dynamic Programming Algorithms",
        description: "Dynamic Programming (DP) is an algorithmic technique for solving complex problems by breaking them down into simpler subproblems.",
        algorithms: [
            {
                name: "Fibonacci Sequence (Memoization)",
                link: "https://en.wikipedia.org/wiki/Memoization",
                details: {
                    "Description": "Computes Fibonacci numbers by storing and reusing results of subproblems to avoid redundant calculations.",
                    "Approach": "Top-Down (Recursion with Memoization).",
                    "Concept": "Overlapping Subproblems.",
                    "Time Complexity": "O(n)",
                    "Space Complexity": "O(n) (for memoization table and recursion stack)"
                }
            },
            {
                name: "Longest Common Subsequence (LCS)",
                link: "https://en.wikipedia.org/wiki/Longest_common_subsequence_problem",
                details: {
                    "Description": "Finds the longest subsequence common to two sequences.",
                    "Approach": "Bottom-Up (Iterative with DP table).",
                    "Concept": "Optimal Substructure, Overlapping Subproblems.",
                    "Time Complexity": "O(m*n)",
                    "Space Complexity": "O(m*n)"
                }
            },
            {
                name: "Knapsack Problem (0/1)",
                link: "https://en.wikipedia.org/wiki/Knapsack_problem",
                details: {
                    "Description": "Aims to maximize the value of items in a knapsack without exceeding its weight capacity, where each item can only be included once.",
                    "Approach": "Dynamic Programming.",
                    "Choice per item": "0/1 (include or not include).",
                    "Time Complexity": "O(nW)",
                    "Applications": "Resource allocation, cutting stock problems."
                }
            },
            {
                name: "Edit Distance (Levenshtein Distance)",
                link: "https://en.wikipedia.org/wiki/Levenshtein_distance",
                details: {
                    "Description": "Calculates the minimum number of single-character edits (insertions, deletions, substitutions) required to change one string into another.",
                    "Approach": "Bottom-Up (Iterative with 2D array).",
                    "Concept": "Optimal Substructure, Overlapping Subproblems.",
                    "Time Complexity": "O(m*n)",
                    "Applications": "Spell checking, DNA sequence analysis."
                }
            }
        ]
    }
];
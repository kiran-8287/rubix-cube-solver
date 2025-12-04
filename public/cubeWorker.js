// cubeWorker.js
importScripts(
  "https://unpkg.com/cubejs/lib/cube.js",
  "https://unpkg.com/cubejs/lib/solve.js"
);

console.log("Worker: cube.js + solver loaded");

// Initialize solver (build lookup tables)
Cube.initSolver();

let solverReady = true;

self.onmessage = (event) => {
  const { action, facheletString } = event.data;

  if (action === "INIT") {
    self.postMessage({ type: "READY" });
  }

  if (action === "SOLVE") {
    if (!solverReady) {
      self.postMessage({ type: "ERROR", error: "Solver not ready yet" });
      return;
    }

    try {
      const cube = Cube.fromString(facheletString);
      const solution = cube.solve(); // ✅ instance method
      const moves = solution.trim().split(/\s+/);

      self.postMessage({
        type: "SOLVED",
        solution,
        moves,
        moveCount: moves.length,
      });
    } catch (err) {
      self.postMessage({ type: "ERROR", error: err.message });
    }
  }
};

console.log("Worker: Ready");

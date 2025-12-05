import { useEffect, useRef, useState } from 'react';

export const useCubeSolver = () => {
  const workerRef = useRef(null);
  const [solution, setSolution] = useState(null);
  const [moves, setMoves] = useState([]);
  const [solving, setSolving] = useState(false);
  const [solverReady, setSolverReady] = useState(false);
  const [error, setError] = useState(null);
  const [initProgress, setInitProgress] = useState('Initializing solver...');

  useEffect(() => {
    console.log('Hook: Creating worker...');
    const workerUrl = `${import.meta.env.BASE_URL}cubeWorker.js`;
    const worker = new Worker(workerUrl);
    workerRef.current = worker;

    worker.onmessage = (event) => {
      console.log('Hook: Raw worker message:', event.data);
      const { type, solution: sol, moves: mv, moveCount, error: err } = event.data;

      console.log('Hook: Worker message type:', type);

      if (type === 'READY') {
        console.log('Hook: Solver ready');
        setSolverReady(true);
        setInitProgress('');
      } else if (type === 'SOLVED') {
        console.log('Hook: Received solution:', sol?.substring(0, 50));
        console.log('Hook: Received moves:', mv);
        
        // Ensure moves is an array
        const movesArray = Array.isArray(mv) && mv.length > 0 
          ? mv 
          : (sol ? sol.trim().split(/\s+/).filter(Boolean) : []);
        
        console.log('Hook: Processed moves array:', movesArray);
        
        setSolution(sol);
        setMoves(movesArray);
        setSolving(false);
        setError(null);
      } else if (type === 'ERROR') {
        console.error('Hook: Worker error:', err);
        setError(err);
        setSolving(false);
      }
    };

    worker.onerror = (ev) => {
      // Provide richer diagnostics if message is missing
      const msg = ev?.message || ev?.error?.message || 'Unknown worker error';
      console.error('Hook: Worker error event:', ev);
      setError(`Worker error: ${msg}`);
      setSolverReady(false);
    };

    // Trigger init in worker
    console.log('Hook: Sending INIT action');
    worker.postMessage({ action: 'INIT' });

    // Simulate timeout for init (cube.js takes 4-5s)
    const initTimer = setTimeout(() => {
      if (!solverReady) {
        setInitProgress('Solver loading... (can take up to 5 seconds)');
      }
    }, 1000);

    return () => {
      clearTimeout(initTimer);
      worker.terminate();
    };
  }, []);

  const solve = (facheletString) => {
    console.log('Hook: Solve called with:', facheletString.substring(0, 20));
    
    if (!solverReady) {
      setError('Solver not ready');
      return;
    }

    setSolving(true);
    setError(null);
    setSolution(null);
    setMoves([]);

    workerRef.current.postMessage({
      action: 'SOLVE',
      facheletString,
    });
  };

  return {
    solve,
    solution,
    moves,
    solving,
    solverReady,
    error,
    initProgress,
  };
};
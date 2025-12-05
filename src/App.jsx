import { useReducer, useCallback, useEffect, useState } from 'react';
import { ColorPalette } from './components/ColorPalette';
import { CubeNetInput } from './components/CubeNetInput';
import { useCubeSolver } from './hooks/useCubeSolver';
import { validateCubeStateComplete } from './utils/validation';
import { cubeStateToFacheletString } from './utils/conversion';
import { loadTestCube, SOLVED_CUBE, SIMPLE_SCRAMBLE } from './utils/testCubes';
import { INITIAL_CUBE_STATE } from './utils/constants';
import { useKeyboard } from './hooks/useKeyboard';
import { cubeReducer } from './reducers/cubeReducer';
import { SolutionWalkthrough } from './components/SolutionWalkthrough';
import './styles/App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [state, dispatch] = useReducer(cubeReducer, {
    cubeState: INITIAL_CUBE_STATE,
    selectedColor: 'white',
    validationError: null,
    solving: false,
    solution: null,
  });

  const { solve, solution, moves, solving, solverReady, error: solverError, initProgress } = useCubeSolver();
  
  // Local state to track if cube is already solved
  const [isAlreadySolved, setIsAlreadySolved] = useState(false);
  
  // Reset solved state when cube changes
  useEffect(() => {
    setIsAlreadySolved(false);
  }, [state.cubeState]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const nodes = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const handleColorSelect = useCallback((color) => {
    dispatch({ type: 'SET_COLOR', payload: color });
  }, []);

  const handleStickerClick = useCallback((face, index, color) => {
    dispatch({
      type: 'SET_STICKER',
      payload: { face, index, color },
    });
  }, []);

  // Check if cube is already solved
  const isCubeSolved = useCallback((cubeState) => {
    const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
    for (const face of faces) {
      const firstColor = cubeState[face][0];
      // Check if all 9 stickers on this face are the same color
      for (let i = 1; i < 9; i++) {
        if (cubeState[face][i] !== firstColor) {
          return false;
        }
      }
    }
    return true;
  }, []);

  const handleValidateAndSolve = useCallback(() => {
    // Check if cube is already solved
    if (isCubeSolved(state.cubeState)) {
      dispatch({ type: 'SET_ERROR', payload: null });
      setIsAlreadySolved(true);
      return;
    }

    setIsAlreadySolved(false);

    const validation = validateCubeStateComplete(state.cubeState);

    if (!validation.valid) {
      dispatch({
        type: 'SET_ERROR',
        payload: validation.error,
      });
      return;
    }

    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SOLVING', payload: true });

    const facheletString = cubeStateToFacheletString(state.cubeState);
    console.log('App: Solving with facelet:', facheletString);
    
    solve(facheletString);
  }, [state.cubeState, solve, isCubeSolved]);

  useKeyboard({
    w: () => handleColorSelect('white'),
    y: () => handleColorSelect('yellow'),
    r: () => handleColorSelect('red'),
    o: () => handleColorSelect('orange'),
    b: () => handleColorSelect('blue'),
    g: () => handleColorSelect('green'),
    c: () => dispatch({ type: 'CLEAR_CUBE' }),
    s: () => handleValidateAndSolve(),
  });

  const progressCount = Object.values(state.cubeState).reduce(
    (count, face) => count + face.filter(s => s !== null).length,
    0
  );

  // Debug logging
  useEffect(() => {
    if (solution) {
      console.log('App render debug:', {
        solution: solution?.substring(0, 50),
        movesLength: moves?.length,
        moves: moves,
        solving,
        solverReady
      });
    }
  }, [solution, moves, solving, solverReady]);

  // Parse moves from solution if moves array is empty
  const displayMoves = moves && moves.length > 0 
    ? moves 
    : (solution ? solution.trim().split(/\s+/).filter(Boolean) : []);

  return (
    <div className="app-container">
      <div className="app-shell">
        <header className="app-header glass-card" data-animate>
          <div className="header-top">
            <div className="brand">
              <div className="brand-mark" aria-hidden>RC</div>
              <div>
                <h1>Rubik&apos;s Cube Solver</h1>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="icon-btn"
                aria-label="Toggle color theme"
                onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
                title="Toggle theme"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
              <a
                className="ghost-btn"
                href="https://github.com/kiran-8287/rubix-cube-solver"
                target="_blank"
                rel="noreferrer"
                aria-label="View project on GitHub"
              >
                <span role="img" aria-hidden>📂</span> GitHub
              </a>
            </div>
          </div>
          <div className="hero">
            <h2>Solving Rubik's Cube is easy now!</h2>
            <p>Fill the 54 stickers, validate instantly, and watch the solver animate every move.</p>
            <div className="meta-badges">
              <span className="pill">GPU-accelerated UI</span>
              <span className="pill">Keyboard-friendly</span>
              <span className="pill">Touch optimized</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          {initProgress && (
            <div className="init-banner glass-card" data-animate aria-live="polite">
              ⏳ {initProgress}
            </div>
          )}

          <div className="grid-two">
            <section className="glass-card" data-animate>
              <div className="section-title">
                <h3>Palette</h3>
                <span className="status-chip" aria-live="polite">
                  🎯 {progressCount}/54 stickers
                </span>
              </div>
              <ColorPalette
                selectedColor={state.selectedColor}
                onSelectColor={handleColorSelect}
              />
            </section>

            <section className="glass-card" data-animate>
              <div className="section-title">
                <h3>Controls</h3>
                <span className="status-chip">
                  {solverReady ? 'Ready to solve' : 'Initializing'} 
                </span>
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-primary btn-pulse"
                  onClick={handleValidateAndSolve}
                  disabled={progressCount < 54 || solving || !solverReady}
                  aria-live="polite"
                >
                  {!solverReady
                    ? '⏳ Initializing...'
                    : solving
                    ? '⚙️ Solving...'
                    : progressCount === 54
                    ? ' Solve Cube'
                    : `Fill cube (${progressCount}/54)`}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsAlreadySolved(false);
                    dispatch({ type: 'CLEAR_CUBE' });
                  }}
                  title="Clear all stickers"
                >
                  🗑️ Clear All
                </button>
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsAlreadySolved(false);
                    loadTestCube(SOLVED_CUBE, dispatch);
                  }}
                >
                  ✅ Load Solved
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsAlreadySolved(false);
                    loadTestCube(SIMPLE_SCRAMBLE, dispatch);
                  }}
                >
                  🎲 Load Scramble
                </button>
              </div>
            </section>
          </div>

          <section className="glass-card" data-animate aria-label="Cube net input">
            <CubeNetInput
              cubeState={state.cubeState}
              selectedColor={state.selectedColor}
              onStickerClick={handleStickerClick}
              progressCount={progressCount}
            />
          </section>

          {state.validationError && (
            <div className="error-message glass-card" data-animate aria-live="assertive">
              ❌ Validation Error: {state.validationError}
            </div>
          )}

          {solverError && (
            <div className="error-message glass-card" data-animate aria-live="assertive">
              ❌ Solver Error: {solverError}
            </div>
          )}


          {isAlreadySolved && (
            <div className="solution-container glass-card" data-animate>
              <div className="solution-header already-solved">
                🎉 Cube is Already Solved!
              </div>
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: 'var(--text-primary)',
                fontSize: '1.1rem'
              }}>
                <p>Your cube is in a solved state. No moves needed!</p>
                <div style={{ 
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(93, 227, 154, 0.15)',
                  borderRadius: '12px',
                  border: '1px solid rgba(93, 227, 154, 0.3)'
                }}>
                  <strong>All faces are uniform:</strong>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '8px', 
                    marginTop: '12px' 
                  }}>
                    {['U', 'R', 'F', 'D', 'L', 'B'].map(face => (
                      <div key={face} style={{ 
                        padding: '8px', 
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}>
                        {face}: {state.cubeState[face][0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="solution-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsAlreadySolved(false);
                    dispatch({ type: 'CLEAR_CUBE' });
                  }}
                  title="Start with a new cube"
                >
                  🔄 Solve Another Cube
                </button>
              </div>
            </div>
          )}

          {solution && displayMoves.length > 0 && !isAlreadySolved && (
            <div className="solution-container glass-card" data-animate>
              <div className="solution-header">
                ✅ Cube solved in <strong>{displayMoves.length} moves</strong>!
              </div>
              <SolutionWalkthrough moves={displayMoves} />
              <div className="solution-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(solution);
                    alert('📋 Solution copied to clipboard!');
                  }}
                  title="Copy move sequence"
                >
                  📋 Copy Solution
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsAlreadySolved(false);
                    dispatch({ type: 'CLEAR_CUBE' });
                  }}
                  title="Start with a new cube"
                >
                  🔄 Solve Another Cube
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer glass-card" data-animate>
          <div>Built for cubers • Glassmorphism SaaS aesthetic • Keyboard & touch ready</div>
          <div className="socials">
            <a href="https://github.com/kiran-8287" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.instagram.com/kiran_xd_?igsh=Z284N2xodHNmNDNv" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/in/sai-kiran-vullengala-20a407330/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </footer>
      </div>

      <div className="mobile-action-bar glass-card">
        <div className="mobile-action-inner">
          <button
            className="btn btn-primary"
            onClick={handleValidateAndSolve}
            disabled={progressCount < 54 || solving || !solverReady}
            aria-label={!solverReady ? 'Initializing solver' : solving ? 'Solving cube' : progressCount === 54 ? 'Solve cube' : `Fill cube (${progressCount}/54 stickers)`}
          >
            {!solverReady
              ? '⏳ Initializing...'
              : solving
              ? '⚙️ Solving...'
              : progressCount === 54
              ? '✅ Solve Cube'
              : `Fill (${progressCount}/54)`}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setIsAlreadySolved(false);
              dispatch({ type: 'CLEAR_CUBE' });
            }}
            aria-label="Clear all stickers"
          >
            🗑️ Clear All
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setIsAlreadySolved(false);
              loadTestCube(SOLVED_CUBE, dispatch);
            }}
            aria-label="Load solved test cube"
          >
            ✅ Solved
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setIsAlreadySolved(false);
              loadTestCube(SIMPLE_SCRAMBLE, dispatch);
            }}
            aria-label="Load scrambled test cube"
          >
            🎲 Scramble
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default App;
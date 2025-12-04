import { useReducer, useCallback } from 'react';
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
  const [state, dispatch] = useReducer(cubeReducer, {
    cubeState: INITIAL_CUBE_STATE,
    selectedColor: 'white',
    validationError: null,
    solving: false,
    solution: null,
  });

  const { solve, solution, moves, solving, solverReady, error: solverError, initProgress } = useCubeSolver();

  const handleColorSelect = useCallback((color) => {
    dispatch({ type: 'SET_COLOR', payload: color });
  }, []);

  const handleStickerClick = useCallback((face, index, color) => {
    dispatch({
      type: 'SET_STICKER',
      payload: { face, index, color },
    });
  }, []);

  const handleValidateAndSolve = useCallback(() => {
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
  }, [state.cubeState, solve]);

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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🧩 Rubik's Cube Solver</h1>
        <p>Select colors and fill all 54 stickers to solve your cube</p>
      </header>

      <main className="app-main">
        {initProgress && (
          <div className="init-message">
            ⏳ {initProgress}
          </div>
        )}

        <ColorPalette
          selectedColor={state.selectedColor}
          onSelectColor={handleColorSelect}
        />

        <CubeNetInput
          cubeState={state.cubeState}
          selectedColor={state.selectedColor}
          onStickerClick={handleStickerClick}
          progressCount={progressCount}
        />

        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={handleValidateAndSolve}
            disabled={progressCount < 54 || solving || !solverReady}
          >
            {!solverReady
              ? '⏳ Initializing...'
              : solving
              ? '⚙️ Solving...'
              : progressCount === 54
              ? '🔍 Solve Cube'
              : `Fill cube first (${progressCount}/54)`}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => dispatch({ type: 'CLEAR_CUBE' })}
          >
            🗑️ Clear All
          </button>
        </div>

        {state.validationError && (
          <div className="error-message">
            ❌ Validation Error: {state.validationError}
          </div>
        )}

        {solverError && (
          <div className="error-message">
            ❌ Solver Error: {solverError}
          </div>
        )}

        {solution && (
          <div className="solution-container">
            <div className="solution-header">
              ✅ Cube solved in <strong>{moves.length} moves</strong>!
            </div>
            <SolutionWalkthrough moves={moves} />
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
                onClick={() => dispatch({ type: 'CLEAR_CUBE' })}
                title="Start with a new cube"
              >
                🔄 Solve Another Cube
              </button>
            </div>
          </div>
        )}

        <div className="test-buttons">
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '10px' }}>
            📝 Development: Load test cubes
          </p>
          <button
            className="btn btn-test"
            onClick={() => loadTestCube(SOLVED_CUBE, dispatch)}
          >
            Load Solved Cube
          </button>
          <button
            className="btn btn-test"
            onClick={() => loadTestCube(SIMPLE_SCRAMBLE, dispatch)}
          >
            Load Scrambled Cube
          </button>
        </div>
      </main>
    </div>
  );
  
}

export default App;
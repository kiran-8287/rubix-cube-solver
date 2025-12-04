import React, { useState, useEffect } from 'react';
import '../styles/Solution.css';

export const SolutionWalkthrough = ({ moves = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || moves.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < moves.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setPlaying(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [playing, currentStep, moves.length]);

  if (!moves.length) {
    return null;
  }

  const nextMoves = moves.slice(currentStep + 1, currentStep + 6);
  const isSolved = currentStep === moves.length - 1;

  return (
    <div className="solution-walkthrough">
      <div className="walkthrough-header">
        <h3>📋 Solution Walkthrough</h3>
        <span className="move-counter">
          {currentStep + 1} / {moves.length}
        </span>
      </div>

      <div className="move-display">
        <div className="current-move-large">{moves[currentStep]}</div>
        {isSolved && <div className="solved-badge">✅ SOLVED!</div>}
      </div>

      {nextMoves.length > 0 && (
        <div className="next-moves">
          <strong>Next moves:</strong>
          <div className="moves-list">{nextMoves.join(' ')}</div>
        </div>
      )}

      <div className="walkthrough-controls">
        <button
          className="btn btn-control"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          title="Go to previous move"
        >
          ◀ Previous
        </button>
        <button
          className="btn btn-play"
          onClick={() => setPlaying(!playing)}
          title={playing ? 'Pause animation' : 'Play animation'}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="btn btn-control"
          onClick={() => setCurrentStep(Math.min(moves.length - 1, currentStep + 1))}
          disabled={currentStep === moves.length - 1}
          title="Go to next move"
        >
          Next ▶
        </button>
      </div>

      <div className="move-history">
        <p className="all-moves-label">All moves:</p>
        <div className="all-moves-display">
          {moves.map((move, idx) => (
            <span
              key={idx}
              className={`move-badge ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(idx)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && setCurrentStep(idx)}
              title={`Jump to move ${idx + 1}`}
            >
              {move}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
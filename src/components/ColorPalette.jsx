import React from 'react';
import { COLORS } from '../utils/constants';
import '../styles/Solution.css'; // we'll add palette styling there

export const ColorPalette = ({ selectedColor, onSelectColor }) => {
  return (
    <div className="color-palette">
      <h3>Select a Color</h3>
      <div className="color-buttons">
        {COLORS.map(color => (
          <button
            key={color.name}
            className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onSelectColor(color.name)}
            title={color.label}
            aria-label={`Select ${color.label}`}
          >
            {selectedColor === color.name && '✓'}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="selected-color-display">
          Selected: <strong>{selectedColor.toUpperCase()}</strong>
        </p>
      )}
    </div>
  );
};
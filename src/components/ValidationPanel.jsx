import React from 'react';

export const ValidationPanel = ({ validationErrors, isValid }) => {
  if (validationErrors.length === 0) {
    return null;
  }

  return (
    <div className="validation-panel">
      <h3>⚠️ Validation Issues</h3>
      <ul>
        {validationErrors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
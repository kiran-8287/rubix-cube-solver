import React from 'react';
import { COLOR_MAP } from '../utils/constants';

export const Sticker = React.memo(({ 
  color, 
  onClick, 
  selected,
  faceLabel,
  index 
}) => {
  const backgroundColor = color ? COLOR_MAP[color] : '#f0f0f0';
  
  return (
    <button
      className={`sticker ${selected ? 'selected' : ''} ${!color ? 'empty' : ''}`}
      style={{ backgroundColor }}
      onClick={onClick}
      title={`${faceLabel}-${index}`}
      aria-label={`Face ${faceLabel} sticker ${index}${color ? ` colored ${color}` : ''}`}
    />
  );
});

Sticker.displayName = 'Sticker';
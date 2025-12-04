import React, { useCallback } from 'react';
import { Sticker } from './Sticker';
import { FACES, FACE_LABELS } from '../utils/constants';
import '../styles/CubeNet.css';

export const CubeNetInput = ({ 
  cubeState, 
  selectedColor, 
  onStickerClick,
  progressCount 
}) => {
  const handleStickerClick = useCallback((face, index) => {
    onStickerClick(face, index, selectedColor);
  }, [selectedColor, onStickerClick]);

  return (
    <div className="cube-input-container">
      <div className="progress-section">
        <h3>Fill the Cube</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(progressCount / 54) * 100}%` }}
          />
        </div>
        <p className="progress-text">{progressCount} / 54 stickers filled</p>
      </div>

      <div className="cube-net">
        {/* UP face */}
        <div className="face face-U">
          <h4>{FACE_LABELS.U}</h4>
          {cubeState.U.map((color, idx) => (
            <Sticker
              key={`U-${idx}`}
              color={color}
              onClick={() => handleStickerClick('U', idx)}
              selected={false}
              faceLabel="U"
              index={idx}
            />
          ))}
        </div>

        {/* LEFT face */}
        <div className="face face-L">
          <h4>{FACE_LABELS.L}</h4>
          {cubeState.L.map((color, idx) => (
            <Sticker
              key={`L-${idx}`}
              color={color}
              onClick={() => handleStickerClick('L', idx)}
              selected={false}
              faceLabel="L"
              index={idx}
            />
          ))}
        </div>

        {/* FRONT face */}
        <div className="face face-F">
          <h4>{FACE_LABELS.F}</h4>
          {cubeState.F.map((color, idx) => (
            <Sticker
              key={`F-${idx}`}
              color={color}
              onClick={() => handleStickerClick('F', idx)}
              selected={false}
              faceLabel="F"
              index={idx}
            />
          ))}
        </div>

        {/* RIGHT face */}
        <div className="face face-R">
          <h4>{FACE_LABELS.R}</h4>
          {cubeState.R.map((color, idx) => (
            <Sticker
              key={`R-${idx}`}
              color={color}
              onClick={() => handleStickerClick('R', idx)}
              selected={false}
              faceLabel="R"
              index={idx}
            />
          ))}
        </div>

        {/* BACK face */}
        <div className="face face-B">
          <h4>{FACE_LABELS.B}</h4>
          {cubeState.B.map((color, idx) => (
            <Sticker
              key={`B-${idx}`}
              color={color}
              onClick={() => handleStickerClick('B', idx)}
              selected={false}
              faceLabel="B"
              index={idx}
            />
          ))}
        </div>

        {/* DOWN face */}
        <div className="face face-D">
          <h4>{FACE_LABELS.D}</h4>
          {cubeState.D.map((color, idx) => (
            <Sticker
              key={`D-${idx}`}
              color={color}
              onClick={() => handleStickerClick('D', idx)}
              selected={false}
              faceLabel="D"
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
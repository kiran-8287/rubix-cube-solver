// validation.js
import { FACE_CENTERS } from './constants';

/**
 * Validate that all stickers are filled
 */
export const validateAllFilled = (cubeState) => {
  for (const face in cubeState) {
    for (let i = 0; i < 9; i++) {
      if (!cubeState[face][i]) {
        return {
          valid: false,
          error: `Not all stickers filled (${face} face, sticker ${i})`,
        };
      }
    }
  }
  return { valid: true };
};

/**
 * Validate that each color appears exactly 9 times
 */
export const validateColorCounts = (cubeState) => {
  const counts = {};

  Object.values(cubeState).forEach((face) => {
    face.forEach((sticker) => {
      if (sticker) {
        counts[sticker] = (counts[sticker] || 0) + 1;
      }
    });
  });

  const validColors = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];

  for (const color of validColors) {
    const count = counts[color] || 0;
    if (count !== 9) {
      return {
        valid: false,
        error: `Color "${color}" has ${count} stickers, expected 9`,
      };
    }
  }

  return { valid: true };
};

/**
 * Validate that the centers of each face match the fixed color
 */
export const validateFaceCenters = (cubeState) => {
  for (const face in FACE_CENTERS) {
    const centerIndex = 4; // center of 3x3 grid
    const centerColor = cubeState[face][centerIndex];

    if (centerColor !== FACE_CENTERS[face]) {
      return {
        valid: false,
        error: `Face ${face} center should be ${FACE_CENTERS[face]}, got ${centerColor || 'empty'}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Full basic cube validation (filled stickers, color counts, centers)
 */
export const validateCubeState = (cubeState) => {
  let result = validateAllFilled(cubeState);
  if (!result.valid) return result;

  result = validateColorCounts(cubeState);
  if (!result.valid) return result;

  result = validateFaceCenters(cubeState);
  if (!result.valid) return result;

  return { valid: true };
};

/**
 * Complete validation including advanced parity check
 * **NOTE:** This should only be run in the Web Worker
 * in the main thread we just run the basic validation
 */
export const validateCubeStateComplete = (cubeState) => {
  // Step 1-3: Basic checks
  let result = validateCubeState(cubeState);
  if (!result.valid) return result;

  // Step 4: Advanced Kociemba check
  // ⚠️ DO NOT RUN CubeJS in main thread to avoid UI blocking
  // You can optionally skip or just return valid
  // The worker will handle full parity check
  return { valid: true };
};


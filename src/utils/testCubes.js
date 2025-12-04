// Pre-made valid cube states for testing

export const SOLVED_CUBE = {
  U: ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
  R: ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
  F: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
  D: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
  L: ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'],
  B: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
};

export const SIMPLE_SCRAMBLE = {
  U: ['blue', 'blue', 'blue', 'blue', 'white', 'blue', 'blue', 'blue', 'blue'],
  R: ['white', 'white', 'white', 'white', 'red', 'white', 'white', 'white', 'white'],
  F: ['orange', 'orange', 'orange', 'orange', 'green', 'orange', 'orange', 'orange', 'orange'],
  D: ['green', 'green', 'green', 'green', 'yellow', 'green', 'green', 'green', 'green'],
  L: ['yellow', 'yellow', 'yellow', 'yellow', 'orange', 'yellow', 'yellow', 'yellow', 'yellow'],
  B: ['red', 'red', 'red', 'red', 'blue', 'red', 'red', 'red', 'red'],
};

// Helper: Load a test cube into the app
export const loadTestCube = (cubeState, dispatch) => {
  Object.keys(cubeState).forEach(face => {
    cubeState[face].forEach((color, index) => {
      dispatch({
        type: 'SET_STICKER',
        payload: { face, index, color },
      });
    });
  });
};
export const cubeStateToFacheletString = (cubeState) => {
  const colorMap = {
    white: 'U',
    yellow: 'D',
    green: 'F',
    blue: 'B',
    red: 'R',
    orange: 'L',
  };

  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  let facheletString = '';

  for (const face of faceOrder) {
    for (const sticker of cubeState[face]) {
      facheletString += colorMap[sticker];
    }
  }

  return facheletString;
};

export const facheletStringToCubeState = (facheletString) => {
  const reverseColorMap = {
    U: 'white',
    D: 'yellow',
    F: 'green',
    B: 'blue',
    R: 'red',
    L: 'orange',
  };

  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  const cubeState = {};

  let index = 0;
  for (const face of faceOrder) {
    cubeState[face] = [];
    for (let i = 0; i < 9; i++) {
      cubeState[face].push(reverseColorMap[facheletString[index]]);
      index++;
    }
  }

  return cubeState;
};
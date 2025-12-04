export const FACES = ['U','R','F','D','L','B'];

export const FACE_LABELS = {
    U: 'Up (White)',
    D: 'Down (Yellow)',
    F: 'Front (Green)',
    B: 'Back (Blue)',
    R: 'Right (Red)',
    L: 'Left (Orange)',
}

export const COLOR_MAP = {
    white: '#FFFFFF',
    yellow: '#FFFF00',
    red: '#FF0000',
    orange: '#FF9900',
    blue: '#0066FF',
    green: '#00CC00',
}

export const FACE_CENTERS = {
  U: 'white',
  D: 'yellow',
  F: 'green',
  B: 'blue',
  R: 'red',
  L: 'orange',
};

export const INITIAL_CUBE_STATE = {
  U: Array(9).fill(null),
  R: Array(9).fill(null),
  F: Array(9).fill(null),
  D: Array(9).fill(null),
  L: Array(9).fill(null),
  B: Array(9).fill(null),
};

export const COLORS = [
  { name: 'white', hex: '#FFFFFF', label: 'White' },
  { name: 'yellow', hex: '#FFFF00', label: 'Yellow' },
  { name: 'red', hex: '#FF0000', label: 'Red' },
  { name: 'orange', hex: '#FF9900', label: 'Orange' },
  { name: 'blue', hex: '#0066FF', label: 'Blue' },
  { name: 'green', hex: '#00CC00', label: 'Green' },
];
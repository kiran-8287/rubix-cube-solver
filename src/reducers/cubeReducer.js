import { INITIAL_CUBE_STATE } from '../utils/constants';

export const cubeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STICKER': {
      const { face, index, color } = action.payload;
      return {
        ...state,
        cubeState: {
          ...state.cubeState,
          [face]: state.cubeState[face].map((c, i) =>
            i === index ? color : c
          ),
        },
      };
    }

    case 'SET_COLOR': {
      return { ...state, selectedColor: action.payload };
    }

    case 'CLEAR_CUBE': {
      return {
        ...state,
        cubeState: INITIAL_CUBE_STATE,
        solution: null,
        validationError: null,
      };
    }

    case 'SET_SOLUTION': {
      return { ...state, solution: action.payload, solving: false };
    }

    case 'SET_ERROR': {
      return { ...state, validationError: action.payload };
    }

    case 'SET_SOLVING': {
      return { ...state, solving: action.payload };
    }

    default:
      return state;
  }
};
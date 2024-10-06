import { SET_INPUT } from "../actions";

const initialState = {
  input: {},
};

const inputReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INPUT:
      return {
        ...state,
        input: action.payload,
      };

    default:
      return state;
  }
};

export default inputReducer;

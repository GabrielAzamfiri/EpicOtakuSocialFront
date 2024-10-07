import { SET_INPUT, SET_INPUT_NAME } from "../actions";

const initialState = {
  input: {},
  name: localStorage.getItem("inputSearch") || "",
};

const inputReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INPUT:
      return {
        ...state,
        input: action.payload,
      };
    case SET_INPUT_NAME:
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
};

export default inputReducer;

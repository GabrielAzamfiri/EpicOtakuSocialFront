import { LOGOUT, SET_USER_INFO } from "../actions";

const initialState = {
  userInfo: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        userInfo: action.payload,
        token: "",
      };
    default:
      return state;
  }
};

export default userReducer;

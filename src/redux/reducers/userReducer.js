import { LOGOUT, SET_USER_INFO, SET_USER_SELECTED } from "../actions";

const initialState = {
  userInfo: null,
  userSelected: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case SET_USER_SELECTED:
      return {
        ...state,
        userSelected: action.payload,
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

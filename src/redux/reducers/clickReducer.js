import { ANIME_CLICK } from "../actions";

const initialState = {
  animeClicked: {},
};

const clickReducer = (state = initialState, action) => {
  switch (action.type) {
    case ANIME_CLICK:
      return {
        ...state,
        animeClicked: action.payload,
      };
    default:
      return state;
  }
};

export default clickReducer;

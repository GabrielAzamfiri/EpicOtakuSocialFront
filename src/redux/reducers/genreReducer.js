import { SET_GENRE_ANIME } from "../actions";

const initialState = {
  genreClicked: "",
};

const genreReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GENRE_ANIME:
      return {
        ...state,
        genreClicked: action.payload,
      };
    default:
      return state;
  }
};

export default genreReducer;

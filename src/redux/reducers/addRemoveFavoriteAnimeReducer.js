import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "../actions";

const initialState = {
  favoritAnime: [],
};

const addRemoveFavoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_FAVORITES:
      return {
        ...state,
        favoritAnime: [...state.favoritAnime, action.payload],
      };
    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favoritAnime: state.favoritAnime.filter(i => i.mal_id !== action.payload.mal_id),
      };

    default:
      return state;
  }
};

export default addRemoveFavoriteReducer;

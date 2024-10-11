export const MY_PROFILE = "MY_PROFILE";
export const SET_TOKEN = "SET_TOKEN";
export const SET_USER_INFO = "SET_USER_INFO";
export const SET_INPUT = "SET_INPUT";
export const SET_INPUT_NAME = "SET_INPUT_NAME";
export const ANIME_CLICK = "ANIME_CLICK";
export const LOGOUT = "LOGOUT";
export const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
export const REMOVE_FROM_FAVORITES = "REMOVE_FROM_FAVORITES";

export const saveUserInfoAction = userInfo => ({ type: SET_USER_INFO, payload: userInfo });
export const saveInputSearchAction = inputSearch => ({ type: SET_INPUT_NAME, payload: inputSearch });
export const logoutAction = () => ({ type: LOGOUT, payload: null });
export const addToFavoritesAction = anime => ({ type: ADD_TO_FAVORITES, payload: anime });
export const removeFromFavoritesAction = anime => ({ type: REMOVE_FROM_FAVORITES, payload: anime });

export const saveAnimeClickedAction = animeId => {
  return async dispatch => {
    try {
      const response = await fetch(`http://localhost:3001/anime/${animeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        let data = await response.json();

        dispatch({ type: ANIME_CLICK, payload: data });
      } else {
        throw new Error("Errore nel reperimento dei dati 😥");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const inputSearchAction = (input, nrPage) => {
  return async dispatch => {
    try {
      const response = await fetch(`http://localhost:3001/anime?q=${input}&nrPage=${nrPage}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        let data = await response.json();

        dispatch({ type: SET_INPUT, payload: data });
      } else {
        throw new Error("Errore nel reperimento dei dati 😥");
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const getMyProfileAction = () => {
  return async dispatch => {
    try {
      const response = await fetch(`http://localhost:3001/utenti/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        let data = await response.json();

        dispatch({ type: SET_USER_INFO, payload: data });
      } else {
        throw new Error("Errore nel reperimento dei dati 😥");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

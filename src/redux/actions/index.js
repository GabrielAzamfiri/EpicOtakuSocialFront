export const MY_PROFILE = "MY_PROFILE";
export const SET_TOKEN = "SET_TOKEN";
export const SET_USER_INFO = "SET_USER_INFO";
export const SET_INPUT = "SET_INPUT";
export const SET_INPUT_NAME = "SET_INPUT_NAME";
export const ANIME_CLICK = "ANIME_CLICK";
export const LOGOUT = "LOGOUT";

export const saveUserInfoAction = userInfo => ({ type: SET_USER_INFO, payload: userInfo });
export const saveInputSearchAction = inputSearch => ({ type: SET_INPUT_NAME, payload: inputSearch });
export const saveAnimeClickedAction = anime => ({ type: ANIME_CLICK, payload: anime });
export const logoutAction = () => ({ type: LOGOUT, payload: null });

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

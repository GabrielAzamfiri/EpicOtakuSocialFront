//export const MY_PROFILE = "MY_PROFILE";
export const SET_TOKEN = "SET_TOKEN";
export const SET_USER_INFO = "SET_USER_INFO";

export const saveTokenAction = token => ({ type: SET_TOKEN, payload: token });
export const saveUserInfoAction = userInfo => ({ type: SET_USER_INFO, payload: userInfo });

//
//export const myProfileAction = () => {
//  return async dispatch => {
//    try {
//      const response = await fetch("https://striveschool-api.herokuapp.com/api/profile/me", {
//        headers: {
//          // chiave di autenticazione
//          Authorization: `Bearer ${import.meta.env.VITE_FETCH_KEY}`,
//        },
//      });
//      if (response.ok) {
//        let data = await response.json();
//
//        dispatch({ type: MY_PROFILE, payload: data });
//      } else {
//        throw new Error("Errore nel erperimento dei dati 😥");
//      }
//    } catch (error) {
//      console.log(error);
//    }
//  };
//};
//

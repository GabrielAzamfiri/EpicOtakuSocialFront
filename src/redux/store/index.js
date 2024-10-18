import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import inputReducer from "../reducers/inputReducer";
import clickReducer from "../reducers/clickReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import addRemoveFavoriteReducer from "../reducers/addRemoveFavoriteAnimeReducer";
import genreReducer from "../reducers/genreReducer";

// Configura redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["input", "animeClick", "favoritAnime"],
};

const rootReducer = combineReducers({
  user: userReducer,
  input: inputReducer,
  animeClick: clickReducer,
  favoritAnime: addRemoveFavoriteReducer,
  genreReducer: genreReducer,
});

// Applica redux-persist al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Usa il persistedReducer invece del rootReducer normale
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

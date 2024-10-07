import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import inputReducer from "../reducers/inputReducer";
import clickReducer from "../reducers/clickReducer";
import storage from "redux-persist/lib/storage"; // usa localStorage come storage
import { persistReducer, persistStore } from "redux-persist"; // importa redux-persist
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Configura redux-persist
const persistConfig = {
  key: "root", // La chiave che useremo per salvare lo stato nel localStorage
  storage, // Usa localStorage
};

const rootReducer = combineReducers({
  user: userReducer,
  input: inputReducer,
  animeClick: clickReducer,
});

// Applica redux-persist al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Crea lo store con il persistedReducer
const store = configureStore({
  reducer: persistedReducer, // Usa il persistedReducer invece del rootReducer normale
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Crea il persistor
const persistor = persistStore(store);

export { store, persistor };

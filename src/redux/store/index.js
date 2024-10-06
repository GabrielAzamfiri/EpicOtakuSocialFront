import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import inputReducer from "../reducers/inputReducer";

const rootReducer = combineReducers({
  user: userReducer,
  input: inputReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

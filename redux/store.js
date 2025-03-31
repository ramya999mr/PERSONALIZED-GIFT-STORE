import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { cartReducer } from "./cart.slice";
import { sessionReducer } from "./session.slice";
import { settingsReducer } from "./settings.slice";

const combinedReducer = combineReducers({
  cart: cartReducer,
  settings: settingsReducer,
  localSession: sessionReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply data from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);

import React from "react";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import Reducers from "./reducers";

export let store;

export default ({ initialState = {}, children }) => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  store = createStore(Reducers, initialState, composeEnhancers());

  return <Provider store={store}>{children}</Provider>;
};

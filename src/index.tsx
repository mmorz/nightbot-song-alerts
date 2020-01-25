import debounce from "lodash/debounce";
import "milligram";
import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore, Middleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { setStorageJson } from "./localStorage";
import notificationReducer from "./notification.ducks";
import notificationSaga from "./notification.saga";
import Options from "./options.container";

const sagaMiddleware = createSagaMiddleware();

const baseMiddleware: ReadonlyArray<Middleware> = [sagaMiddleware];

const storeMiddleware =
  process.env.NODE_ENV === "development"
    ? [...baseMiddleware, createLogger()]
    : baseMiddleware;

const store = createStore(
  notificationReducer,
  applyMiddleware(...storeMiddleware)
);

store.subscribe(
  debounce(
    () => {
      console.log("saving state to localstorage...");
      const state = store.getState();

      setStorageJson("channels", state.channels);
      setStorageJson("username", state.username);
      setStorageJson("enabled", state.enabled);
    },
    1000,
    { leading: true }
  )
);

sagaMiddleware.run(notificationSaga);

ReactDom.render(
  <Provider store={store}>
    <Options />
  </Provider>,
  document.querySelector("#app")
);

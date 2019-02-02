import React from 'react';
import ReactDom from 'react-dom';
import debounce from 'lodash/debounce';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import localStorage from 'local-storage';
import 'milligram';

import notificationSaga from './notification.saga';
import notificationReducer from './notification.ducks';
import Options from './options.container';

const sagaMiddleware = createSagaMiddleware();

const baseMiddleware = [sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  baseMiddleware.push(createLogger())
}

const store = createStore(
  notificationReducer,
  applyMiddleware(...baseMiddleware),
);

store.subscribe(
  debounce(
    () => {
      console.log('saving state to localstorage...');
      const state = store.getState();

      localStorage.set('channels', state.channels);
      localStorage.set('username', state.username);
      localStorage.set('enabled', state.enabled);
    },
    1000,
    { leading: true },
  ),
);

sagaMiddleware.run(notificationSaga);

ReactDom.render(
  <Provider store={store}>
    <Options />
  </Provider>,
  document.querySelector('#app'),
);

import React from 'react';
import ReactDom from 'react-dom';
import { fromJS } from 'immutable';
import { debounce } from 'lodash';
import { Provider } from 'react-redux';
import axios from 'axios';
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

const logger = createLogger({ stateTransformer: state => state.toJS() });

const store = createStore(
  notificationReducer,
  applyMiddleware(logger, sagaMiddleware),
);

store.subscribe(
  debounce(
    () => {
      console.log('saving state to localstorage...');
      const state = store.getState();
      localStorage.set('channels', state.get('channels').toJS());
      localStorage.set('username', state.get('username'));
    },
    1000,
    { leading: true },
  ),
);

sagaMiddleware.run(notificationSaga);

axios.interceptors.response.use(
  response => fromJS(response),
  error => Promise.reject(error),
);

ReactDom.render(
  <Provider store={store}>
    <Options />
  </Provider>,
  document.querySelector('#app'),
);

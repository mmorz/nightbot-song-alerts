import { Set, Map } from 'immutable';
import { createActions, handleActions } from 'redux-actions';
import localStorage from 'local-storage';

export const {
  setUsername,
  addChannel,
  removeChannel,
  toggleNotifications,
  startPollingChannels,
  createNotification,
} = createActions(
  'SET_USERNAME',
  'ADD_CHANNEL',
  'REMOVE_CHANNEL',
  'TOGGLE_NOTIFICATIONS',
  'START_POLLING_CHANNELS',
  'CREATE_NOTIFICATION',
);

const initialState = Map({
  username: localStorage.get('username') || '',
  channels: Set(localStorage.get('channels')) || Set(['eeeeee', 'aaa']),
  enabled: localStorage.get('enabled') || false,
  oldNotifications: Set(),
});

const reducer = handleActions(
  {
    [setUsername]: (state, { payload }) => state.set('username', payload),

    [addChannel]: (state, { payload }) =>
      state.update('channels', i => i.add(payload)),

    [removeChannel]: (state, { payload }) =>
      state.update('channels', i => i.delete(payload)),

    [toggleNotifications]: state => state.update('enabled', i => !i),

    [createNotification]: (state, { payload: { id } }) =>
      state.update('oldNotifications', i => i.add(id)),
  },
  initialState,
);

export default reducer;

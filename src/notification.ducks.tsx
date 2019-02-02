import { createStandardAction, getType, ActionType } from 'typesafe-actions';
import localStorage from 'local-storage';

interface NewNotification {
  id: string;
  channel: string;
}

export const actions = {
  setUsername: createStandardAction('SET_USERNAME')<string>(),
  addChannel: createStandardAction('ADD_CHANNEL')<string>(),
  removeChannel: createStandardAction('REMOVE_CHANNEL')<string>(),
  toggleNotifications: createStandardAction('TOGGLE_NOTIFICATIONS')(),
  startPollingChannels: createStandardAction('START_POLLING')<string[]>(),
  createNotification: createStandardAction('CREATE_NOTIFICATION')<NewNotification>(),
}

const initialState = {
  username: localStorage.get('username') || '',
  channels: localStorage.get('channels') || [],
  enabled: localStorage.get('enabled') || false,
  oldNotifications: [],
};

export type Store = Readonly<{
  username: string;
  channels: ReadonlyArray<string>;
  enabled: boolean;
  oldNotifications: ReadonlyArray<string>;
}>

const reducer = (state: Store = initialState, action: ActionType<typeof actions>): Store => {
  switch (action.type) {
    case getType(actions.setUsername):
      return { ...state, username: action.type };

    case getType(actions.addChannel):
      return { ...state, channels: [...state.channels, action.payload]};

    case getType(actions.removeChannel):
      return { ...state, channels: state.channels.filter(c => c !== action.payload )};

    case getType(actions.toggleNotifications):
      return { ...state, enabled: !state.enabled}

    case getType(actions.createNotification):
      return { ...state, oldNotifications: [...state.oldNotifications, action.payload.id]}

    default:
      return initialState;
  }
}

export default reducer;

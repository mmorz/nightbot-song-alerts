import localStorage from "local-storage";
import { ActionType, createAction, getType } from "typesafe-actions";

interface NewNotification {
  readonly id: string;
  readonly channel: string;
}

export const actions = {
  setUsername: createAction("SET_USERNAME")<string>(),
  addChannel: createAction("ADD_CHANNEL")<string>(),
  removeChannel: createAction("REMOVE_CHANNEL")<string>(),
  toggleNotifications: createAction("TOGGLE_NOTIFICATIONS")(),
  startPollingChannels: createAction("START_POLLING")<
    ReadonlyArray<string>
  >(),
  createNotification: createAction("CREATE_NOTIFICATION")<
    NewNotification
  >()
};

const initialState = {
  username: localStorage.get("username") || "",
  channels: localStorage.get("channels") || [] as ReadonlyArray<string>,
  enabled: localStorage.get("enabled") || false,
  oldNotifications: []
};

export interface Store {
  readonly username: string;
  readonly channels: ReadonlyArray<string>;
  readonly enabled: boolean;
  readonly oldNotifications: ReadonlyArray<string>;
}

const reducer = (
  state: Store = initialState,
  action: ActionType<typeof actions>
): Store => {
  switch (action.type) {
    case getType(actions.setUsername):
      return { ...state, username: action.payload };

    case getType(actions.addChannel):
      return { ...state, channels: [...state.channels, action.payload] };

    case getType(actions.removeChannel):
      return {
        ...state,
        channels: state.channels.filter(c => c !== action.payload)
      };

    case getType(actions.toggleNotifications):
      return { ...state, enabled: !state.enabled };

    case getType(actions.createNotification):
      return {
        ...state,
        oldNotifications: [...state.oldNotifications, action.payload.id]
      };

    default:
      return initialState;
  }
};

export default reducer;

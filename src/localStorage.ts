import { Store } from "./notification.types";

export const setStorageJson = (name: string, blob: unknown) => {
  const serialized = JSON.stringify(blob);

  localStorage.setItem(name, serialized);
}

const loadJsonKey = (key: string) => {
  const blob = localStorage.getItem(key);

  if (blob) {
    return JSON.parse(blob);
  }

  return null;
}

export const loadInitialStore = (): Store => {
  const initialState = {
    username: loadJsonKey("username") || "",
    channels: loadJsonKey("channels") || [] as ReadonlyArray<string>,
    enabled: loadJsonKey("enabled") || false,
    oldNotifications: [] as ReadonlyArray<string>
  };

  return initialState;
}

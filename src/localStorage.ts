export const getStorageJson = (name: string) => {
  const item = localStorage.getItem(name);

  if (!item) {
    throw new Error('could not find item from localstorage: ' + name);
  }

  const element = JSON.parse(item);

  return element;
}

export const setStorageJson = (name: string, blob: unknown) => {
  const serialized = JSON.stringify(blob);

  localStorage.setItem(name, serialized);
}

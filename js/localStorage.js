export const get = (key) => {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  if (value === 'true') return true;
  if (value === 'false') return false;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const set = (key, value) => {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  localStorage.setItem(key, stringValue);
};

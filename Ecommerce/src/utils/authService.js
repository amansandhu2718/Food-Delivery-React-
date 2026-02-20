const STORAGE_KEY = "accessToken";
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
  try {
    if (token === null || token === undefined) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, token);
    }
  } catch (e) {
    // ignore storage errors
  }
};

export const getAccessToken = () => {
  if (accessToken) return accessToken;
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    if (t) {
      accessToken = t;
      return t;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

export const clearAccessToken = () => {
  accessToken = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
};

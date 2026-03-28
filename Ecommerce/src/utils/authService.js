let accessToken = null;

// Initialize from localStorage if present (survives page refresh)
if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem("accessToken");
  if (stored) {
    accessToken = stored;
  }
}

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

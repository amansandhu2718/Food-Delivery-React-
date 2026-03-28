import { useEffect, useState } from "react";

function getSavedValues(key, initialValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return initialValue;
    return JSON.parse(raw);
  } catch (e) {
    console.log("ERROR", e);
    return initialValue;
  }
}

const useLocalStorage = (key, initialValue) => {
  const [value, SetValue] = useState(() => getSavedValues(key, initialValue));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    // Broadcast change so other hook instances update too
    try {
      window.dispatchEvent(
        new CustomEvent("local-storage", { detail: { key, value } }),
      );
    } catch (e) {
      // ignore
    }
  }, [value, key]);

  useEffect(() => {
    const handler = (e) => {
      try {
        if (!e) return;
        // handle native storage events
        if (e.key && e.key === key) {
          SetValue(getSavedValues(key, initialValue));
          return;
        }
        // handle custom event
        if (e.type === "local-storage" && e.detail && e.detail.key === key) {
          SetValue(e.detail.value);
        }
      } catch (err) {
        /* ignore */
      }
    };

    window.addEventListener("storage", handler);
    window.addEventListener("local-storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("local-storage", handler);
    };
  }, [key, initialValue]);
  return [value, SetValue];
};

export default useLocalStorage;

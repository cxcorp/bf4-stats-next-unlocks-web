import { useCallback, useState, useEffect } from "react";

export const useOnCtrlClick = (cb, depsList) => {
  return useCallback((e, ...restArgs) => {
    if (e.ctrlKey) {
      cb(e, ...restArgs);
      return;
    }
    e.preventDefault();
  }, depsList);
};

const tryCatch = (cb) => {
  try {
    return cb();
  } catch (e) {}
  return null;
};

export const usePersistedState = (defaultValue, localStorageKey) => {
  const state = useState(defaultValue);
  // initial state reader, can't just put into defaultValue or SSR state won't match client-side
  useEffect(() => {
    tryCatch(() => {
      const item = localStorage.getItem(localStorageKey);
      if (item === null) {
        return;
      }
      state[1](JSON.parse(item));
    });
  }, []);
  // localstorage updater
  useEffect(() => {
    const newVal = state[0];
    const timeoutToken = setTimeout(() => {
      tryCatch(() => {
        console.log("set", newVal);
        localStorage.setItem(localStorageKey, JSON.stringify(newVal));
      });
    }, 300);

    return () => clearTimeout(timeoutToken);
  }, [state[0]]);
  return state;
};

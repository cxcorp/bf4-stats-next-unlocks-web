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
  const [state, setState] = useState(defaultValue);
  // initial state reader, can't just put into defaultValue or SSR state won't match client-side
  useEffect(() => {
    tryCatch(() => {
      const item = localStorage.getItem(localStorageKey);
      if (item === null) {
        return;
      }
      setState(JSON.parse(item));
    });
  }, [setState, localStorageKey]);
  // localstorage updater
  useEffect(() => {
    const newVal = state;
    const timeoutToken = setTimeout(() => {
      tryCatch(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(newVal));
      });
    }, 300);

    return () => clearTimeout(timeoutToken);
  }, [state, localStorageKey]);

  const clearPersistedState = useCallback(() => {
    setState(defaultValue);
    tryCatch(() => {
      localStorage.removeItem(localStorageKey);
    });
  }, [setState, defaultValue, localStorageKey]);

  return [state, setState, clearPersistedState];
};

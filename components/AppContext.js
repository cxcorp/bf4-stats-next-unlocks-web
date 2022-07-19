import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DARK_MODE_COOKIE_KEY, DARK_MODE_CLASSNAME } from "~/common";

const AppContext = createContext({
  isDarkMode: false,
  setDarkMode: () => {},
});
AppContext.displayName = "AppContext";

export const useAppContext = () => useContext(AppContext);

const updateDarkModeCookie = (isDarkMode) => {
  const cookieEntry = `${DARK_MODE_COOKIE_KEY}=${isDarkMode ? 1 : 0}`;
  const timestamp = new Date(new Date().getTime() + 10 * 365 * 86400 * 1000);
  document.cookie = `${cookieEntry}; expires=${timestamp.toGMTString()}; path=/`;
};

const updateBodyClass = (isDarkMode) => {
  if (isDarkMode && !document.body.classList.contains(DARK_MODE_CLASSNAME)) {
    document.body.classList.add(DARK_MODE_CLASSNAME);
    return;
  }

  if (!isDarkMode && document.body.classList.contains(DARK_MODE_CLASSNAME)) {
    document.body.classList.remove(DARK_MODE_CLASSNAME);
  }
};

export const useAppContextContainer = () => {
  const [isDarkMode, setDarkMode] = useState(false);
  console.log({ isDarkMode });

  useEffect(() => {
    setDarkMode(document.cookie.includes(`${DARK_MODE_COOKIE_KEY}=1`));
  }, []);

  const handleSetDarkMode = useCallback(
    (value) => {
      setDarkMode(value);

      updateDarkModeCookie(value);
      updateBodyClass(value);
      // window.location.reload(true);
    },
    [isDarkMode]
  );

  const value = useMemo(
    () => ({
      isDarkMode,
      setDarkMode: handleSetDarkMode,
    }),
    [isDarkMode, handleSetDarkMode]
  );

  return value;
};

export const AppContextContainer = ({ children }) => {
  const value = useAppContextContainer();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

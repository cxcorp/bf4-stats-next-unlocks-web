import { useEffect, useState, useCallback } from "react";
import { Button } from "react-bootstrap";

import { DARK_MODE_WINDOW_VAR, DARK_MODE_COOKIE_KEY } from "~/common";

const DarkModeSwitch = ({ className }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(!!window[DARK_MODE_WINDOW_VAR]);
  }, []);

  const handleClicked = useCallback(
    (e) => {
      // toggle value in cookie and reload page
      const cookieEntry = `${DARK_MODE_COOKIE_KEY}=${isDarkMode ? 0 : 1}`;
      const timestamp = new Date(new Date().getTime() + 30 * 86400 * 1000);

      document.cookie = `${cookieEntry}; expires=${timestamp.toGMTString()}; path=/`;
      window.location.reload(true);
    },
    [isDarkMode]
  );

  return (
    <Button
      className={className}
      size="sm"
      variant="outline-secondary"
      onClick={handleClicked}
    >
      {isDarkMode ? "Light mode" : "Dark mode"}
    </Button>
  );
};

export default DarkModeSwitch;

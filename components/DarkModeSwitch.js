import { useCallback } from "react";
import { Button } from "react-bootstrap";

import { useAppContext } from "~/components/AppContext";

const DarkModeSwitch = ({ className }) => {
  const { isDarkMode, setDarkMode } = useAppContext();

  const handleButtonClicked = useCallback(() => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode, setDarkMode]);

  return (
    <Button
      className={className}
      size="sm"
      variant="outline-secondary"
      onClick={handleButtonClicked}
    >
      {isDarkMode ? "Light mode" : "Dark mode"}
    </Button>
  );
};

export default DarkModeSwitch;

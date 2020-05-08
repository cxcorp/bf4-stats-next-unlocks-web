import { useEffect } from "react";
import { DARK_MODE_COOKIE_KEY, DARK_MODE_WINDOW_VAR } from "~/common";
import "~/global-styles.css";

const App = ({ Component, pageProps }) => {
  // fix dark mode on statically optimized pages (request isn't handled via _document.js)
  useEffect(() => {
    if (
      document.cookie.includes(`${DARK_MODE_COOKIE_KEY}=1`) &&
      !window[DARK_MODE_WINDOW_VAR]
    ) {
      document.body.classList.add("bootstrap-dark");
    }
  }, []);

  return <Component {...pageProps} />;
};

export default App;

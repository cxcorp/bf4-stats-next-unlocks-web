import { AppContextContainer } from "~/components/AppContext";
import "~/global-styles.css";

const App = ({ Component, pageProps }) => {
  return (
    <AppContextContainer>
      <Component {...pageProps} />
    </AppContextContainer>
  );
};

export default App;

import Document, { Html, Head, Main, NextScript } from "next/document";
import { DARK_MODE_WINDOW_VAR, DARK_MODE_COOKIE_KEY } from "~/common";

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const darkMode =
      ctx.req &&
      ctx.req.headers.cookie &&
      ctx.req.headers.cookie.includes(`${DARK_MODE_COOKIE_KEY}=1`);

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, darkMode };
  }

  render() {
    const { darkMode } = this.props;

    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="/css/toggle-bootstrap.min.css" />
          <link rel="stylesheet" href="/css/toggle-bootstrap-dark.min.css" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.${DARK_MODE_WINDOW_VAR}=${darkMode};`,
            }}
          />
        </Head>
        <body className={`bootstrap ${darkMode ? "bootstrap-dark" : ""}`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;

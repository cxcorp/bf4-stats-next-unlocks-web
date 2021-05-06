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
        </Head>
        <body className={`bootstrap ${darkMode ? "bootstrap-dark" : ""}`}>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `fetch('/api/ping').then(() => {}).catch(() => {});`,
            }}
          />
          <script
            async
            defer
            data-collect-dnt="true"
            src="https://api.bf4unlocks.com/latest.js"
          ></script>
          <noscript>
            <img
              src="https://api.bf4unlocks.com/noscript.gif?collect-dnt=true"
              alt=""
              referrerpolicy="no-referrer-when-downgrade"
            />
          </noscript>
        </body>
      </Html>
    );
  }
}

export default CustomDocument;

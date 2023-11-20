import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Poppins"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-primary-600 text-secondary-400 font-sans">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

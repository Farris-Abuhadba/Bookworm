import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head></Head>
        <body className="bg-primary-600 text-secondary-400">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

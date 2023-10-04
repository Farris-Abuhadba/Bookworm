import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body className="bg-zinc-900 text-zinc-300">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

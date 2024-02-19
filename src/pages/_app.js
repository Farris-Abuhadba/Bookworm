import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { poppins } from "../fonts";
import Layout from "../components/Layout";

import "@mantine/core/styles.css";
import "../styles/components.css";
import "../styles/globals.css";
import "../styles/scrollbar.css";
import "../styles/swiper.css";
import "../styles/mantine.css";

const queryClient = new QueryClient();

const mantineTheme = createTheme({
  primaryColor: "sunset-purple",
  primaryShade: 6,
  colors: {
    "sunset-purple": [
      "#f6e9ff",
      "#e6cfff",
      "#c89cff",
      "#a964ff",
      "#8f37fe",
      "#7e19fe",
      "#7609ff",
      "#6400e4",
      "#5900cc",
      "#4c00b3",
    ],

    "sunset-pink": [
      "#ffebf3",
      "#fcd6e0",
      "#f1aabe",
      "#e77c9a",
      "#df567c",
      "#da3d68",
      "#d92f5f",
      "#c1214f",
      "#ad1945",
      "#990b3b",
    ],

    "sunset-orange": [
      "#fff0e3",
      "#ffe1cc",
      "#ffc29b",
      "#ffa064",
      "#fe8337",
      "#fe711a",
      "#ff6809",
      "#e45600",
      "#cb4b00",
      "#b13f00",
    ],
  },
  defaultGradient: { from: "sunset-purple", to: "sunset-orange", deg: 160 },
  radius: {
    none: "0px",
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  defaultRadius: "sm",
});

export default function App(props) {
  const { Component, pageProps } = props;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          defaultColorScheme="dark"
          theme={mantineTheme}
        >
          <main className={`${poppins.variable} font-sans`}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </main>
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

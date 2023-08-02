import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "../styles/globals.css";
const queryClient = new QueryClient();

export default function App(props) {
    const { Component, pageProps } = props;

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        /** Put your mantine theme override here */
                        colorScheme: "dark",
                    }}
                >
                    <Component {...pageProps} />
                </MantineProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

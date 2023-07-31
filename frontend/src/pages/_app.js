import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import '../styles/globals.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient()

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
          colorScheme: 'light',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
     </QueryClientProvider>
     
    </>
  );
}
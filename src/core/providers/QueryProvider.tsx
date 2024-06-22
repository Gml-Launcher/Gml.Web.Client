"use client";

import { PropsWithChildren, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HttpStatusCode, isAxiosError } from "axios";

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            return !(
              isAxiosError(error) && error.response?.data.statusCode === HttpStatusCode.NotFound
            );
          },
        },
      },
    }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

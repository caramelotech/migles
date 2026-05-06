import type { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./query-client";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return createQueryClient();
  } else {
    // Browser: create query client once per app
    if (!browserQueryClient) browserQueryClient = createQueryClient();
    return browserQueryClient;
  }
}

export function QueryProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}

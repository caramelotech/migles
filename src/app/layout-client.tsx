"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/lib/theme-context";
import React from "react";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
      <Toaster />
    </ThemeProvider>
  );
}

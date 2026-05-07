import type { Metadata } from "next";
import { RootLayoutClient } from "./layout-client";
import "@/styles.css";

export const metadata: Metadata = {
  title: "Migles",
  description: "Organize eventos com amigos e comunidades",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f4f0" />
      </head>
      <body suppressHydrationWarning>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}

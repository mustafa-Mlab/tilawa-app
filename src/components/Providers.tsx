"use client";

import { ThemeProvider } from "next-themes";
import { QuranProvider } from "@/context/QuranContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QuranProvider>{children}</QuranProvider>
    </ThemeProvider>
  );
}

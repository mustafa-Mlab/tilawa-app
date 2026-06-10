"use client";

import { ThemeProvider } from "next-themes";
import { QuranProvider } from "@/context/QuranContext";
import dynamic from "next/dynamic";

const AudioPlayer = dynamic(
  () => import("@/components/AudioPlayer").then((mod) => mod.AudioPlayer),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QuranProvider>
        {children}
        <AudioPlayer />
      </QuranProvider>
    </ThemeProvider>
  );
}

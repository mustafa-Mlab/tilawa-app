import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.scss";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Tilawa App - Read & Listen Quran",
  description: "Premium Quran Web Application with interactive audio, translation (English and Bangla), verse highlights, and clean typography.",
  metadataBase: new URL("https://tilawa-app.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
            {children}
          </main>
          <AudioPlayer />
        </Providers>
      </body>
    </html>
  );
}

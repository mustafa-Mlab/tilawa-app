import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.scss";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

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
  authors: [{ name: "M. Kamal Hossain", url: "https://mkamalhossain.com/" }],
  creator: "M. Kamal Hossain",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tilawa App - Read & Listen Quran",
    description: "Premium Quran Web Application with interactive audio, translation (English and Bangla), verse highlights, and clean typography.",
    url: "https://tilawa-app.vercel.app",
    siteName: "Tilawa App",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tilawa App - Read & Listen Quran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tilawa App - Read & Listen Quran",
    description: "Premium Quran Web Application with interactive audio, translation (English and Bangla), verse highlights, and clean typography.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
          <MobileBottomNav />
          <footer className="w-full border-t border-zinc-200/50 bg-white/30 dark:border-zinc-800/50 dark:bg-zinc-950/30 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                © {new Date().getFullYear()} Tilawa App. Developed by{" "}
                <a
                  href="https://mkamalhossain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors"
                >
                  M. Kamal Hossain
                </a>
                .
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Deployed on Vercel
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}


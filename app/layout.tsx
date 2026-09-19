import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers";
import { AppHeader } from "./components/app-header";
import { GridBackground } from "./components/grid-background";

export const metadata: Metadata = {
  title: "Swpper — Swipe DCA for Tokenized Equities",
  description:
    "Mobile-first swipe DCA and limit order trading for Solana tokenized equities and pre-IPO assets.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sans bg-paper text-ink selection:bg-sol-green selection:text-ink">
        <Providers>
          <div className="paper-texture relative min-h-screen overflow-x-hidden">
            <GridBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <AppHeader />
              <div className="flex-1">{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased font-sans bg-[#070A12] text-white">
        <Providers>
          <div className="relative min-h-screen bg-[#070A12] text-white overflow-x-hidden">
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

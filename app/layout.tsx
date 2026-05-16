import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Arc Flow — Stablecoin payments, instant.",
  description:
    "Send USDC and EURC on Arc, Circle's stablecoin Layer-1. Sub-second finality, USDC as gas.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Arc Flow",
    description: "Stablecoin payments at the speed of thought, on Arc.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-arc-bg text-arc-ink antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

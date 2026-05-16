"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-arc-bg/70 border-b border-white/5">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-arc-mute">
          <Link href="/app" className="hover:text-arc-ink transition-colors">
            App
          </Link>
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-arc-ink transition-colors"
          >
            Faucet
          </a>
          <a
            href="https://testnet.arcscan.app"
            target="_blank"
            rel="noreferrer"
            className="hover:text-arc-ink transition-colors"
          >
            Explorer
          </a>
          <a
            href="https://docs.arc.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-arc-ink transition-colors"
          >
            Docs
          </a>
        </nav>

        <div className="scale-[0.92] origin-right">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          />
        </div>
      </div>
    </header>
  );
}

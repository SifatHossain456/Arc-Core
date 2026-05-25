"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { SettingsModal } from "./SettingsModal";

const navLinks = [
  { href: "/app", label: "App" },
  { href: "https://faucet.circle.com", label: "Faucet", external: true },
  { href: "https://testnet.arcscan.app", label: "Explorer", external: true },
  { href: "https://docs.arc.io", label: "Docs", external: true },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-arc-bg/70 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7 text-sm text-arc-mute">
            {navLinks.map((l) =>
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-arc-ink transition-colors">{l.label}</a>
              ) : (
                <Link key={l.href} href={l.href} className="hover:text-arc-ink transition-colors">{l.label}</Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* Settings gear */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-arc-mute hover:text-arc-ink hover:bg-white/[0.06] transition-colors"
              aria-label="Settings"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </button>

            <div className="scale-[0.92] origin-right hidden sm:block">
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus={{ smallScreen: "avatar", largeScreen: "full" }} />
            </div>
            <div className="scale-[0.92] origin-right sm:hidden">
              <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden h-9 w-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 bg-arc-ink rounded-full origin-center" />
              <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-5 bg-arc-ink rounded-full" />
              <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 bg-arc-ink rounded-full origin-center" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 z-30 bg-arc-bg/95 backdrop-blur-md border-b border-white/5 px-5 py-4 space-y-1"
          >
            {navLinks.map((l) =>
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors">
                  {l.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor"><path d="M3.5 2H2v8h8V8.5H9V9H3V3h.5V2zm2 0v1H8.3L4 7.3l.7.7L9 3.7V6h1V2H5.5z" /></svg>
                </a>
              ) : (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors">
                  {l.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4" /></svg>
                </Link>
              )
            )}
            <button onClick={() => { setSettingsOpen(true); setMenuOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors">
              Settings
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

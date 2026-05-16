"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/app", label: "App" },
  { href: "https://faucet.circle.com", label: "Faucet", external: true },
  { href: "https://testnet.arcscan.app", label: "Explorer", external: true },
  { href: "https://docs.arc.io", label: "Docs", external: true },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-arc-bg/70 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-arc-mute">
            {navLinks.map((l) =>
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-arc-ink transition-colors">
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className="hover:text-arc-ink transition-colors">
                  {l.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="scale-[0.92] origin-right hidden sm:block">
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus={{ smallScreen: "avatar", largeScreen: "full" }} />
            </div>
            <div className="scale-[0.92] origin-right sm:hidden">
              <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-9 w-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Menu"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-arc-ink rounded-full origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-5 bg-arc-ink rounded-full"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-arc-ink rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 z-30 bg-arc-bg/95 backdrop-blur-md border-b border-white/5 px-5 py-4 space-y-1"
          >
            {navLinks.map((l) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors"
                >
                  {l.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
                    <path d="M3.5 2H2v8h8V8.5H9V9H3V3h.5V2zm2 0v1H8.3L4 7.3l.7.7L9 3.7V6h1V2H5.5z" />
                  </svg>
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors"
                >
                  {l.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

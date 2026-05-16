"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { label: "Native gas", value: "USDC" },
  { label: "Finality", value: "Sub-second" },
  { label: "Consensus", value: "Malachite" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-arc-mute"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-arc-success animate-pulse" />
          Live on Arc Testnet · Chain 5042002
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          Stablecoin payments,
          <br />
          <span className="bg-gradient-to-r from-arc-accent to-arc-accent2 bg-clip-text text-transparent">
            at the speed of thought.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-arc-mute max-w-xl mx-auto text-base md:text-lg"
        >
          Send USDC and EURC on Arc — Circle&apos;s L1 built for dollar-denominated finance.
          One click adds the network to MetaMask. Transactions settle in under a second.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <Link
            href="/app"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-arc-ink text-arc-bg font-medium shadow-glow hover:shadow-[0_0_80px_-10px_rgba(124,92,255,0.7)] transition-shadow"
          >
            <span>Open the app</span>
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="currentColor"
            >
              <path d="M6 3l5 5-5 5V3z" />
            </svg>
          </Link>
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-arc-ink hover:bg-white/[0.06] transition-colors"
          >
            Get test USDC
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-16 grid grid-cols-3 max-w-2xl mx-auto rounded-2xl glass overflow-hidden"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-5 ${i !== stats.length - 1 ? "border-r border-white/5" : ""}`}
            >
              <div className="text-arc-mute text-[11px] uppercase tracking-[0.16em]">
                {s.label}
              </div>
              <div className="mt-1.5 text-lg font-mono font-medium">{s.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

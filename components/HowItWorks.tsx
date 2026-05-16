"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Connect MetaMask",
    body: "One click adds Arc Testnet to your wallet. No manual config, no separate gas token to buy. USDC is everything.",
    color: "from-arc-accent/20 to-arc-accent/5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M21 12V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-1m-4-2h4m-4 0a2 2 0 010-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Send, request, or batch",
    body: "Send USDC to any address, create a shareable payment link with QR code, or batch-send to dozens of wallets in one session.",
    color: "from-arc-accent2/20 to-arc-accent2/5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Settled in under a second",
    body: "Malachite consensus is deterministic. Your transaction confirms or fails — no waiting, no ambiguity. Check it on Arcscan instantly.",
    color: "from-arc-success/20 to-arc-success/5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">How it works</h2>
        <p className="mt-3 text-arc-mute max-w-md mx-auto text-sm md:text-base">
          No bridges, no wrapped tokens, no confusing UI. Just stablecoins moving at the speed of thought.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 relative">
        {/* connector line */}
        <div className="hidden md:block absolute top-12 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-arc-accent/30 via-arc-accent2/30 to-arc-success/30" />

        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            className="glass rounded-3xl p-6 relative"
          >
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5`}>
              {s.icon}
            </div>
            <div className="text-[11px] font-mono text-arc-mute mb-1">{s.num}</div>
            <h3 className="text-lg font-medium">{s.title}</h3>
            <p className="mt-2 text-sm text-arc-mute leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

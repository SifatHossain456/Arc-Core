"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "USDC is the gas",
    body: "No native token to top up. Predictable, dollar-denominated fees on every transaction.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sub-second finality",
    body: "Malachite consensus delivers deterministic settlement — confirm or fail, no waiting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Built for institutions",
    body: "100+ partners including BlackRock, Visa, HSBC and Deutsche Bank in the testnet cohort.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "MetaMask, one click",
    body: "Auto-add the network and start sending. We handle chain switching for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 10h16M8 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FeatureGrid() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
            className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-arc-accent2">
              {f.icon}
            </div>
            <div className="mt-4 text-[15px] font-medium">{f.title}</div>
            <div className="mt-1.5 text-sm text-arc-mute leading-relaxed">{f.body}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

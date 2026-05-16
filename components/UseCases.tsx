"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const cases = [
  {
    emoji: "💼",
    title: "Freelance invoices",
    body: "Generate a payment link for $500 USDC. Send it to your client over email. They pay in one click, no account needed.",
    cta: "Create a request",
    href: "/app",
  },
  {
    emoji: "🍕",
    title: "Split the bill",
    body: "Dinner for 6? Create individual $20 links for each friend. They pay on their phone, you collect in seconds.",
    cta: "Try batch send",
    href: "/app",
  },
  {
    emoji: "🌍",
    title: "Cross-border remittance",
    body: "USDC on Arc settles faster than a wire transfer and cheaper than PayPal. Recipient gets exactly what you sent.",
    cta: "Send globally",
    href: "/app",
  },
  {
    emoji: "🏢",
    title: "Team payroll",
    body: "Batch-send salaries to 50 wallets. Confirm each in MetaMask. Done before the coffee gets cold.",
    cta: "Batch send",
    href: "/app",
  },
];

export function UseCases() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built for real money movement</h2>
        <p className="mt-3 text-arc-mute max-w-sm mx-auto text-sm">
          The same rails, whether you&apos;re paying one person or a hundred.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cases.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
            className="glass rounded-3xl p-5 flex flex-col hover:bg-white/[0.035] transition-colors"
          >
            <div className="text-3xl mb-4">{c.emoji}</div>
            <div className="text-base font-medium">{c.title}</div>
            <p className="mt-2 text-sm text-arc-mute leading-relaxed flex-1">{c.body}</p>
            <Link
              href={c.href}
              className="mt-5 text-sm text-arc-accent2 hover:text-arc-ink transition-colors inline-flex items-center gap-1"
            >
              {c.cta}
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

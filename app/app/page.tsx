"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NetworkGate } from "@/components/NetworkGate";
import { BalanceCard } from "@/components/BalanceCard";
import { SendForm } from "@/components/SendForm";
import { TxHistory } from "@/components/TxHistory";
import { CreateRequest } from "@/components/CreateRequest";

type Tab = "send" | "request";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "send",
    label: "Send",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8h10M8 4l4 4-4 4" />
      </svg>
    ),
  },
  {
    id: "request",
    label: "Request",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <path d="M9 9h2v2H9zM11 11h4M13 9v4" />
      </svg>
    ),
  },
];

export default function AppPage() {
  const [tab, setTab] = useState<Tab>("send");

  return (
    <>
      <Header />
      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-aurora pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-5 pt-12 pb-16">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-arc-mute text-sm mt-1.5">
              Your USDC and EURC on Arc Testnet.
            </p>
          </div>

          <NetworkGate>
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-5">
              {/* Left column */}
              <div className="space-y-5">
                <BalanceCard />
                <TxHistory />
              </div>

              {/* Right column — tabbed */}
              <div className="space-y-4">
                {/* Tab switcher */}
                <div className="flex items-center gap-1 glass rounded-2xl p-1.5">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        tab === t.id ? "text-arc-bg" : "text-arc-mute hover:text-arc-ink"
                      }`}
                    >
                      {tab === t.id && (
                        <motion.div
                          layoutId="tab-bg"
                          className="absolute inset-0 bg-arc-ink rounded-xl"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        {t.icon}
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {tab === "send" ? (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SendForm />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="request"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CreateRequest />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </NetworkGate>
        </div>
      </main>
      <Footer />
    </>
  );
}

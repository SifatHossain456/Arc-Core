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
import { BatchSend } from "@/components/BatchSend";
import { WatchAddress } from "@/components/WatchAddress";
import { AddressBook } from "@/components/AddressBook";
import { NetworkStats } from "@/components/NetworkStats";

type Tab = "send" | "request" | "batch" | "contacts" | "watch";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "send",
    label: "Send",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8h10M8 4l4 4-4 4" />
      </svg>
    ),
  },
  {
    id: "request",
    label: "Request",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v12M2 8h12" />
      </svg>
    ),
  },
  {
    id: "batch",
    label: "Batch",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h12M2 8h12M2 12h8" />
      </svg>
    ),
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="5" r="3" />
        <path d="M1 14a6 6 0 0112 0" />
      </svg>
    ),
  },
  {
    id: "watch",
    label: "Watch",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
        <circle cx="8" cy="8" r="2" />
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

        <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-16 space-y-5">
          {/* Page title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-arc-mute text-sm mt-1">Your stablecoin hub on Arc Testnet.</p>
          </div>

          <NetworkGate>
            {/* Network stats bar */}
            <NetworkStats />

            <div className="grid lg:grid-cols-[1fr,1.25fr] gap-5">
              {/* Left: balance + history */}
              <div className="space-y-5">
                <BalanceCard />
                <TxHistory />
              </div>

              {/* Right: tabbed panel */}
              <div className="space-y-4">
                {/* Tab bar — scrollable on mobile */}
                <div className="flex items-center gap-1 glass rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`relative flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[13px] font-medium transition-colors whitespace-nowrap ${
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
                      <span className="relative flex items-center gap-1.5">
                        {t.icon}
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {tab === "send" && <SendForm />}
                    {tab === "request" && <CreateRequest />}
                    {tab === "batch" && <BatchSend />}
                    {tab === "contacts" && <AddressBook />}
                    {tab === "watch" && <WatchAddress />}
                  </motion.div>
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

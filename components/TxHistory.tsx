"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { loadTxs, type StoredTx } from "@/lib/storage";
import { relativeTime, shortAddress } from "@/lib/format";
import { txUrl } from "@/lib/chain";
import { exportCSV } from "@/lib/export";
import { saveContact, loadContacts } from "@/lib/contacts";

export function TxHistory() {
  const { address } = useAccount();
  const [txs, setTxs] = useState<StoredTx[]>([]);
  const [filter, setFilter] = useState<"all" | "USDC" | "EURC">("all");
  const [savedAddrs, setSavedAddrs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!address) return;
    const tick = () => setTxs(loadTxs(address));
    tick();
    const id = setInterval(tick, 3_000);
    return () => clearInterval(id);
  }, [address]);

  useEffect(() => {
    const contacts = loadContacts();
    setSavedAddrs(new Set(contacts.map((c) => c.address.toLowerCase())));
  }, [txs]);

  const filtered = filter === "all" ? txs : txs.filter((t) => t.token === filter);

  const quickSave = (tx: StoredTx) => {
    saveContact({ name: shortAddress(tx.to), address: tx.to, note: tx.note });
    setSavedAddrs((prev) => new Set([...prev, tx.to.toLowerCase()]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-base font-medium">Activity</h3>
        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex bg-white/[0.04] rounded-lg p-0.5">
            {(["all", "USDC", "EURC"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filter === f ? "text-arc-bg" : "text-arc-mute hover:text-arc-ink"
                }`}
              >
                {filter === f && (
                  <motion.div
                    layoutId="hist-filter"
                    className="absolute inset-0 bg-arc-ink rounded-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{f === "all" ? "All" : f}</span>
              </button>
            ))}
          </div>

          {txs.length > 0 && (
            <button
              onClick={() => exportCSV(txs)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors"
              title="Export CSV"
            >
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" />
              </svg>
              CSV
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-arc-mute">
          <div className="mx-auto h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 text-arc-mute/60">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {filter !== "all" ? `No ${filter} transactions.` : "Your first send will appear here."}
        </div>
      ) : (
        <ul className="divide-y divide-white/5 -mx-2">
          <AnimatePresence initial={false}>
            {filtered.map((tx) => (
              <motion.li
                key={tx.hash}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                layout
                className="px-2 py-3 group"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={tx.status} />
                  <div className="flex-1 min-w-0">
                    <a
                      href={txUrl(tx.hash)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-baseline justify-between gap-3 hover:text-arc-accent2 transition-colors"
                    >
                      <div className="font-mono text-sm truncate">
                        → {shortAddress(tx.to)}
                      </div>
                      <div className="font-mono text-sm tabular-nums whitespace-nowrap">
                        −{tx.amount}{" "}
                        <span className={tx.token === "EURC" ? "text-arc-accent2" : "text-arc-mute"}>
                          {tx.token}
                        </span>
                      </div>
                    </a>
                    <div className="flex items-center justify-between gap-3 mt-0.5">
                      <div className="text-xs text-arc-mute truncate">
                        {tx.note || `${tx.token} transfer`}
                      </div>
                      <div className="flex items-center gap-2">
                        {!savedAddrs.has(tx.to.toLowerCase()) && (
                          <button
                            onClick={() => quickSave(tx)}
                            className="text-[10px] text-arc-mute opacity-0 group-hover:opacity-100 hover:text-arc-accent2 transition-all"
                            title="Save to contacts"
                          >
                            + Save
                          </button>
                        )}
                        <div className="text-xs text-arc-mute whitespace-nowrap">
                          {relativeTime(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}

function StatusDot({ status }: { status: StoredTx["status"] }) {
  const color =
    status === "success" ? "bg-arc-success" : status === "failed" ? "bg-arc-danger" : "bg-arc-warn";
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {status === "pending" && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-arc-warn opacity-60 animate-ping" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

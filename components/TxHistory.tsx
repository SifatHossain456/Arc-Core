"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { loadTxs, type StoredTx } from "@/lib/storage";
import { relativeTime, shortAddress } from "@/lib/format";
import { txUrl } from "@/lib/chain";

export function TxHistory() {
  const { address } = useAccount();
  const [txs, setTxs] = useState<StoredTx[]>([]);

  useEffect(() => {
    if (!address) return;
    const tick = () => setTxs(loadTxs(address));
    tick();
    const id = setInterval(tick, 3_000);
    return () => clearInterval(id);
  }, [address]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">Recent activity</h3>
        <span className="text-[11px] text-arc-mute uppercase tracking-[0.18em]">
          Local · {txs.length}
        </span>
      </div>

      {txs.length === 0 ? (
        <div className="text-center py-12 text-sm text-arc-mute">
          <div className="mx-auto h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 text-arc-mute/70">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          No transactions yet. Your first send will appear here.
        </div>
      ) : (
        <ul className="divide-y divide-white/5 -mx-2">
          <AnimatePresence initial={false}>
            {txs.map((tx) => (
              <motion.li
                key={tx.hash}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                layout
                className="px-2 py-3"
              >
                <a
                  href={txUrl(tx.hash)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:bg-white/[0.025] rounded-lg p-2 -m-2 transition-colors"
                >
                  <StatusDot status={tx.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-mono text-sm truncate">
                        → {shortAddress(tx.to)}
                      </div>
                      <div className="font-mono text-sm tabular-nums whitespace-nowrap">
                        −{tx.amount} <span className="text-arc-mute">{tx.token}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 mt-0.5">
                      <div className="text-xs text-arc-mute truncate">
                        {tx.note || `${tx.token} transfer`}
                      </div>
                      <div className="text-xs text-arc-mute whitespace-nowrap">
                        {relativeTime(tx.timestamp)}
                      </div>
                    </div>
                  </div>
                </a>
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
    status === "success"
      ? "bg-arc-success"
      : status === "failed"
      ? "bg-arc-danger"
      : "bg-arc-warn";
  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === "pending" && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-arc-warn opacity-60 animate-ping" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

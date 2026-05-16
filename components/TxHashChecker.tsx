"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionReceipt } from "wagmi";
import { type Hash } from "viem";
import { txUrl } from "@/lib/chain";

export function TxHashChecker() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState<Hash | null>(null);

  const { data, isLoading, isError } = useTransactionReceipt({
    hash: hash ?? undefined,
    query: { enabled: !!hash },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.startsWith("0x") && trimmed.length === 66) {
      setHash(trimmed as Hash);
    }
  };

  const isValidHash = input.trim().startsWith("0x") && input.trim().length === 66;
  const status = !hash ? null : isLoading ? "loading" : isError ? "not_found" : data?.status === "success" ? "success" : "reverted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      <div>
        <h3 className="text-base font-medium">Transaction checker</h3>
        <p className="text-xs text-arc-mute mt-0.5">Paste any Arc Testnet tx hash to see its on-chain status</p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setHash(null); }}
          placeholder="0x000…"
          spellCheck={false}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 font-mono text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
        />
        <button
          type="submit"
          disabled={!isValidHash}
          className="w-full py-2.5 rounded-xl bg-arc-ink text-arc-bg text-sm font-medium disabled:opacity-40 hover:opacity-90 transition"
        >
          Check status
        </button>
      </form>

      <AnimatePresence mode="wait">
        {status && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {status === "loading" && (
              <div className="flex items-center gap-3 glass rounded-2xl px-5 py-4">
                <Spinner />
                <div>
                  <div className="text-sm font-medium">Fetching from Arc…</div>
                  <div className="text-xs text-arc-mute mt-0.5">Querying the Arc Testnet node</div>
                </div>
              </div>
            )}

            {status === "not_found" && (
              <div className="glass rounded-2xl px-5 py-4 border border-arc-warn/20 bg-arc-warn/5">
                <div className="text-sm font-medium text-arc-warn">Not found</div>
                <div className="text-xs text-arc-mute mt-1">
                  This hash was not found on Arc Testnet. It may be pending, on a different network, or invalid.
                </div>
              </div>
            )}

            {(status === "success" || status === "reverted") && data && (
              <div className={`glass rounded-2xl p-5 space-y-4 ${
                status === "success" ? "border border-arc-success/20 bg-arc-success/5" : "border border-arc-danger/20 bg-arc-danger/5"
              }`}>
                <div className="flex items-center gap-3">
                  {status === "success" ? (
                    <div className="h-10 w-10 rounded-xl bg-arc-success/20 flex items-center justify-center text-arc-success shrink-0">
                      <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M3 8l3.5 3.5L13 4" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-arc-danger/20 flex items-center justify-center text-arc-danger shrink-0">
                      <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M4 4l8 8M12 4L4 12" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{status === "success" ? "Transaction succeeded" : "Transaction reverted"}</div>
                    <div className="text-xs text-arc-mute mt-0.5">Block #{data.blockNumber.toString()}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <StatRow label="Gas used" value={data.gasUsed.toLocaleString()} />
                  <StatRow label="Block" value={`#${data.blockNumber.toString()}`} />
                  <StatRow label="Status" value={status === "success" ? "✓ Success" : "✗ Reverted"} />
                </div>

                <a
                  href={txUrl(hash!)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-arc-accent2 hover:underline"
                >
                  Full details on Arcscan ↗
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-arc-mute">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-arc-accent" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

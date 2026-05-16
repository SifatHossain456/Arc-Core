"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBalance, useReadContract } from "wagmi";
import { erc20Abi, isAddress, type Address } from "viem";
import { EURC_ADDRESS, addressUrl } from "@/lib/chain";
import { shortAddress, formatUSDC } from "@/lib/format";

export function WatchAddress() {
  const [input, setInput] = useState("");
  const [watching, setWatching] = useState<Address | null>(null);

  const valid = isAddress(input.trim());

  const { data: usdcBal, isLoading: usdcLoading } = useBalance({
    address: watching ?? undefined,
    query: { enabled: !!watching, refetchInterval: 15_000 },
  });

  const { data: eurcRaw, isLoading: eurcLoading } = useReadContract({
    address: EURC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: watching ? [watching] : undefined,
    query: { enabled: !!watching, refetchInterval: 15_000 },
  });

  const { data: eurcDecimals } = useReadContract({
    address: EURC_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: !!watching, staleTime: Infinity },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid) setWatching(input.trim() as Address);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      <div>
        <h3 className="text-base font-medium">Watch any wallet</h3>
        <p className="text-xs text-arc-mute mt-0.5">Check the USDC &amp; EURC balance of any address on Arc</p>
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste any 0x address…"
          spellCheck={false}
          className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 font-mono text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
        />
        <button
          type="submit"
          disabled={!valid}
          className="px-4 py-2.5 rounded-xl bg-arc-ink text-arc-bg text-sm font-medium disabled:opacity-40 hover:opacity-90 transition"
        >
          Watch
        </button>
      </form>

      <AnimatePresence mode="wait">
        {watching && (
          <motion.div
            key={watching}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <a
                href={addressUrl(watching)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-mono text-arc-mute hover:text-arc-ink transition-colors"
              >
                {shortAddress(watching)}
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
                  <path d="M3.5 2H2v8h8V8.5H9V9H3V3h.5V2zm2 0v1H8.3L4 7.3l.7.7L9 3.7V6h1V2H5.5z" />
                </svg>
              </a>
              <button
                onClick={() => { setWatching(null); setInput(""); }}
                className="text-xs text-arc-mute hover:text-arc-ink transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-arc-mute mb-2">USDC</div>
                {usdcLoading ? (
                  <div className="h-7 w-24 rounded shimmer animate-shimmer" />
                ) : (
                  <div className="text-xl font-semibold font-mono tabular-nums">
                    {formatUSDC(usdcBal?.value, usdcBal?.decimals)}
                  </div>
                )}
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-arc-mute mb-2">EURC</div>
                {eurcLoading ? (
                  <div className="h-7 w-24 rounded shimmer animate-shimmer" />
                ) : (
                  <div className="text-xl font-semibold font-mono tabular-nums">
                    {formatUSDC(eurcRaw as bigint | undefined, eurcDecimals ?? 6)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-arc-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-arc-success animate-pulse" />
              Live · updates every 15s from Arc Testnet
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

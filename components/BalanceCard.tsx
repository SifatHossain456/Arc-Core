"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { EURC_ADDRESS, FAUCET_URL, addressUrl } from "@/lib/chain";
import { formatUSDC, shortAddress } from "@/lib/format";

export function BalanceCard() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  const { data: usdc, isLoading: usdcLoading, refetch: refetchUsdc } = useBalance({
    address, query: { refetchInterval: 15_000 },
  });

  const { data: eurcRaw, isLoading: eurcLoading, refetch: refetchEurc } = useReadContract({
    address: EURC_ADDRESS, abi: erc20Abi, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const { data: eurcDecimals } = useReadContract({
    address: EURC_ADDRESS, abi: erc20Abi, functionName: "decimals",
    query: { enabled: !!address, staleTime: Infinity },
  });

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchUsdc(), refetchEurc()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative glass rounded-3xl p-6 overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-arc-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-arc-accent2/10 blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute">Account</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-sm">{shortAddress(address)}</span>
              <button onClick={copyAddress} title="Copy address"
                className="text-arc-mute hover:text-arc-accent2 transition-colors">
                {copied ? (
                  <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-arc-success" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 7l3.5 3.5L12 3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="4" y="4" width="8" height="8" rx="1" />
                    <path d="M2 10V3a1 1 0 011-1h7" />
                  </svg>
                )}
              </button>
              {address && (
                <a href={addressUrl(address)} target="_blank" rel="noreferrer"
                  className="text-arc-mute hover:text-arc-accent2 transition-colors" title="View on Arcscan">
                  <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M3.5 2H2v8h8V8.5H9V9H3V3h.5V2zm2 0v1H8.3L4 7.3l.7.7L9 3.7V6h1V2H5.5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} title="Refresh balances"
              className="h-7 w-7 flex items-center justify-center rounded-lg text-arc-mute hover:text-arc-ink hover:bg-white/[0.06] transition-colors">
              <svg viewBox="0 0 14 14" className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 7A5 5 0 102 7" />
                <path d="M12 3v4h-4" />
              </svg>
            </button>
            <a href={FAUCET_URL} target="_blank" rel="noreferrer"
              className="text-xs text-arc-accent2 hover:text-arc-ink transition-colors whitespace-nowrap">
              Need USDC? →
            </a>
          </div>
        </div>

        {/* USDC balance */}
        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute">USDC (native gas)</div>
          <div className="mt-2 flex items-baseline gap-2">
            {usdcLoading ? (
              <div className="h-10 w-44 rounded shimmer animate-shimmer" />
            ) : (
              <>
                <motion.div key={String(usdc?.value ?? "0")}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-semibold tracking-tight tabular-nums">
                  {formatUSDC(usdc?.value, usdc?.decimals)}
                </motion.div>
                <span className="text-arc-mute text-sm font-mono">USDC</span>
              </>
            )}
          </div>
        </div>

        {/* EURC balance */}
        <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute">EURC</div>
            {eurcLoading ? (
              <div className="mt-1 h-5 w-24 rounded shimmer animate-shimmer" />
            ) : (
              <div className="font-mono text-base tabular-nums mt-1">
                {formatUSDC(eurcRaw as bigint | undefined, eurcDecimals ?? 6)}{" "}
                <span className="text-xs text-arc-mute">EURC</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-arc-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-arc-success" style={{ boxShadow: "0 0 4px rgba(59,214,138,0.7)" }} />
            Live
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { EURC_ADDRESS, FAUCET_URL } from "@/lib/chain";
import { formatUSDC, shortAddress } from "@/lib/format";

export function BalanceCard() {
  const { address } = useAccount();

  const { data: usdc, isLoading: usdcLoading } = useBalance({
    address,
    query: { refetchInterval: 12_000 },
  });

  const { data: eurcRaw, isLoading: eurcLoading } = useReadContract({
    address: EURC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 12_000 },
  });

  const { data: eurcDecimals } = useReadContract({
    address: EURC_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: !!address, staleTime: Infinity },
  });

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
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute">
              Account
            </div>
            <div className="mt-1 font-mono text-sm">{shortAddress(address)}</div>
          </div>
          <a
            href={FAUCET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-arc-accent2 hover:text-arc-ink transition-colors"
          >
            Need test funds? →
          </a>
        </div>

        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute">
            USDC balance (native)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {usdcLoading ? (
              <div className="h-10 w-44 rounded shimmer animate-shimmer" />
            ) : (
              <>
                <motion.div
                  key={String(usdc?.value ?? "0")}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-semibold tracking-tight tabular-nums"
                >
                  {formatUSDC(usdc?.value, usdc?.decimals)}
                </motion.div>
                <span className="text-arc-mute text-sm font-mono">USDC</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-white/5 flex items-baseline justify-between">
          <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute">
            EURC
          </div>
          {eurcLoading ? (
            <div className="h-5 w-24 rounded shimmer animate-shimmer" />
          ) : (
            <div className="font-mono text-sm tabular-nums">
              {formatUSDC(eurcRaw as bigint | undefined, eurcDecimals ?? 6)}{" "}
              <span className="text-arc-mute">EURC</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

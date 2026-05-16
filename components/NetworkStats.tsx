"use client";

import { useBlockNumber, useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { arcTestnet, EXPLORER_URL, FAUCET_URL } from "@/lib/chain";

export function NetworkStats() {
  const { chain } = useAccount();
  const { data: block, isLoading } = useBlockNumber({
    watch: true,
    query: { refetchInterval: 3_000 },
  });

  const onArc = chain?.id === arcTestnet.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl px-5 py-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${onArc ? "bg-arc-success" : "bg-arc-mute"}`}
            style={onArc ? { boxShadow: "0 0 6px 1px rgba(59,214,138,0.6)" } : undefined}
          />
          <span className="text-xs text-arc-mute">
            {onArc ? "Connected to Arc Testnet" : "Arc Testnet"}
          </span>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <Stat
            label="Block"
            value={isLoading ? "…" : block ? `#${block.toLocaleString()}` : "—"}
          />
          <Stat label="Chain ID" value="5042002" mono />
          <Stat label="Gas token" value="USDC" />
          <Stat label="Finality" value="< 1s" />

          <div className="flex items-center gap-3">
            <a
              href={FAUCET_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-arc-accent2 hover:text-arc-ink transition-colors"
            >
              Faucet ↗
            </a>
            <a
              href={EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-arc-mute hover:text-arc-ink transition-colors"
            >
              Arcscan ↗
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-[0.16em] text-arc-mute">{label}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`text-sm font-medium mt-0.5 ${mono ? "font-mono" : ""}`}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { loadTxs } from "@/lib/storage";

export function AccountStats() {
  const { address } = useAccount();

  const stats = useMemo(() => {
    if (!address) return null;
    const txs = loadTxs(address);
    const success = txs.filter((t) => t.status === "success");
    const totalUSDC = success
      .filter((t) => t.token === "USDC")
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalEURC = success
      .filter((t) => t.token === "EURC")
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    const uniqueRecipients = new Set(success.map((t) => t.to.toLowerCase())).size;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = success.filter((t) => t.timestamp >= today.getTime()).length;

    return { total: txs.length, success: success.length, totalUSDC, totalEURC, uniqueRecipients, todayCount };
  }, [address]);

  if (!stats || stats.total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-4"
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-arc-mute mb-3">Your activity</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Pill label="Transactions" value={String(stats.success)} />
        <Pill label="USDC sent" value={stats.totalUSDC.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
        <Pill label="EURC sent" value={stats.totalEURC.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
        <Pill label="Recipients" value={String(stats.uniqueRecipients)} />
      </div>
    </motion.div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold font-mono tabular-nums">{value}</div>
      <div className="text-[10px] text-arc-mute mt-0.5">{label}</div>
    </div>
  );
}

import { formatUnits, parseUnits } from "viem";

export const shortAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

export const formatUSDC = (value?: bigint, decimals = 18) => {
  if (value === undefined || value === null) return "0.00";
  const n = Number(formatUnits(value, decimals));
  if (!Number.isFinite(n)) return "0.00";
  if (n === 0) return "0.00";
  if (n < 0.01) return "< 0.01";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

export const parseUSDC = (input: string, decimals = 18) => parseUnits(input as `${number}`, decimals);

export const relativeTime = (timestamp: number) => {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

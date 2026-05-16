"use client";

import { Address, Hash } from "viem";

export type StoredTx = {
  hash: Hash;
  from: Address;
  to: Address;
  amount: string;
  token: "USDC" | "EURC";
  timestamp: number;
  note?: string;
  status: "pending" | "success" | "failed";
};

const KEY = "arc-flow:txs:v1";

export const loadTxs = (account?: Address): StoredTx[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const all: StoredTx[] = raw ? JSON.parse(raw) : [];
    if (!account) return all;
    return all.filter((t) => t.from.toLowerCase() === account.toLowerCase());
  } catch {
    return [];
  }
};

export const saveTx = (tx: StoredTx) => {
  if (typeof window === "undefined") return;
  const all = loadTxs();
  const next = [tx, ...all.filter((t) => t.hash !== tx.hash)].slice(0, 50);
  window.localStorage.setItem(KEY, JSON.stringify(next));
};

export const updateTxStatus = (hash: Hash, status: StoredTx["status"]) => {
  if (typeof window === "undefined") return;
  const all = loadTxs();
  const next = all.map((t) => (t.hash === hash ? { ...t, status } : t));
  window.localStorage.setItem(KEY, JSON.stringify(next));
};

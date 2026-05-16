"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount, useSendTransaction, useBalance } from "wagmi";
import { isAddress, parseUnits, type Address, type Hash } from "viem";
import { saveTx } from "@/lib/storage";
import { shortAddress, formatUSDC } from "@/lib/format";
import { txUrl } from "@/lib/chain";
import { loadContacts } from "@/lib/contacts";

type Row = { id: number; to: string; amount: string };
type RowResult = { hash: Hash; status: "pending" | "success" | "failed"; to: string; amount: string };

let _id = 0;
const mkRow = (): Row => ({ id: ++_id, to: "", amount: "" });

export function BatchSend() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendTransactionAsync } = useSendTransaction();

  const [rows, setRows] = useState<Row[]>([mkRow(), mkRow()]);
  const [results, setResults] = useState<RowResult[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const contacts = loadContacts();

  const update = (id: number, field: keyof Omit<Row, "id">, val: string) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: val } : row)));

  const addRow = () => setRows((r) => [...r, mkRow()]);
  const removeRow = (id: number) => setRows((r) => r.filter((row) => row.id !== id));

  const validRows = rows.filter(
    (r) => isAddress(r.to.trim()) && parseFloat(r.amount) > 0
  );

  const totalAmount = validRows.reduce((s, r) => s + parseFloat(r.amount), 0);
  const canSend = validRows.length > 0 && !running && !!address;

  const autofill = useCallback(
    (id: number, addr: string) => update(id, "to", addr),
    []
  );

  const sendAll = async () => {
    if (!address || !canSend) return;
    setRunning(true);
    setDone(false);
    const initial: RowResult[] = validRows.map((r) => ({
      hash: "" as Hash,
      status: "pending",
      to: r.to.trim(),
      amount: r.amount,
    }));
    setResults(initial);

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        const hash = await sendTransactionAsync({
          to: row.to.trim() as Address,
          value: parseUnits(row.amount as `${number}`, 18),
        });
        saveTx({
          hash,
          from: address,
          to: row.to.trim() as Address,
          amount: row.amount,
          token: "USDC",
          timestamp: Date.now(),
          note: `Batch send (${i + 1}/${validRows.length})`,
          status: "pending",
        });
        setResults((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, hash, status: "success" } : r))
        );
      } catch {
        setResults((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, status: "failed" } : r))
        );
      }
    }

    setRunning(false);
    setDone(true);
  };

  const reset = () => {
    setRows([mkRow(), mkRow()]);
    setResults([]);
    setDone(false);
  };

  if (done && results.length > 0) {
    const succeeded = results.filter((r) => r.status === "success").length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Batch complete</h3>
          <button onClick={reset} className="text-xs text-arc-mute hover:text-arc-ink transition-colors">
            Send another batch
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-arc-success/10 border border-arc-success/20">
          <svg viewBox="0 0 20 20" className="h-5 w-5 text-arc-success shrink-0" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          <span className="text-sm">
            {succeeded}/{results.length} transactions sent successfully
          </span>
        </div>

        <ul className="space-y-2">
          {results.map((r, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-3 glass rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full shrink-0 ${r.status === "success" ? "bg-arc-success" : "bg-arc-danger"}`} />
                <span className="font-mono text-sm">{shortAddress(r.to)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm tabular-nums">{r.amount} <span className="text-arc-mute">USDC</span></span>
                {r.hash && (
                  <a href={txUrl(r.hash)} target="_blank" rel="noreferrer"
                    className="text-xs text-arc-accent2 hover:underline">
                    Arcscan ↗
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Batch send</h3>
          <p className="text-xs text-arc-mute mt-0.5">Send USDC to multiple addresses at once</p>
        </div>
        {balance && (
          <div className="text-right">
            <div className="text-[11px] text-arc-mute uppercase tracking-[0.16em]">Balance</div>
            <div className="text-sm font-mono tabular-nums">{formatUSDC(balance.value, balance.decimals)} USDC</div>
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        <AnimatePresence>
          {rows.map((row, idx) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 items-start"
            >
              <div className="h-8 w-7 flex items-center justify-center text-xs text-arc-mute shrink-0 mt-2.5">
                {idx + 1}
              </div>
              <div className="flex-1 grid grid-cols-[1fr,auto] gap-2">
                <div className="space-y-1.5">
                  <AddressInput
                    value={row.to}
                    onChange={(v) => update(row.id, "to", v)}
                    contacts={contacts}
                    onSelect={(addr) => autofill(row.id, addr)}
                  />
                </div>
                <input
                  value={row.amount}
                  onChange={(e) => update(row.id, "amount", e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-28 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 font-mono text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none tabular-nums"
                />
              </div>
              {rows.length > 1 && (
                <button
                  onClick={() => removeRow(row.id)}
                  className="mt-2.5 h-8 w-8 flex items-center justify-center rounded-lg text-arc-mute hover:text-arc-danger hover:bg-arc-danger/10 transition-colors shrink-0"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                    <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm text-arc-accent2 hover:text-arc-ink transition-colors"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
          Add recipient
        </button>
        {validRows.length > 0 && (
          <span className="ml-auto text-xs text-arc-mute">
            Total: <span className="text-arc-ink font-mono">{totalAmount.toFixed(4)}</span> USDC to {validRows.length} addresses
          </span>
        )}
      </div>

      {running && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-arc-mute">Sending sequentially — approve each in MetaMask…</p>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-2.5">
              {r.status === "pending" && i === results.findIndex((x) => x.status === "pending") ? (
                <Spinner className="h-3.5 w-3.5 text-arc-accent" />
              ) : (
                <span className={`h-2 w-2 rounded-full ${r.status === "success" ? "bg-arc-success" : r.status === "failed" ? "bg-arc-danger" : "bg-arc-mute"}`} />
              )}
              <span className="font-mono text-xs flex-1">{shortAddress(r.to)}</span>
              <span className="font-mono text-xs text-arc-mute">{r.amount} USDC</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={sendAll}
        disabled={!canSend}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-glow"
      >
        {running ? (
          <><Spinner /> Sending {validRows.length} transactions…</>
        ) : (
          <>Send to {validRows.length || "…"} addresses &rarr;</>
        )}
      </button>

      <p className="text-[11px] text-arc-mute text-center">
        Each transfer is a separate transaction. MetaMask will prompt once per recipient.
      </p>
    </motion.div>
  );
}

function AddressInput({
  value,
  onChange,
  contacts,
  onSelect,
}: {
  value: string;
  onChange: (v: string) => void;
  contacts: ReturnType<typeof loadContacts>;
  onSelect: (addr: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const matches = value.length >= 1
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(value.toLowerCase()) ||
          c.address.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="0x… or contact name"
        spellCheck={false}
        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 font-mono text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 top-full mt-1 w-full bg-arc-panel border border-white/8 rounded-xl overflow-hidden shadow-lg">
          {matches.map((c) => (
            <button
              key={c.address}
              onMouseDown={() => { onSelect(c.address); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] text-left transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-arc-accent/15 flex items-center justify-center text-xs text-arc-accent font-medium shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm truncate">{c.name}</div>
                <div className="text-xs text-arc-mute font-mono truncate">{shortAddress(c.address)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} animate-spin`} fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

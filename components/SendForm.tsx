"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useAccount,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { erc20Abi, isAddress, parseUnits, type Address, type Hash } from "viem";
import { EURC_ADDRESS, txUrl } from "@/lib/chain";
import { saveTx, updateTxStatus } from "@/lib/storage";
import { formatUSDC, shortAddress } from "@/lib/format";
import { loadSettings } from "@/lib/settings";
import { toast } from "@/lib/toast";
import { AddressInput } from "./AddressInput";

type Token = "USDC" | "EURC";
type Step = "form" | "confirm" | "done";

export function SendForm() {
  const { address } = useAccount();
  const { data: usdcBal } = useBalance({ address });
  const settings = useMemo(() => (typeof window !== "undefined" ? loadSettings() : null), []);

  const [token, setToken] = useState<Token>(settings?.defaultToken ?? "USDC");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [hash, setHash] = useState<Hash | undefined>();
  const [error, setError] = useState<string | null>(null);

  const native = useSendTransaction();
  const erc20 = useWriteContract();
  const isSubmitting = native.isPending || erc20.isPending;

  const receipt = useWaitForTransactionReceipt({ hash, query: { enabled: !!hash } });

  useEffect(() => {
    if (!hash) return;
    if (receipt.isSuccess) {
      updateTxStatus(hash, "success");
      toast.success("Transaction confirmed!", `${amount} ${token} delivered.`, {
        label: "View on Arcscan",
        href: txUrl(hash),
      });
    }
    if (receipt.isError) {
      updateTxStatus(hash, "failed");
      toast.error("Transaction failed", "Check Arcscan for details.");
    }
  }, [hash, receipt.isSuccess, receipt.isError, amount, token]);

  const validRecipient = useMemo(() => isAddress(to.trim()), [to]);
  const amountNum = parseFloat(amount);
  const validAmount = Number.isFinite(amountNum) && amountNum > 0;
  const canProceed = validRecipient && validAmount && !!address;

  const reset = () => {
    setHash(undefined); setAmount(""); setNote("");
    setError(null); setStep("form");
    native.reset(); erc20.reset();
  };

  const setMax = () => {
    if (token === "USDC" && usdcBal) {
      const reserve = parseUnits("0.05", 18);
      const safe = usdcBal.value > reserve ? usdcBal.value - reserve : 0n;
      const num = Number(safe) / 1e18;
      setAmount(num > 0 ? num.toFixed(4) : "0");
    }
  };

  const handleSend = async () => {
    if (!canProceed || !address) return;
    setError(null);
    const tid = toast.pending("Waiting for wallet…");
    try {
      let txHash: Hash;
      const cleanAmount = `${parseFloat(amount)}` as `${number}`;
      if (token === "USDC") {
        txHash = await native.sendTransactionAsync({
          to: to.trim() as Address,
          value: parseUnits(cleanAmount, 18),
        });
      } else {
        txHash = await erc20.writeContractAsync({
          address: EURC_ADDRESS,
          abi: erc20Abi,
          functionName: "transfer",
          args: [to.trim() as Address, parseUnits(cleanAmount, 6)],
        });
      }
      if (tid) toast.dismiss(tid);
      setHash(txHash);
      setStep("done");
      toast.info("Transaction sent!", "Confirming on Arc…");
      saveTx({
        hash: txHash, from: address, to: to.trim() as Address,
        amount, token, timestamp: Date.now(),
        note: note || undefined, status: "pending",
      });
    } catch (err: unknown) {
      if (tid) toast.dismiss(tid);
      const msg =
        err && typeof err === "object" && "shortMessage" in err
          ? String((err as { shortMessage: string }).shortMessage)
          : err instanceof Error ? err.message : "Transaction failed";
      setError(msg);
      toast.error("Transaction rejected", msg.slice(0, 80));
    }
  };

  if (step === "done" && hash) {
    const status = receipt.isSuccess ? "success" : receipt.isError ? "failed" : "pending";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-8 text-center space-y-5"
      >
        <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
          {status === "pending" && (
            <>
              <span className="absolute inset-0 rounded-full bg-arc-accent/30 animate-pulseRing" />
              <span className="absolute inset-2 rounded-full bg-arc-accent/20 animate-pulseRing" style={{ animationDelay: "0.4s" }} />
              <div className="relative h-12 w-12 rounded-full bg-arc-accent/15 flex items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            </>
          )}
          {status === "success" && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-16 w-16 rounded-full bg-arc-success/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-arc-success" fill="none">
                <motion.path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} />
              </svg>
            </motion.div>
          )}
          {status === "failed" && (
            <div className="h-16 w-16 rounded-full bg-arc-danger/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-arc-danger" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-medium">
            {status === "pending" ? "Confirming on Arc…" : status === "success" ? "Sent." : "Transaction failed"}
          </h3>
          <p className="text-arc-mute text-sm mt-1.5">
            {status === "success" ? `${amount} ${token} settled in milliseconds.` :
             status === "pending" ? "Sub-second finality. Hold tight." :
             "The network rejected this transaction."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={txUrl(hash)} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass text-arc-ink hover:bg-white/[0.06] transition">
            View on Arcscan ↗
          </a>
          <button onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-arc-ink text-arc-bg font-medium hover:opacity-90 transition">
            Send another
          </button>
        </div>
      </motion.div>
    );
  }

  if (step === "confirm") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setStep("form")} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-arc-mute hover:text-arc-ink transition-colors">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 3L6 8l4 5" />
            </svg>
          </button>
          <h3 className="text-base font-medium">Review transaction</h3>
        </div>

        <div className="glass rounded-2xl p-5 space-y-4">
          <Row label="To" value={<span className="font-mono text-sm">{shortAddress(to)}</span>} />
          <Row label="Amount" value={<span className="font-semibold text-lg">{amount} <span className="bg-gradient-to-r from-arc-accent to-arc-accent2 bg-clip-text text-transparent">{token}</span></span>} />
          {note && <Row label="Note" value={<span className="text-arc-mute text-sm">{note}</span>} />}
          <Row label="Network" value={<span className="text-sm">Arc Testnet</span>} />
          <Row label="Gas" value={<span className="text-sm text-arc-mute">Paid in USDC · ~&lt;$0.01</span>} />
        </div>

        <div className="flex items-center gap-2 text-xs text-arc-mute bg-arc-warn/5 border border-arc-warn/15 rounded-xl px-4 py-3">
          <svg viewBox="0 0 16 16" className="h-4 w-4 text-arc-warn shrink-0" fill="currentColor">
            <path d="M8 1l7 13H1L8 1zm0 4v5M8 11.5v1" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
          Double-check the recipient address. Blockchain transactions are irreversible.
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-arc-danger bg-arc-danger/10 border border-arc-danger/20 rounded-xl px-4 py-3">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handleSend}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white font-medium disabled:opacity-50 hover:shadow-glow transition-shadow"
        >
          {isSubmitting ? <><Spinner /> Confirm in MetaMask…</> : <>Confirm & Send {amount} {token}</>}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={(e) => { e.preventDefault(); if (canProceed) setStep("confirm"); }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Send</h3>
        <div className="flex items-center bg-white/[0.04] rounded-lg p-0.5">
          {(["USDC", "EURC"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setToken(t)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${token === t ? "text-arc-bg" : "text-arc-mute hover:text-arc-ink"}`}>
              {token === t && (
                <motion.div layoutId="send-token-pill" className="absolute inset-0 bg-arc-ink rounded-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-arc-mute">Recipient</label>
        <AddressInput value={to} onChange={setTo} />
        {to && !validRecipient && <p className="text-xs text-arc-danger">Not a valid Ethereum address.</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-arc-mute">Amount</label>
          {token === "USDC" && (
            <button type="button" onClick={setMax}
              className="text-xs text-arc-accent2 hover:text-arc-ink transition-colors">
              Max · {formatUSDC(usdcBal?.value, usdcBal?.decimals)} USDC
            </button>
          )}
        </div>
        <div className="relative">
          <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00" inputMode="decimal"
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 pr-16 font-mono text-lg placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none tabular-nums" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-arc-mute font-mono">{token}</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-arc-mute">Note (optional)</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Coffee, rent, invoice…" maxLength={80}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none" />
      </div>

      <button type="submit" disabled={!canProceed}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white font-medium disabled:opacity-40 hover:shadow-glow transition-shadow">
        Review &rarr;
      </button>

      <p className="text-[11px] text-arc-mute text-center">Gas is paid in USDC on Arc Testnet.</p>
    </motion.form>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-arc-mute">{label}</span>
      <div>{value}</div>
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

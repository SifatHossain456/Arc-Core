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
import { formatUSDC } from "@/lib/format";

type Token = "USDC" | "EURC";

export function SendForm() {
  const { address } = useAccount();
  const { data: usdcBal } = useBalance({ address });

  const [token, setToken] = useState<Token>("USDC");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [hash, setHash] = useState<Hash | undefined>();
  const [error, setError] = useState<string | null>(null);

  const native = useSendTransaction();
  const erc20 = useWriteContract();

  const isSubmitting = native.isPending || erc20.isPending;

  const receipt = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  useEffect(() => {
    if (!hash) return;
    if (receipt.isSuccess) updateTxStatus(hash, "success");
    if (receipt.isError) updateTxStatus(hash, "failed");
  }, [hash, receipt.isSuccess, receipt.isError]);

  const validRecipient = useMemo(() => isAddress(to.trim()), [to]);
  const amountNum = parseFloat(amount);
  const validAmount = Number.isFinite(amountNum) && amountNum > 0;
  const canSubmit = validRecipient && validAmount && !isSubmitting && !!address;

  const reset = () => {
    setHash(undefined);
    setAmount("");
    setNote("");
    setError(null);
    native.reset();
    erc20.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !address) return;
    setError(null);

    const recipient = to.trim() as Address;
    try {
      let txHash: Hash;
      if (token === "USDC") {
        const value = parseUnits(amount as `${number}`, 18);
        txHash = await native.sendTransactionAsync({ to: recipient, value });
      } else {
        const value = parseUnits(amount as `${number}`, 6);
        txHash = await erc20.writeContractAsync({
          address: EURC_ADDRESS,
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipient, value],
        });
      }
      setHash(txHash);
      saveTx({
        hash: txHash,
        from: address,
        to: recipient,
        amount,
        token,
        timestamp: Date.now(),
        note: note || undefined,
        status: "pending",
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "shortMessage" in err
          ? String((err as { shortMessage: string }).shortMessage)
          : err instanceof Error
          ? err.message
          : "Transaction failed";
      setError(message);
    }
  };

  const setMax = () => {
    if (token === "USDC" && usdcBal) {
      const reserve = parseUnits("0.05", 18);
      const safe = usdcBal.value > reserve ? usdcBal.value - reserve : 0n;
      const num = Number(safe) / 1e18;
      setAmount(num > 0 ? num.toFixed(4) : "0");
    }
  };

  if (hash) {
    const status = receipt.isSuccess
      ? "success"
      : receipt.isError
      ? "failed"
      : "pending";
    return <ConfirmationView hash={hash} status={status} amount={amount} token={token} onReset={reset} />;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Send</h3>
        <div className="flex items-center bg-white/[0.04] rounded-lg p-0.5">
          {(["USDC", "EURC"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setToken(t)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                token === t ? "text-arc-bg" : "text-arc-mute hover:text-arc-ink"
              }`}
            >
              {token === t && (
                <motion.div
                  layoutId="token-pill"
                  className="absolute inset-0 bg-arc-ink rounded-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-arc-mute">Recipient</label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x…"
          spellCheck={false}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 font-mono text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
        />
        {to && !validRecipient && (
          <p className="text-xs text-arc-danger">Not a valid Ethereum address.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-arc-mute">Amount</label>
          {token === "USDC" && (
            <button
              type="button"
              onClick={setMax}
              className="text-xs text-arc-accent2 hover:text-arc-ink transition-colors"
            >
              Max · {formatUSDC(usdcBal?.value, usdcBal?.decimals)} USDC
            </button>
          )}
        </div>
        <div className="relative">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            inputMode="decimal"
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 pr-16 font-mono text-lg placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none tabular-nums"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-arc-mute font-mono">
            {token}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-arc-mute">Note (optional, stored locally)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Coffee, rent, whatever"
          maxLength={80}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-arc-danger bg-arc-danger/10 border border-arc-danger/20 rounded-lg px-3 py-2"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-glow"
      >
        {isSubmitting ? (
          <>
            <Spinner /> Waiting for wallet…
          </>
        ) : (
          <>
            Send {amount || "0"} {token}
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
              <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      <p className="text-[11px] text-arc-mute text-center leading-relaxed">
        Gas is paid in USDC. A tiny amount of USDC is reserved when you click Max.
      </p>
    </motion.form>
  );
}

function ConfirmationView({
  hash,
  status,
  amount,
  token,
  onReset,
}: {
  hash: Hash;
  status: "pending" | "success" | "failed";
  amount: string;
  token: Token;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-3xl p-8 text-center"
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-16 w-16 rounded-full bg-arc-success/15 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-arc-success" fill="none">
              <motion.path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
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

      <h3 className="mt-6 text-xl font-medium">
        {status === "pending" && "Confirming on Arc…"}
        {status === "success" && "Sent."}
        {status === "failed" && "Transaction failed"}
      </h3>
      <p className="mt-2 text-arc-mute text-sm">
        {status === "success"
          ? `${amount} ${token} settled in seconds.`
          : status === "pending"
          ? "Sub-second finality. Hold tight."
          : "The network rejected this transaction."}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={txUrl(hash)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass text-arc-ink hover:bg-white/[0.06] transition"
        >
          View on Arcscan
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M5 3h8v8h-2V6.41L4.41 13 3 11.59 9.59 5H5V3z" />
          </svg>
        </a>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-arc-ink text-arc-bg font-medium hover:opacity-90 transition"
        >
          Send another
        </button>
      </div>
    </motion.div>
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

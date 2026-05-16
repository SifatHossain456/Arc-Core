"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAccount,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { erc20Abi, parseUnits, type Address, type Hash } from "viem";
import { arcTestnet, EURC_ADDRESS, txUrl } from "@/lib/chain";
import { shortAddress, formatUSDC } from "@/lib/format";
import { saveTx, updateTxStatus } from "@/lib/storage";
import type { PaymentRequest } from "@/lib/request";

export function PayPage({ req, encoded }: { req: PaymentRequest; encoded: string }) {
  const { address, isConnected, chain } = useAccount();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { data: balance } = useBalance({ address, query: { enabled: isConnected } });

  const native = useSendTransaction();
  const erc20 = useWriteContract();
  const [hash, setHash] = useState<Hash | undefined>();
  const [error, setError] = useState<string | null>(null);

  const receipt = useWaitForTransactionReceipt({ hash, query: { enabled: !!hash } });

  useEffect(() => {
    if (!hash) return;
    if (receipt.isSuccess) updateTxStatus(hash, "success");
    if (receipt.isError) updateTxStatus(hash, "failed");
  }, [hash, receipt.isSuccess, receipt.isError]);

  const wrongChain = isConnected && chain?.id !== arcTestnet.id;
  const isSelf = isConnected && address?.toLowerCase() === req.to.toLowerCase();
  const isSubmitting = native.isPending || erc20.isPending;

  const insufficient = useMemo(() => {
    if (!balance || req.token !== "USDC") return false;
    try {
      return parseUnits(req.amount as `${number}`, 18) > balance.value;
    } catch {
      return false;
    }
  }, [balance, req]);

  const pay = async () => {
    if (!address) return;
    setError(null);
    try {
      let txHash: Hash;
      if (req.token === "USDC") {
        txHash = await native.sendTransactionAsync({
          to: req.to as Address,
          value: parseUnits(req.amount as `${number}`, 18),
        });
      } else {
        txHash = await erc20.writeContractAsync({
          address: EURC_ADDRESS,
          abi: erc20Abi,
          functionName: "transfer",
          args: [req.to as Address, parseUnits(req.amount as `${number}`, 6)],
        });
      }
      setHash(txHash);
      saveTx({
        hash: txHash,
        from: address,
        to: req.to as Address,
        amount: req.amount,
        token: req.token,
        timestamp: Date.now(),
        note: req.note || undefined,
        status: "pending",
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "shortMessage" in err
          ? String((err as { shortMessage: string }).shortMessage)
          : err instanceof Error ? err.message : "Transaction failed";
      setError(msg);
    }
  };

  const status = receipt.isSuccess ? "success" : receipt.isError ? "failed" : hash ? "pending" : null;

  return (
    <div className="min-h-screen bg-arc-bg flex flex-col items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-arc-mute text-sm hover:text-arc-ink transition-colors">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 3L6 8l4 5" />
            </svg>
            Arc Flow
          </a>
        </div>

        <div className="glass rounded-3xl overflow-hidden">
          {/* Request details */}
          <div className="p-8 border-b border-white/5 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-arc-accent/20 to-arc-accent2/20 flex items-center justify-center text-2xl mb-5">
              💸
            </div>

            <div className="text-arc-mute text-sm mb-1">
              <span className="text-arc-ink font-medium">
                {req.label || shortAddress(req.to)}
              </span>{" "}
              is requesting
            </div>

            <div className="text-5xl font-semibold tracking-tight tabular-nums mt-3">
              {req.amount}
              <span className="ml-2 bg-gradient-to-r from-arc-accent to-arc-accent2 bg-clip-text text-transparent">
                {req.token}
              </span>
            </div>

            {req.note && (
              <div className="mt-4 inline-block px-4 py-2 rounded-full bg-white/[0.04] text-sm text-arc-mute">
                &ldquo;{req.note}&rdquo;
              </div>
            )}

            <div className="mt-4 text-xs text-arc-mute font-mono">
              → {shortAddress(req.to)}
            </div>

            {isConnected && req.token === "USDC" && (
              <div className="mt-3 text-xs text-arc-mute">
                Your balance: {formatUSDC(balance?.value, balance?.decimals)} USDC
              </div>
            )}
          </div>

          {/* Action area */}
          <div className="p-6 space-y-3">
            <AnimatePresence mode="wait">
              {status === "success" && (
                <SuccessView hash={hash!} amount={req.amount} token={req.token} />
              )}
              {status === "failed" && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-4 text-arc-danger text-sm"
                >
                  Transaction failed.{" "}
                  <button onClick={() => { setHash(undefined); setError(null); native.reset(); erc20.reset(); }} className="underline">
                    Try again
                  </button>
                </motion.div>
              )}
              {status === "pending" && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-4 space-y-2"
                >
                  <div className="flex items-center justify-center gap-2 text-arc-mute text-sm">
                    <Spinner /> Confirming on Arc…
                  </div>
                  <a href={txUrl(hash!)} target="_blank" rel="noreferrer" className="text-xs text-arc-accent2 hover:underline">
                    View on Arcscan
                  </a>
                </motion.div>
              )}
              {!status && (
                <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {!isConnected ? (
                    <div className="flex justify-center">
                      <ConnectButton label="Connect wallet to pay" />
                    </div>
                  ) : wrongChain ? (
                    <button
                      onClick={() => switchChain({ chainId: arcTestnet.id })}
                      disabled={switching}
                      className="w-full py-3.5 rounded-xl bg-arc-warn/15 text-arc-warn border border-arc-warn/20 text-sm font-medium hover:bg-arc-warn/25 transition-colors disabled:opacity-50"
                    >
                      {switching ? "Switching…" : "Switch to Arc Testnet"}
                    </button>
                  ) : isSelf ? (
                    <div className="text-center text-sm text-arc-mute py-3">
                      This is your own payment request.
                    </div>
                  ) : (
                    <button
                      onClick={pay}
                      disabled={isSubmitting || insufficient}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-glow"
                    >
                      {isSubmitting ? (
                        <><Spinner /> Waiting for wallet…</>
                      ) : insufficient ? (
                        "Insufficient USDC balance"
                      ) : (
                        <>Pay {req.amount} {req.token}</>
                      )}
                    </button>
                  )}

                  {error && (
                    <p className="text-xs text-arc-danger text-center">{error}</p>
                  )}

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-arc-mute">
                    <svg viewBox="0 0 14 14" className="h-3 w-3" fill="currentColor">
                      <path d="M7 1a6 6 0 100 12A6 6 0 007 1zm0 1a5 5 0 110 10A5 5 0 017 2zm-.5 2.5v4l3 1.5.5-.87-2.5-1.25V4.5H6.5z" />
                    </svg>
                    Settles on Arc in under a second · Gas paid in USDC
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-arc-mute">
          Powered by{" "}
          <a href="/" className="text-arc-ink hover:underline">Arc Flow</a>
          {" · "}
          <a href="https://www.arc.io" target="_blank" rel="noreferrer" className="hover:underline">
            arc.io
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function SuccessView({ hash, amount, token }: { hash: Hash; amount: string; token: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-4 space-y-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        className="mx-auto h-16 w-16 rounded-full bg-arc-success/15 flex items-center justify-center"
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
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
      </motion.div>

      <div>
        <div className="text-xl font-medium">Payment sent!</div>
        <div className="text-arc-mute text-sm mt-1">
          {amount} {token} settled instantly.
        </div>
      </div>

      <a
        href={txUrl(hash)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-arc-accent2 hover:underline"
      >
        View on Arcscan
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
          <path d="M3.5 2H2v8h8V8.5H9V9H3V3h.5V2zm2 0v1H8.3L4 7.3l.7.7L9 3.7V6h1V2H5.5z" />
        </svg>
      </a>
    </motion.div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useAccount } from "wagmi";
import { encodeRequest, saveRequest, loadRequests, type PaymentRequest } from "@/lib/request";
import { shortAddress, relativeTime } from "@/lib/format";
import { EXPLORER_URL } from "@/lib/chain";

type Token = "USDC" | "EURC";

export function CreateRequest() {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<Token>("USDC");
  const [note, setNote] = useState("");
  const [label, setLabel] = useState("");
  const [generated, setGenerated] = useState<{ url: string; encoded: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [past, setPast] = useState<Array<PaymentRequest & { encoded: string }>>([]);

  useEffect(() => {
    setPast(loadRequests());
  }, [generated]);

  const canGenerate = useMemo(() => {
    const n = parseFloat(amount);
    return !!address && Number.isFinite(n) && n > 0;
  }, [address, amount]);

  const generate = () => {
    if (!canGenerate || !address) return;
    const req = { to: address, amount, token, note, label };
    const encoded = encodeRequest(req);
    const url = `${window.location.origin}/pay/${encoded}`;
    saveRequest({ ...req, createdAt: Date.now() }, encoded);
    setGenerated({ url, encoded });
  };

  const copy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setGenerated(null);
    setAmount("");
    setNote("");
    setLabel("");
  };

  if (generated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Your payment link</h3>
          <button
            onClick={reset}
            className="text-xs text-arc-mute hover:text-arc-ink transition-colors"
          >
            Create another
          </button>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="p-4 rounded-2xl bg-white">
            <QRCodeSVG
              value={generated.url}
              size={180}
              level="M"
              includeMargin={false}
              fgColor="#05060A"
              bgColor="#ffffff"
            />
          </div>

          <div className="w-full space-y-3">
            <div className="text-center">
              <div className="text-2xl font-semibold tabular-nums">
                {amount}{" "}
                <span className="bg-gradient-to-r from-arc-accent to-arc-accent2 bg-clip-text text-transparent">
                  {token}
                </span>
              </div>
              {note && (
                <div className="text-sm text-arc-mute mt-1">{note}</div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-3">
              <span className="flex-1 text-xs font-mono text-arc-mute truncate">
                {generated.url}
              </span>
              <button
                onClick={copy}
                className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-arc-accent/15 text-arc-accent hover:bg-arc-accent/25 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copy}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white text-sm font-medium hover:shadow-glow transition-shadow"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 9L1 5l4-4M11 1l4 4-4 4M9.5 1l-3 14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Share link
              </button>
              <a
                href={generated.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass text-arc-ink text-sm hover:bg-white/[0.06] transition-colors"
              >
                Preview page
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M5 3h8v8h-2V6.41L4.41 13 3 11.59 9.59 5H5V3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Request payment</h3>
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
                    layoutId="req-token-pill"
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
          <label className="text-xs text-arc-mute">Amount to request</label>
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
          <label className="text-xs text-arc-mute">What&apos;s it for?</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Coffee, rent, freelance invoice…"
            maxLength={80}
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-arc-mute">Your name / label (shown on pay page)</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={address ? shortAddress(address) : "e.g. Sifat"}
            maxLength={40}
            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
          />
        </div>

        <div className="pt-1 space-y-2">
          <div className="flex items-center gap-2 text-xs text-arc-mute bg-white/[0.02] rounded-xl px-4 py-3">
            <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-arc-accent2" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zM7.25 5v4.5l3.5 2 .75-1.3-2.75-1.63V5H7.25z" />
            </svg>
            Link encodes your wallet address. Anyone with it can pay you directly on Arc Testnet.
          </div>

          <button
            disabled={!canGenerate}
            onClick={generate}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-glow"
          >
            Generate link & QR code
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <path d="M9 9h2v2H9zM11 11h4M13 9v4" />
            </svg>
          </button>
        </div>
      </motion.div>

      {past.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Past requests</h3>
            <span className="text-[11px] text-arc-mute uppercase tracking-[0.18em]">{past.length}</span>
          </div>
          <ul className="divide-y divide-white/5 -mx-2">
            {past.slice(0, 6).map((r, i) => (
              <li key={i} className="px-2 py-3">
                <a
                  href={`${typeof window !== "undefined" ? window.location.origin : ""}/pay/${r.encoded}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:bg-white/[0.025] rounded-lg p-2 -m-2 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-arc-accent/10 flex items-center justify-center text-arc-accent shrink-0">
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M2 8h10M8 4l4 4-4 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm truncate">{r.note || `${r.token} request`}</span>
                      <span className="font-mono text-sm tabular-nums whitespace-nowrap">
                        {r.amount} <span className="text-arc-mute">{r.token}</span>
                      </span>
                    </div>
                    <div className="text-xs text-arc-mute mt-0.5">{relativeTime(r.createdAt)}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

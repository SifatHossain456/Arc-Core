"use client";

import { motion } from "framer-motion";
import { useAccount, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { arcTestnet } from "@/lib/chain";

export function NetworkGate({ children }: { children: React.ReactNode }) {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-10 text-center max-w-md mx-auto"
      >
        <div className="mx-auto h-12 w-12 rounded-2xl bg-arc-accent/10 flex items-center justify-center text-arc-accent">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M21 12V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-1m-4-2h4m-4 0a2 2 0 010-4h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-medium">Connect your wallet</h2>
        <p className="mt-2 text-sm text-arc-mute">
          Connect MetaMask to start sending stablecoins on Arc Testnet.
        </p>
        <div className="mt-6 flex justify-center">
          <ConnectButton />
        </div>
      </motion.div>
    );
  }

  if (chain?.id !== arcTestnet.id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-10 text-center max-w-md mx-auto"
      >
        <div className="mx-auto h-12 w-12 rounded-2xl bg-arc-warn/10 flex items-center justify-center text-arc-warn">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-medium">Switch to Arc Testnet</h2>
        <p className="mt-2 text-sm text-arc-mute">
          You&apos;re on a different network. One click adds Arc Testnet to MetaMask if you
          don&apos;t have it yet.
        </p>
        <button
          onClick={() => switchChain({ chainId: arcTestnet.id })}
          disabled={isPending}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-arc-ink text-arc-bg font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {isPending ? "Switching…" : "Switch to Arc Testnet"}
        </button>
      </motion.div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { loadSettings, saveSettings, type Settings } from "@/lib/settings";
import { toast } from "@/lib/toast";

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [s, setS] = useState<Settings>({ displayName: "", defaultToken: "USDC", confirmBeforeSend: true });

  useEffect(() => {
    if (open) setS(loadSettings());
  }, [open]);

  const save = () => {
    saveSettings(s);
    toast.success("Settings saved.");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto glass rounded-3xl p-6 space-y-5 border border-white/8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Settings</h2>
              <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-arc-mute hover:text-arc-ink hover:bg-white/[0.06] transition-colors">
                <svg viewBox="0 0 14 14" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-arc-mute">Display name (shown on payment pages)</label>
                <input
                  value={s.displayName}
                  onChange={(e) => setS({ ...s, displayName: e.target.value })}
                  placeholder="e.g. Sifat"
                  maxLength={40}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-arc-mute">Default token</label>
                <div className="flex gap-2">
                  {(["USDC", "EURC"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setS({ ...s, defaultToken: t })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        s.defaultToken === t
                          ? "bg-arc-accent/15 border-arc-accent/30 text-arc-accent"
                          : "border-white/5 text-arc-mute hover:text-arc-ink hover:bg-white/[0.04]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between cursor-pointer gap-4 py-1">
                <div>
                  <div className="text-sm">Confirm before sending</div>
                  <div className="text-xs text-arc-mute mt-0.5">Show a review screen before every transaction</div>
                </div>
                <div
                  onClick={() => setS({ ...s, confirmBeforeSend: !s.confirmBeforeSend })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${s.confirmBeforeSend ? "bg-arc-accent" : "bg-white/[0.10]"}`}
                >
                  <motion.div
                    animate={{ x: s.confirmBeforeSend ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
                  />
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/8 text-sm text-arc-mute hover:text-arc-ink hover:bg-white/[0.04] transition-colors">
                Cancel
              </button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white text-sm font-medium hover:shadow-glow transition-shadow">
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

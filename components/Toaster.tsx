"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore, toast as toastApi, type Toast } from "@/lib/toast";

const icons: Record<Toast["kind"], React.ReactNode> = {
  success: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-arc-success" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 8l3.5 3.5L13 4" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-arc-danger" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 4l8 8M12 4L4 12" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-arc-accent2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7v4M8 5.5v.5" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-arc-warn animate-spin" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const bg: Record<Toast["kind"], string> = {
  success: "border-arc-success/20 bg-arc-success/5",
  error:   "border-arc-danger/20 bg-arc-danger/5",
  info:    "border-arc-accent2/20 bg-arc-accent2/5",
  pending: "border-arc-warn/20 bg-arc-warn/5",
};

export function Toaster() {
  const toasts = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto w-80 max-w-[calc(100vw-2.5rem)] flex items-start gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-md shadow-lg ${bg[t.kind]}`}
            style={{ background: "rgba(11,13,20,0.85)" }}
          >
            <div className="shrink-0 mt-0.5">{icons[t.kind]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-snug">{t.title}</div>
              {t.body && <div className="text-xs text-arc-mute mt-0.5 leading-relaxed">{t.body}</div>}
              {t.action && (
                <a
                  href={t.action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-arc-accent2 hover:underline mt-1 block"
                >
                  {t.action.label} ↗
                </a>
              )}
            </div>
            <button
              onClick={() => toastApi.dismiss(t.id)}
              className="shrink-0 text-arc-mute hover:text-arc-ink transition-colors mt-0.5"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 2l8 8M10 2L2 10" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

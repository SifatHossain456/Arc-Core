"use client";

import { useEffect, useRef, useState } from "react";
import { isAddress } from "viem";
import { loadContacts } from "@/lib/contacts";
import { shortAddress } from "@/lib/format";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export function AddressInput({ value, onChange, placeholder = "0x… or contact name", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const contacts = loadContacts();
  const matches =
    value.length >= 1
      ? contacts
          .filter(
            (c) =>
              c.name.toLowerCase().includes(value.toLowerCase()) ||
              c.address.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 5)
      : contacts.slice(0, 5);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const valid = isAddress(value.trim());

  return (
    <div ref={ref} className={`relative ${className}`}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        spellCheck={false}
        className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 font-mono text-sm placeholder:text-arc-mute/60 focus:bg-white/[0.05] transition outline-none ${
          value && !valid
            ? "border-arc-danger/40 focus:border-arc-danger/60"
            : "border-white/5 focus:border-arc-accent/60"
        }`}
      />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {valid ? (
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-arc-success" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 7l3.5 3.5L12 3" />
            </svg>
          ) : (
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-arc-danger" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l8 8M11 3L3 11" />
            </svg>
          )}
        </div>
      )}

      {open && matches.length > 0 && (
        <div className="absolute z-30 top-full mt-1 w-full bg-arc-panel border border-white/8 rounded-xl overflow-hidden shadow-xl">
          {matches.map((c) => (
            <button
              key={c.address}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(c.address);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.05] text-left transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-arc-accent/20 to-arc-accent2/20 flex items-center justify-center text-xs text-arc-accent font-semibold shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm truncate">{c.name}</div>
                <div className="text-xs text-arc-mute font-mono truncate">{shortAddress(c.address)}</div>
              </div>
              {c.note && <span className="text-xs text-arc-mute/60 shrink-0">{c.note}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

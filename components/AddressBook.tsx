"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isAddress } from "viem";
import {
  loadContacts,
  saveContact,
  deleteContact,
  type Contact,
} from "@/lib/contacts";
import { shortAddress } from "@/lib/format";

export function AddressBook() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const refresh = () => setContacts(loadContacts());

  useEffect(() => { refresh(); }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  const canAdd = name.trim().length > 0 && isAddress(address.trim());

  const add = () => {
    if (!canAdd) return;
    saveContact({ name: name.trim(), address: address.trim(), note: note.trim() || undefined });
    setName(""); setAddress(""); setNote(""); setAdding(false);
    refresh();
  };

  const remove = (addr: string) => {
    deleteContact(addr);
    refresh();
  };

  const copy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Address book</h3>
          <p className="text-xs text-arc-mute mt-0.5">Saved addresses auto-complete in Send &amp; Batch</p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arc-accent/15 text-arc-accent text-xs font-medium hover:bg-arc-accent/25 transition-colors"
        >
          {adding ? "Cancel" : (
            <>
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M7 2v10M2 7h10" />
              </svg>
              Add contact
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-arc-mute">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alice"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-arc-mute">Note (optional)</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Teammate, client…"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-arc-mute">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x…"
                spellCheck={false}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 font-mono text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
              />
              {address && !isAddress(address) && (
                <p className="text-xs text-arc-danger">Invalid address.</p>
              )}
            </div>
            <button
              onClick={add}
              disabled={!canAdd}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-arc-accent to-arc-accent2 text-white text-sm font-medium disabled:opacity-40 hover:shadow-glow transition-shadow"
            >
              Save contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {contacts.length > 3 && (
        <div className="relative">
          <svg viewBox="0 0 16 16" className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-arc-mute" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="4" />
            <path d="M14 14l-3-3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full pl-8 pr-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-sm placeholder:text-arc-mute/60 focus:border-arc-accent/60 focus:bg-white/[0.05] transition outline-none"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-arc-mute">
          <div className="mx-auto h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 text-arc-mute/60">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          {search ? "No matches." : "No contacts yet. Add one above."}
        </div>
      ) : (
        <ul className="divide-y divide-white/5 -mx-2">
          <AnimatePresence>
            {filtered.map((c) => (
              <motion.li
                key={c.address}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="px-2 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-arc-accent/20 to-arc-accent2/20 flex items-center justify-center text-sm font-semibold text-arc-accent shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-arc-mute">{shortAddress(c.address)}</span>
                      {c.note && <span className="text-xs text-arc-mute/70">· {c.note}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copy(c.address)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg text-arc-mute hover:text-arc-accent2 hover:bg-white/[0.04] transition-colors"
                      title="Copy address"
                    >
                      {copied === c.address ? (
                        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-arc-success" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M2 7l3.5 3.5L12 3" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="4" y="4" width="8" height="8" rx="1" />
                          <path d="M2 10V3a1 1 0 011-1h7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => remove(c.address)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg text-arc-mute hover:text-arc-danger hover:bg-arc-danger/10 transition-colors"
                      title="Remove contact"
                    >
                      <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 4h10M5 4V2h4v2M6 7v4M8 7v4M3 4l.8 8h6.4l.8-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}

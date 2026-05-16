"use client";

export type Contact = {
  name: string;
  address: string;
  note?: string;
  addedAt: number;
};

const KEY = "arc-flow:contacts:v1";

export const loadContacts = (): Contact[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
};

export const saveContact = (c: Omit<Contact, "addedAt">) => {
  if (typeof window === "undefined") return;
  const all = loadContacts().filter(
    (x) => x.address.toLowerCase() !== c.address.toLowerCase()
  );
  window.localStorage.setItem(
    KEY,
    JSON.stringify([{ ...c, addedAt: Date.now() }, ...all].slice(0, 100))
  );
};

export const deleteContact = (address: string) => {
  if (typeof window === "undefined") return;
  const next = loadContacts().filter(
    (x) => x.address.toLowerCase() !== address.toLowerCase()
  );
  window.localStorage.setItem(KEY, JSON.stringify(next));
};

export const searchContacts = (query: string): Contact[] => {
  const q = query.toLowerCase();
  return loadContacts().filter(
    (c) =>
      c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
  );
};

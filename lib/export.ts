import type { StoredTx } from "./storage";

export const exportCSV = (txs: StoredTx[], filename = "arc-flow-history.csv") => {
  const headers = ["Hash", "From", "To", "Amount", "Token", "Note", "Status", "Date"];
  const rows = txs.map((t) => [
    t.hash,
    t.from,
    t.to,
    t.amount,
    t.token,
    t.note ?? "",
    t.status,
    new Date(t.timestamp).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

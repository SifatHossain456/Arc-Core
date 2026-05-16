import { notFound } from "next/navigation";
import { decodeRequest } from "@/lib/request";
import { PayPage } from "@/components/PayPage";

export default function PayRoute({ params }: { params: { data: string } }) {
  const req = decodeRequest(params.data);
  if (!req) notFound();
  return <PayPage req={req} encoded={params.data} />;
}

export function generateMetadata({ params }: { params: { data: string } }) {
  const req = decodeRequest(params.data);
  if (!req) return { title: "Invalid request" };
  return {
    title: `Pay ${req.amount} ${req.token}${req.note ? ` — ${req.note}` : ""} · Arc Flow`,
    description: `${req.label || "Someone"} is requesting ${req.amount} ${req.token} on Arc.`,
  };
}

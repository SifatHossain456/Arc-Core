import { notFound } from "next/navigation";
import { decodeRequest } from "@/lib/request";
import { PayPage } from "@/components/PayPage";

export default async function PayRoute({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  const req = decodeRequest(data);
  if (!req) notFound();
  return <PayPage req={req} encoded={data} />;
}

export async function generateMetadata({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  const req = decodeRequest(data);
  if (!req) return { title: "Invalid request" };
  return {
    title: `Pay ${req.amount} ${req.token}${req.note ? ` — ${req.note}` : ""} · Arc Flow`,
    description: `${req.label || "Someone"} is requesting ${req.amount} ${req.token} on Arc.`,
  };
}

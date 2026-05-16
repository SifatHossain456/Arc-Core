import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NetworkGate } from "@/components/NetworkGate";
import { BalanceCard } from "@/components/BalanceCard";
import { SendForm } from "@/components/SendForm";
import { TxHistory } from "@/components/TxHistory";

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="relative">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-aurora pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-5 pt-12 pb-16">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-arc-mute text-sm mt-1.5">
              Your USDC and EURC on Arc Testnet.
            </p>
          </div>

          <NetworkGate>
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-5">
              <div className="space-y-5">
                <BalanceCard />
                <TxHistory />
              </div>
              <SendForm />
            </div>
          </NetworkGate>
        </div>
      </main>
      <Footer />
    </>
  );
}

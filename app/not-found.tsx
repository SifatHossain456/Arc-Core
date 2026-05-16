import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
        <div className="absolute inset-0 bg-aurora pointer-events-none" />
        <div className="relative">
          <div className="text-[9rem] font-semibold leading-none tracking-tighter bg-gradient-to-b from-arc-ink/30 to-transparent bg-clip-text text-transparent select-none">
            404
          </div>
          <h1 className="-mt-4 text-2xl font-medium">Page not found</h1>
          <p className="mt-3 text-arc-mute max-w-sm">
            This page doesn&apos;t exist, or the payment link may be invalid or expired.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/" className="px-5 py-2.5 rounded-xl bg-arc-ink text-arc-bg font-medium hover:opacity-90 transition text-sm">
              Go home
            </Link>
            <Link href="/app" className="px-5 py-2.5 rounded-xl glass text-arc-ink hover:bg-white/[0.06] transition text-sm">
              Open app
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

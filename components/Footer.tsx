import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-xs text-arc-mute max-w-sm">
            A demo dApp on Arc Testnet — Circle&apos;s stablecoin L1. USDC is the gas token.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-arc-mute">
          <a href="https://www.arc.io" target="_blank" rel="noreferrer" className="hover:text-arc-ink">
            arc.io
          </a>
          <a href="https://docs.arc.io" target="_blank" rel="noreferrer" className="hover:text-arc-ink">
            Docs
          </a>
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="hover:text-arc-ink">
            Faucet
          </a>
          <a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" className="hover:text-arc-ink">
            Arcscan
          </a>
          <a
            href="https://github.com/SifatHossain456/Arc-Core"
            target="_blank"
            rel="noreferrer"
            className="hover:text-arc-ink"
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}

# Arc Flow

Send stablecoins at the speed of thought — on **Arc**, Circle's L1 for dollar-denominated finance.

A demo dApp that connects MetaMask to **Arc Testnet (chain 5042002)**, shows your USDC + EURC balances, and lets you send transactions with sub-second finality. USDC is the native gas token.

## Stack

- **Next.js 14** App Router · TypeScript · Tailwind
- **wagmi v2** + **viem** for chain reads/writes
- **RainbowKit** for MetaMask + WalletConnect with one-click network add
- **Framer Motion** for the animations

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: WalletConnect projectId
npm run dev
```

Open <http://localhost:3000>, hit **Open the app**, connect MetaMask. If you're on the wrong network the dashboard will offer a one-click switch — MetaMask adds Arc Testnet automatically.

Need test USDC? Grab some from the [Circle faucet](https://faucet.circle.com).

## Network

| Field | Value |
| --- | --- |
| RPC | `https://rpc.testnet.arc.network` |
| Chain ID | `5042002` (`0x4D0A72`) |
| Currency | `USDC` (18 decimals, native) |
| Explorer | <https://testnet.arcscan.app> |
| EURC | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` |

## Structure

```
app/
  page.tsx          landing
  app/page.tsx      dashboard (gated by NetworkGate)
  layout.tsx        providers + fonts
  providers.tsx     wagmi + RainbowKit + react-query
components/
  Header, Hero, FeatureGrid, Footer
  NetworkGate       wallet + chain gate
  BalanceCard       native USDC + EURC balances
  SendForm          send USDC (native) or EURC (ERC20)
  TxHistory         local history with live status
lib/
  chain.ts          arcTestnet defineChain + addresses
  wagmi.ts          RainbowKit config
  format.ts, storage.ts
```

## Deploy

One-click on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSifatHossain456%2FArc-Core&project-name=arc-flow&repository-name=arc-flow&env=NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID&envDescription=Optional%20—%20only%20needed%20for%20WalletConnect%20mobile%20support.%20Get%20one%20at%20cloud.walletconnect.com)

Or manually: import the repo at <https://vercel.com/new>, accept defaults
(Next.js detected, no build settings to change), and ship. Set
`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` from <https://cloud.walletconnect.com> if
you want WalletConnect mobile support — MetaMask injected works without it.

Every push to `main` redeploys automatically.

## License

MIT

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { metaMaskWallet, injectedWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { arcTestnet } from "./chain";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "arc_flow_demo_project_id";

export const wagmiConfig = getDefaultConfig({
  appName: "Arc Flow",
  projectId,
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(arcTestnet.rpcUrls.default.http[0]),
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, injectedWallet, walletConnectWallet],
    },
  ],
  ssr: true,
});

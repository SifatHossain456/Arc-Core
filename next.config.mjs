import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // MetaMask SDK optionally imports this React Native module — stub it out for web
    config.resolve.alias["@react-native-async-storage/async-storage"] = path.resolve(
      __dirname,
      "lib/stubs/async-storage.js"
    );
    return config;
  },
};

export default nextConfig;

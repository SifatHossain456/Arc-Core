import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "@react-native-async-storage/async-storage": "./lib/stubs/async-storage.js",
    },
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.alias["@react-native-async-storage/async-storage"] = path.resolve(
      __dirname,
      "lib/stubs/async-storage.js"
    );
    return config;
  },
};

export default nextConfig;

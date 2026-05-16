import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arc: {
          bg: "#05060A",
          panel: "#0B0D14",
          edge: "#1A1D29",
          ink: "#E8EAF1",
          mute: "#7A8094",
          accent: "#7C5CFF",
          accent2: "#3DD9D6",
          success: "#3BD68A",
          warn: "#FFB155",
          danger: "#FF6477",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(124,92,255,0.45)",
        ring: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 4s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

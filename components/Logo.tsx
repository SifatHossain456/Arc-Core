import { cn } from "@/lib/format";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7C5CFF" />
              <stop offset="1" stopColor="#3DD9D6" />
            </linearGradient>
          </defs>
          <path
            d="M16 3 L28 25 L22 25 L19.5 20 L12.5 20 L10 25 L4 25 Z"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="14" r="2" fill="#05060A" />
        </svg>
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-semibold tracking-tight">Arc Flow</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-arc-mute mt-0.5">
          Stablecoin rails
        </div>
      </div>
    </div>
  );
}

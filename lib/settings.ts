export type Settings = {
  displayName: string;
  defaultToken: "USDC" | "EURC";
  confirmBeforeSend: boolean;
};

const KEY = "arc-flow:settings:v1";
const defaults: Settings = {
  displayName: "",
  defaultToken: "USDC",
  confirmBeforeSend: true,
};

export const loadSettings = (): Settings => {
  if (typeof window === "undefined") return defaults;
  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return defaults;
  }
};

export const saveSettings = (s: Partial<Settings>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify({ ...loadSettings(), ...s }));
};

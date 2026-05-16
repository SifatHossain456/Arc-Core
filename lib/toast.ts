import { useEffect, useReducer, useCallback, useRef } from "react";

export type ToastKind = "success" | "error" | "info" | "pending";

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
  action?: { label: string; href: string };
  duration?: number;
};

type Action =
  | { type: "ADD"; toast: Toast }
  | { type: "REMOVE"; id: string };

const reducer = (state: Toast[], action: Action): Toast[] => {
  if (action.type === "ADD")
    return [action.toast, ...state].slice(0, 6);
  return state.filter((t) => t.id !== action.id);
};

let _dispatch: React.Dispatch<Action> | null = null;
let _counter = 0;

export const toast = {
  show: (t: Omit<Toast, "id">) => {
    if (!_dispatch) return;
    const id = `t${++_counter}`;
    _dispatch({ type: "ADD", toast: { ...t, id } });
    if (t.kind !== "pending") {
      setTimeout(
        () => _dispatch?.({ type: "REMOVE", id }),
        t.duration ?? (t.kind === "error" ? 6000 : 4000)
      );
    }
    return id;
  },
  dismiss: (id: string) => _dispatch?.({ type: "REMOVE", id }),
  success: (title: string, body?: string, action?: Toast["action"]) =>
    toast.show({ kind: "success", title, body, action }),
  error: (title: string, body?: string) =>
    toast.show({ kind: "error", title, body }),
  info: (title: string, body?: string) =>
    toast.show({ kind: "info", title, body }),
  pending: (title: string, body?: string) =>
    toast.show({ kind: "pending", title, body, duration: 60000 }),
};

export const useToastStore = () => {
  const [toasts, dispatch] = useReducer(reducer, []);
  _dispatch = dispatch;
  return toasts;
};

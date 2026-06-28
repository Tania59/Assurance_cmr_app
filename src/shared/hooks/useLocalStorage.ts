import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initial: T): [T, (val: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (val: T | ((p: T) => T)) => {
      setState((prev) => {
        const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key]
  );

  return [state, set];
}
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-cyan-500/20 bg-[#0A111F] text-slate-300 hover:text-[#00FF88] hover:border-cyan-500/40 transition shadow-inner"
      aria-label="Toggle theme"
    >
      {mounted ? (
        isDark ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}

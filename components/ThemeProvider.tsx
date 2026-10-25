"use client";

import * as React from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "tellclick-theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function readThemeAttribute(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * Client-side theme state. The actual light/dark decision for first paint is
 * made by the blocking inline script in app/layout.tsx (so there's no
 * flash-of-wrong-theme); this provider just mirrors that into React state so
 * components can read/toggle it, and keeps localStorage + the `data-theme`
 * attribute in sync afterwards.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer reads the `data-theme` attribute the blocking script
  // (see app/layout.tsx) already set on <html> before this component ever
  // mounts, so the very first client render already matches reality.
  const [theme, setTheme] = React.useState<Theme>(readThemeAttribute);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable (private mode, disabled) — theme still works
      // for this session via the data-theme attribute alone.
    }
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

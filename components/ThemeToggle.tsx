"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      suppressHydrationWarning
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 hover:bg-current/10",
        className
      )}
    >
      <Sun className="theme-icon-light size-[18px]" strokeWidth={1.75} />
      <Moon className="theme-icon-dark size-[18px]" strokeWidth={1.75} />
    </button>
  );
}

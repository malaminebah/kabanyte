"use client";

import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full transition-colors
        dark:bg-gray-800 dark:text-yellow-400
        bg-gray-100 text-gray-600
        hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
} 
import { Sun, Moon } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const isDay = theme === "light";

  useEffect(() => {
    // The stylesheet keys day mode off `.light` on <html>. This previously
    // toggled a `dark` class instead, which no CSS rule matched — so the button
    // saved a preference that never changed a single pixel.
    document.documentElement.classList.toggle("light", isDay);
  }, [isDay]);

  return (
    <button
      type="button"
      onClick={() => setTheme(isDay ? "dark" : "light")}
      aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
      aria-pressed={isDay}
      title={isDay ? "Night mode" : "Day mode"}
      className="fixed top-4 right-5 z-[60] flex items-center gap-1 p-1 rounded-full
                 bg-bg-soft/80 backdrop-blur-xl border border-primary/30
                 shadow-lg shadow-black/30 hover:border-primary
                 transition-colors duration-300"
    >
      {[
        { key: "day", icon: <Sun size={14} />, active: isDay },
        { key: "night", icon: <Moon size={14} />, active: !isDay },
      ].map(({ key, icon, active }) => (
        <span
          key={key}
          className="relative w-8 h-8 rounded-full flex items-center justify-center"
        >
          {active && (
            <motion.span
              layoutId="themeKnob"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="absolute inset-0 rounded-full bg-primary"
            />
          )}
          <span
            className={`relative z-10 transition-colors duration-300 ${
              active ? "text-white" : "text-primary-light/60"
            }`}
          >
            {icon}
          </span>
        </span>
      ))}
    </button>
  );
};

export default ThemeToggle;

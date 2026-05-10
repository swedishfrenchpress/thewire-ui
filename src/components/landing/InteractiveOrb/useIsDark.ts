import { useEffect, useState } from "react";

export function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () =>
      setIsDark(
        mq.matches ||
          document.documentElement.classList.contains("dark") ||
          document.documentElement.dataset.theme === "dark",
      );

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDark;
}

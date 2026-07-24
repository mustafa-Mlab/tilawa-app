"use client";

import { useEffect } from "react";

export function ScrollToAyah() {
  useEffect(() => {
    function scrollToTarget() {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);
      const ayahParam = urlParams.get("ayah");

      let ayahNum: string | null = null;
      if (hash && hash.startsWith("#ayah-")) {
        ayahNum = hash.replace("#ayah-", "");
      } else if (ayahParam) {
        ayahNum = ayahParam;
      }

      if (ayahNum) {
        const el = document.getElementById(`ayah-${ayahNum}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-emerald-500", "ring-offset-4", "dark:ring-offset-zinc-950", "transition-all", "duration-500");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-emerald-500", "ring-offset-4", "dark:ring-offset-zinc-950");
          }, 3500);
        }
      }
    }

    const timer = setTimeout(scrollToTarget, 350);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

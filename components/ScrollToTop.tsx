"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  useLayoutEffect(() => {
    // Preserve deliberate article-section links while resetting page navigation.
    if (window.location.hash) return;
    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    reset();
    // Run after the router's own layout/scroll handling as well.
    const frame = window.requestAnimationFrame(reset);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, query]);

  return null;
}

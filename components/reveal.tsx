"use client";

import { useEffect, useRef, type ReactNode } from "react";

function viewTimelineSupported() {
  return (
    typeof CSS !== "undefined" &&
    "supports" in CSS &&
    CSS.supports("animation-timeline: view()")
  );
}

export function Reveal({
  children,
  className,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.in = "true";
      return;
    }

    // Last-on-page blocks (footer) never travel through a view() cover
    // range, so they stay faded. Play the stamp once instead.
    if (viewTimelineSupported() && !once) {
      node.dataset.view = "true";
      node.dataset.in = "true";
      return;
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      node.dataset.in = "true";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (!once) {
          const vh = entry.rootBounds?.height ?? window.innerHeight;
          if (entry.boundingClientRect.top > vh * 0.72) return;
        }
        show();
        observer.disconnect();
      },
      {
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.7],
        rootMargin: once ? "0px" : "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  return (
    <div ref={ref} data-reveal="" className={className}>
      {children}
    </div>
  );
}

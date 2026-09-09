"use client";

import { useEffect, useState } from "react";
import type { ShopifyConnectionStatus } from "@/lib/shopify/types";

type BubbleState =
  | { phase: "checking" }
  | { phase: "ready"; status: ShopifyConnectionStatus }
  | { phase: "unreachable"; error: string };

type StatusTone = "checking" | "ok" | "error";

function toneFor(state: BubbleState): StatusTone {
  if (state.phase === "checking") return "checking";
  if (state.phase === "unreachable") return "error";
  return state.status.ok ? "ok" : "error";
}

function statusLabel(state: BubbleState): string {
  if (state.phase === "checking") return "Checking";
  if (state.phase === "unreachable") return "Unreachable";
  if (state.status.ok) return "Connected";
  if (!state.status.configured) return "Not configured";
  return "Disconnected";
}

function ledClass(tone: StatusTone): string {
  if (tone === "checking") return "bg-steel animate-pulse";
  if (tone === "ok") return "bg-amber";
  return "bg-rust";
}

function statusClass(tone: StatusTone): string {
  if (tone === "checking") return "text-steel";
  if (tone === "ok") return "text-amber";
  return "text-rust";
}

function detailFor(state: BubbleState): string | null {
  if (state.phase === "checking") return "Ping a Storefront API…";
  if (state.phase === "unreachable") return state.error;
  if (state.status.ok) {
    return state.status.shopName;
  }
  if (!state.status.configured) {
    return `Falta ${state.status.missing.join(", ")}`;
  }
  return state.status.error;
}

export function ShopifyDevBubble() {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState<BubbleState>({ phase: "checking" });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let cancelled = false;

    async function ping() {
      try {
        const response = await fetch("/api/shopify/status", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const status = (await response.json()) as ShopifyConnectionStatus;
        if (!cancelled) setState({ phase: "ready", status });
      } catch (error) {
        if (!cancelled) {
          setState({
            phase: "unreachable",
            error: error instanceof Error ? error.message : "Sin respuesta",
          });
        }
      }
    }

    void ping();
    return () => {
      cancelled = true;
    };
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  const tone = toneFor(state);
  const detail = detailFor(state);

  return (
    <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] left-5 z-90 max-w-[min(18rem,calc(100vw-7.5rem))]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-start gap-2 border border-line bg-asphalt/95 px-3 py-2 text-left shadow-[4px_4px_0_#0c0b09] backdrop-blur-sm"
        aria-expanded={open}
        aria-label={`Shopify ${statusLabel(state)}`}
      >
        <span
          aria-hidden
          className={`mt-1.5 size-2.5 shrink-0 rounded-full ${ledClass(tone)}`}
        />
        <span className="min-w-0">
          <span className="stamp block text-[10px] text-steel">Dev · Storefront</span>
          <span className={`mt-0.5 block text-sm font-medium ${statusClass(tone)}`}>
            {statusLabel(state)}
          </span>
          {open && detail ? (
            <span className="mt-1 block truncate text-[11px] leading-snug text-steel">
              {detail}
            </span>
          ) : null}
        </span>
      </button>
    </div>
  );
}

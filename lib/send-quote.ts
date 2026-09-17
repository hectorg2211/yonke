"use client";

import { whatsappUrl } from "@/lib/site";

export async function sendQuoteToWhatsApp(lines: string[], files: File[]) {
  const text = lines.filter((line): line is string => Boolean(line)).join("\n");

  if (files.length > 0 && typeof navigator.canShare === "function") {
    const payload = { text, files };
    try {
      if (navigator.canShare(payload)) {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
}
"use client";

import { submitQuote } from "@/app/actions/quote";
import { compressQuotePhotos } from "@/lib/compress-quote-photo";

export type QuoteDraft = {
  channel: "pieza" | "importacion";
  fields: Record<string, string>;
  files: File[];
};

export async function sendQuote(draft: QuoteDraft) {
  const photos = await compressQuotePhotos(draft.files);
  const form = new FormData();
  form.set("channel", draft.channel);
  for (const [key, value] of Object.entries(draft.fields)) {
    form.set(key, value);
  }
  for (const photo of photos) {
    form.append("photos", photo);
  }
  return submitQuote(form);
}

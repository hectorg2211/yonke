"use server";

import {
  articleTypes,
  axleKinds,
  cargoTypes,
  conditions,
  importModes,
  isAllowed,
  needsAxleKind,
  quotePhotoLimits,
  transportTypes,
} from "@/lib/quotes";
import {
  buildQuoteMail,
  quoteFrom,
  quoteInbox,
  type QuoteChannel,
  type QuoteMailAttachment,
} from "@/lib/quote-mail";
import {
  clipQuoteField,
  clipQuoteNote,
  quoteClientIp,
  quoteContactError,
  quoteRateOk,
  quoteTooFast,
} from "@/lib/quote-guard";

export type QuoteActionResult =
  | { ok: true }
  | { ok: false; error: string };

const MAX_COMPRESSED_BYTES = 900_000;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
]);

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function takePhotos(formData: FormData) {
  return formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
}

async function toAttachments(files: File[]): Promise<QuoteMailAttachment[]> {
  const attachments: QuoteMailAttachment[] = [];
  for (const [index, file] of files.entries()) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^\w.\-]+/gu, "-") || `foto-${index + 1}.jpg`;
    attachments.push({
      filename: safeName,
      content: bytes.toString("base64"),
    });
  }
  return attachments;
}

function validatePhotos(files: File[]): string | null {
  if (files.length > quotePhotoLimits.maxFiles) {
    return `Máximo ${quotePhotoLimits.maxFiles} fotos.`;
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type) && !file.type.startsWith("image/")) {
      return "Solo se aceptan fotografías.";
    }
    if (file.size > MAX_COMPRESSED_BYTES) {
      return "Una foto quedó muy pesada. Prueba otra más chica.";
    }
  }
  return null;
}

async function sendResendEmail(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments: QuoteMailAttachment[];
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Falta RESEND_API_KEY.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
      attachments: payload.attachments,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Resend ${response.status}`);
  }
}

function piezaRows(
  formData: FormData,
):
  | { rows: Array<{ label: string; value: string }> }
  | { error: string } {
  const article = readString(formData, "article");
  const condition = readString(formData, "condition");
  const axle = readString(formData, "axle");
  if (!isAllowed(article, articleTypes)) {
    return { error: "Elige el tipo de pieza." };
  }
  if (!isAllowed(condition, conditions)) {
    return { error: "Elige si la buscan nueva o usada." };
  }
  if (needsAxleKind(article) && !isAllowed(axle, axleKinds)) {
    return { error: "Elige el tipo de eje." };
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Tipo", value: article },
    { label: "Condición", value: condition },
  ];
  if (needsAxleKind(article) && axle) {
    rows.push({ label: "Subtipo", value: axle });
  }
  const extras = [
    ["Marca", clipQuoteField(readString(formData, "brand"))],
    ["Modelo", clipQuoteField(readString(formData, "model"))],
    ["Año", clipQuoteField(readString(formData, "year"), 8)],
    ["Serie", clipQuoteField(readString(formData, "series"))],
    ["Especificaciones", clipQuoteNote(readString(formData, "specs"))],
  ] as const;
  for (const [label, value] of extras) {
    if (value) rows.push({ label, value });
  }
  return { rows };
}

function importRows(
  formData: FormData,
):
  | { rows: Array<{ label: string; value: string }> }
  | { error: string } {
  const cargo = readString(formData, "cargo");
  const mode = readString(formData, "mode");
  const transport = readString(formData, "transport");
  if (!isAllowed(cargo, cargoTypes)) {
    return { error: "Elige el tipo de mercancía." };
  }
  if (!isAllowed(mode, importModes)) {
    return { error: "Elige si va completo o cortado." };
  }
  if (!isAllowed(transport, transportTypes)) {
    return { error: "Elige el tipo de transporte." };
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Mercancía", value: cargo },
    { label: "Importación", value: mode },
    { label: "Transporte", value: transport },
  ];
  const extras = [
    ["Marca", clipQuoteField(readString(formData, "brand"))],
    ["Modelo", clipQuoteField(readString(formData, "model"))],
    ["Año", clipQuoteField(readString(formData, "year"), 8)],
    ["Detalle", clipQuoteNote(readString(formData, "note"))],
  ] as const;
  for (const [label, value] of extras) {
    if (value) rows.push({ label, value });
  }
  return { rows };
}

export async function submitQuote(
  formData: FormData,
): Promise<QuoteActionResult> {
  if (readString(formData, "website") || quoteTooFast(readString(formData, "started"))) {
    return { ok: true };
  }

  const channel = readString(formData, "channel") as QuoteChannel | "";
  if (channel !== "pieza" && channel !== "importacion") {
    return { ok: false, error: "No se pudo enviar la cotización." };
  }

  const name = clipQuoteField(readString(formData, "name"));
  const phone = clipQuoteField(readString(formData, "phone"), 24);
  const email = clipQuoteField(readString(formData, "email"));
  const company = clipQuoteField(readString(formData, "company"));
  const contactError = quoteContactError(name, phone, email);
  if (contactError) {
    return { ok: false, error: contactError };
  }

  const ip = await quoteClientIp();
  if (!quoteRateOk(ip, phone)) {
    return {
      ok: false,
      error: "Ya mandaste varias cotizaciones. Espera un rato o escríbenos por WhatsApp.",
    };
  }

  const parsed =
    channel === "pieza" ? piezaRows(formData) : importRows(formData);
  if ("error" in parsed) {
    return { ok: false, error: parsed.error };
  }

  const photos = takePhotos(formData);
  const photoError = validatePhotos(photos);
  if (photoError) return { ok: false, error: photoError };

  const mail = buildQuoteMail({
    channel,
    name,
    phone,
    company,
    email,
    rows: parsed.rows,
    photoCount: photos.length,
  });

  try {
    await sendResendEmail({
      from: quoteFrom(),
      to: quoteInbox(),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: mail.replyTo,
      attachments: await toAttachments(photos),
    });
    return { ok: true };
  } catch (error) {
    console.error("Quote email:", error);
    return {
      ok: false,
      error:
        "No se pudo enviar la cotización. Intenta de nuevo o escríbenos por WhatsApp.",
    };
  }
}

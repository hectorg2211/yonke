import { site } from "@/lib/site";

export type QuoteChannel = "pieza" | "importacion";

export type QuoteMailInput = {
  channel: QuoteChannel;
  name: string;
  phone: string;
  company: string;
  email: string;
  rows: Array<{ label: string; value: string }>;
  photoCount: number;
};

export type QuoteMailAttachment = {
  filename: string;
  content: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function digitsOnly(value: string) {
  return value.replace(/\D/gu, "");
}

export function customerWhatsAppUrl(phone: string) {
  const digits = digitsOnly(phone);
  const e164 =
    digits.length === 10
      ? `52${digits}`
      : digits.startsWith("52")
        ? digits
        : digits;
  if (e164.length < 10) return null;
  return `https://wa.me/${e164}`;
}

export function quoteSubject(input: QuoteMailInput) {
  const kind = input.channel === "pieza" ? "pieza" : "importación";
  const detail =
    input.rows.find((row) => row.label === "Tipo" || row.label === "Mercancía")
      ?.value ?? "";
  return [`Cotización ${kind}`, detail, input.name].filter(Boolean).join(" · ");
}

export function buildQuoteMail(input: QuoteMailInput) {
  const chatUrl = customerWhatsAppUrl(input.phone);
  const title =
    input.channel === "pieza"
      ? "Cotización de pieza"
      : "Cotización de importación";
  const textLines = [
    title,
    "",
    `Nombre: ${input.name}`,
    `WhatsApp: ${input.phone}`,
    input.company ? `Empresa: ${input.company}` : null,
    input.email ? `Correo: ${input.email}` : null,
    "",
    ...input.rows.map((row) => `${row.label}: ${row.value}`),
    "",
    input.photoCount
      ? `Fotos adjuntas: ${input.photoCount}`
      : "Fotos: ninguna",
    chatUrl ? `WhatsApp del cliente: ${chatUrl}` : null,
  ].filter((line): line is string => line !== null);

  const rowHtml = input.rows
    .map(
      (row) =>
        `<tr><td style="padding:8px 0;color:#5c6570;width:38%;">${escapeHtml(row.label)}</td><td style="padding:8px 0;color:#16181d;">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#16181d;">
      <p style="margin:0 0 4px;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;color:#2f6494;">Yonke El Cuñado</p>
      <h1 style="margin:0 0 16px;font-size:28px;">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px;color:#5c6570;">Llegó por la página. Contesta por WhatsApp; el precio no sale automático.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#5c6570;">Nombre</td><td style="padding:8px 0;">${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">WhatsApp</td><td style="padding:8px 0;">${escapeHtml(input.phone)}</td></tr>
        ${input.company ? `<tr><td style="padding:8px 0;color:#5c6570;">Empresa</td><td style="padding:8px 0;">${escapeHtml(input.company)}</td></tr>` : ""}
        ${input.email ? `<tr><td style="padding:8px 0;color:#5c6570;">Correo</td><td style="padding:8px 0;">${escapeHtml(input.email)}</td></tr>` : ""}
        ${rowHtml}
        <tr><td style="padding:8px 0;color:#5c6570;">Fotos</td><td style="padding:8px 0;">${input.photoCount ? `${input.photoCount} adjunta(s)` : "Ninguna"}</td></tr>
      </table>
      ${
        chatUrl
          ? `<p style="margin:22px 0 0;"><a href="${escapeHtml(chatUrl)}" style="display:inline-block;background:#2f6494;color:#fffaf3;text-decoration:none;padding:12px 16px;">Abrir WhatsApp del cliente</a></p>`
          : ""
      }
      <p style="margin:22px 0 0;color:#5c6570;font-size:13px;">${escapeHtml(site.city)} · ${escapeHtml(site.whatsapp)} · ${escapeHtml(site.email)}</p>
    </div>
  `;

  return {
    subject: quoteSubject(input),
    text: textLines.join("\n"),
    html,
    replyTo: input.email || undefined,
  };
}

export function quoteInbox(): string[] {
  const raw = process.env.QUOTE_TO_EMAIL?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [site.email, "yonke.elcunado@gmail.com"];
}

export function quoteFrom() {
  return (
    process.env.QUOTE_FROM_EMAIL?.trim() ||
    `${site.name} <${site.email}>`
  );
}

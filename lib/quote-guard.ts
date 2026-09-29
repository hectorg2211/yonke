import { headers } from "next/headers";

const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60 * 1000;
const PHONE_LIMIT = 3;
const PHONE_WINDOW_MS = 60 * 60 * 1000;
const MIN_FILL_MS = 2500;
const MAX_SHORT = 80;
const MAX_PHONE = 24;
const MAX_NOTE = 1500;
const hits = new Map<string, number[]>();

function prune(key: string, windowMs: number, now: number) {
  const next = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (next.length) hits.set(key, next);
  else hits.delete(key);
  return next;
}

function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = prune(key, windowMs, now);
  if (recent.length >= limit) return false;
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export async function quoteClientIp() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for") ?? list.get("x-real-ip") ?? "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

export function quoteTooFast(started: string) {
  if (!started) return false;
  const from = Number(started);
  if (!Number.isFinite(from) || from <= 0) return true;
  return Date.now() - from < MIN_FILL_MS;
}

export function quoteRateOk(ip: string, phone: string) {
  const digits = phone.replace(/\D/gu, "");
  return (
    allow(`ip:${ip}`, IP_LIMIT, IP_WINDOW_MS) &&
    allow(`tel:${digits || ip}`, PHONE_LIMIT, PHONE_WINDOW_MS)
  );
}

export function clipQuoteField(value: string, max = MAX_SHORT) {
  return value.trim().slice(0, max);
}

export function quoteContactError(name: string, phone: string, email: string) {
  const clippedName = clipQuoteField(name);
  const clippedPhone = clipQuoteField(phone, MAX_PHONE);
  const clippedEmail = clipQuoteField(email);
  if (!clippedName || !clippedPhone) {
    return "Nombre y WhatsApp son obligatorios.";
  }
  const digits = clippedPhone.replace(/\D/gu, "");
  if (digits.length < 10 || digits.length > 13) {
    return "El WhatsApp no se ve completo.";
  }
  if (clippedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(clippedEmail)) {
    return "El correo no se ve bien.";
  }
  return null;
}

export function clipQuoteNote(value: string) {
  return value.trim().slice(0, MAX_NOTE);
}

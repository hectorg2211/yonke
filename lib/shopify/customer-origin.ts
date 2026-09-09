import "server-only";

const CALLBACK_PATH = "/api/auth/shopify/callback";
const LOGOUT_PATH = "/";

export function isPublicHttpsOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      host !== "localhost" &&
      host !== "127.0.0.1" &&
      host !== "[::1]"
    );
  } catch {
    return false;
  }
}

export function requestOrigin(request: Request, configured: string | null): string {
  if (configured) return configured;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? request.headers.get("host");
  if (host) {
    const proto = forwardedProto ?? new URL(request.url).protocol.replace(":", "");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
}

export function callbackUrl(origin: string): string {
  return `${origin}${CALLBACK_PATH}`;
}

export function logoutRedirectUrl(origin: string): string {
  return `${origin}${LOGOUT_PATH}`;
}

export function safeReturnTo(value: string | null | undefined): string {
  if (!value) return "/cuenta";
  if (!value.startsWith("/")) return "/cuenta";
  if (value.startsWith("//") || value.startsWith("/\\")) return "/cuenta";
  if (value.startsWith("/api/")) return "/cuenta";
  return value;
}

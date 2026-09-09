import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { discoverOpenId } from "@/lib/shopify/customer-discovery";
import { getCustomerAccountEnv } from "@/lib/shopify/env";

export const ACCESS_COOKIE = "yonke_ca_at";
export const REFRESH_COOKIE = "yonke_ca_rt";
export const ID_TOKEN_COOKIE = "yonke_ca_idt";
export const EXPIRES_COOKIE = "yonke_ca_exp";
export const STATE_COOKIE = "yonke_ca_state";
export const VERIFIER_COOKIE = "yonke_ca_verifier";
export const NONCE_COOKIE = "yonke_ca_nonce";
export const RETURN_COOKIE = "yonke_ca_return";

export type CustomerTokens = {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresAt: number;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const OAUTH_MAX_AGE = 60 * 10;
const EXPIRY_BUFFER_MS = 60_000;

function cookieBase(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function readCookie(
  jar: Awaited<ReturnType<typeof cookies>>,
  name: string,
): string | null {
  const value = jar.get(name)?.value;
  return value ? decodeURIComponent(value) : null;
}

export async function isCustomerSignedIn(): Promise<boolean> {
  const jar = await cookies();
  return Boolean(readCookie(jar, ACCESS_COOKIE) || readCookie(jar, REFRESH_COOKIE));
}

export async function readCustomerTokens(): Promise<CustomerTokens | null> {
  const jar = await cookies();
  const accessToken = readCookie(jar, ACCESS_COOKIE);
  if (!accessToken) return null;

  const expiresRaw = readCookie(jar, EXPIRES_COOKIE);
  const expiresAt = expiresRaw ? Number(expiresRaw) : 0;

  return {
    accessToken,
    refreshToken: readCookie(jar, REFRESH_COOKIE),
    idToken: readCookie(jar, ID_TOKEN_COOKIE),
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
  };
}

export async function readOAuthCookies(): Promise<{
  state: string | null;
  verifier: string | null;
  nonce: string | null;
  returnTo: string | null;
}> {
  const jar = await cookies();
  return {
    state: readCookie(jar, STATE_COOKIE),
    verifier: readCookie(jar, VERIFIER_COOKIE),
    nonce: readCookie(jar, NONCE_COOKIE),
    returnTo: readCookie(jar, RETURN_COOKIE),
  };
}

export function applyCustomerTokens(
  response: NextResponse,
  tokens: CustomerTokens,
): void {
  const options = cookieBase(SESSION_MAX_AGE);
  response.cookies.set(ACCESS_COOKIE, encodeURIComponent(tokens.accessToken), options);
  if (tokens.refreshToken) {
    response.cookies.set(
      REFRESH_COOKIE,
      encodeURIComponent(tokens.refreshToken),
      options,
    );
  }
  if (tokens.idToken) {
    response.cookies.set(ID_TOKEN_COOKIE, encodeURIComponent(tokens.idToken), options);
  }
  response.cookies.set(
    EXPIRES_COOKIE,
    encodeURIComponent(String(tokens.expiresAt)),
    options,
  );
}

export function applyOAuthCookies(
  response: NextResponse,
  values: {
    state: string;
    verifier: string;
    nonce: string;
    returnTo: string;
  },
): void {
  const options = cookieBase(OAUTH_MAX_AGE);
  response.cookies.set(STATE_COOKIE, encodeURIComponent(values.state), options);
  response.cookies.set(VERIFIER_COOKIE, encodeURIComponent(values.verifier), options);
  response.cookies.set(NONCE_COOKIE, encodeURIComponent(values.nonce), options);
  response.cookies.set(RETURN_COOKIE, encodeURIComponent(values.returnTo), options);
}

export function clearOAuthCookies(response: NextResponse): void {
  for (const name of [STATE_COOKIE, VERIFIER_COOKIE, NONCE_COOKIE, RETURN_COOKIE]) {
    response.cookies.delete(name);
  }
}

export function clearCustomerSession(response: NextResponse): void {
  for (const name of [
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    ID_TOKEN_COOKIE,
    EXPIRES_COOKIE,
    STATE_COOKIE,
    VERIFIER_COOKIE,
    NONCE_COOKIE,
    RETURN_COOKIE,
  ]) {
    response.cookies.delete(name);
  }
}

function basicAuth(clientId: string, clientSecret: string): string {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

async function tokenRequest(
  tokenEndpoint: string,
  body: URLSearchParams,
  origin: string,
  clientId: string,
  clientSecret: string | null,
): Promise<CustomerTokens> {
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Origin: origin,
    "User-Agent": "YonkeStorefront/1.0",
  };

  if (clientSecret) {
    headers.Authorization = `Basic ${basicAuth(clientId, clientSecret)}`;
  }

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  const payload = (await response.json()) as TokenResponse;
  if (!response.ok || !payload.access_token) {
    const detail = payload.error_description || payload.error || String(response.status);
    throw new Error(`Shopify token: ${detail}`);
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token ?? null,
    idToken: payload.id_token ?? null,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };
}

export async function exchangeAuthorizationCode(args: {
  code: string;
  redirectUri: string;
  verifier: string;
  origin: string;
}): Promise<CustomerTokens> {
  const env = getCustomerAccountEnv();
  if (!env.ok) {
    throw new Error("Customer Account API no está configurada.");
  }

  const openId = await discoverOpenId(env.config.domain);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.config.clientId,
    redirect_uri: args.redirectUri,
    code: args.code,
    code_verifier: args.verifier,
  });

  return tokenRequest(
    openId.token_endpoint,
    body,
    args.origin,
    env.config.clientId,
    env.config.clientSecret,
  );
}

export async function refreshCustomerTokens(
  refreshToken: string,
  origin: string,
): Promise<CustomerTokens> {
  const env = getCustomerAccountEnv();
  if (!env.ok) {
    throw new Error("Customer Account API no está configurada.");
  }

  const openId = await discoverOpenId(env.config.domain);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: env.config.clientId,
    refresh_token: refreshToken,
  });

  const tokens = await tokenRequest(
    openId.token_endpoint,
    body,
    origin,
    env.config.clientId,
    env.config.clientSecret,
  );

  return {
    ...tokens,
    refreshToken: tokens.refreshToken ?? refreshToken,
  };
}

export async function getCustomerAccessToken(
  origin?: string,
): Promise<string | null> {
  const current = await readCustomerTokens();
  if (!current) return null;

  if (current.expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return current.accessToken;
  }

  if (!current.refreshToken) return current.accessToken;

  const env = getCustomerAccountEnv();
  if (!env.ok) return current.accessToken;

  try {
    const refreshed = await refreshCustomerTokens(
      current.refreshToken,
      origin ?? env.config.origin ?? `https://${env.config.domain}`,
    );
    try {
      const jar = await cookies();
      const options = cookieBase(SESSION_MAX_AGE);
      jar.set(ACCESS_COOKIE, encodeURIComponent(refreshed.accessToken), options);
      if (refreshed.refreshToken) {
        jar.set(REFRESH_COOKIE, encodeURIComponent(refreshed.refreshToken), options);
      }
      if (refreshed.idToken) {
        jar.set(ID_TOKEN_COOKIE, encodeURIComponent(refreshed.idToken), options);
      }
      jar.set(EXPIRES_COOKIE, encodeURIComponent(String(refreshed.expiresAt)), options);
    } catch {
      // Server Components cannot persist cookies; the fresh token still
      // works for this request. Server Actions / Route Handlers persist it.
    }
    return refreshed.accessToken;
  } catch (error) {
    console.error("Shopify customer refresh:", error);
    return current.accessToken;
  }
}

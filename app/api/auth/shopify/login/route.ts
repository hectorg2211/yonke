import { NextResponse } from "next/server";
import { discoverOpenId } from "@/lib/shopify/customer-discovery";
import {
  callbackUrl,
  isPublicHttpsOrigin,
  requestOrigin,
  safeReturnTo,
} from "@/lib/shopify/customer-origin";
import { codeChallenge, randomUrlSafe } from "@/lib/shopify/customer-pkce";
import { applyOAuthCookies } from "@/lib/shopify/customer-session";
import { getCustomerAccountEnv } from "@/lib/shopify/env";

export const dynamic = "force-dynamic";

const AUTH_SCOPE = "openid email customer-account-api:full";

export async function GET(request: Request) {
  const env = getCustomerAccountEnv();
  if (!env.ok) {
    return NextResponse.redirect(new URL("/cuenta?error=config", request.url));
  }

  const requestUrl = new URL(request.url);
  const origin = requestOrigin(request, env.config.origin);
  if (!isPublicHttpsOrigin(origin)) {
    return NextResponse.redirect(new URL("/cuenta?error=https", request.url));
  }

  const openId = await discoverOpenId(env.config.domain);
  const state = randomUrlSafe(16);
  const nonce = randomUrlSafe(16);
  const verifier = randomUrlSafe(32);
  const returnTo = safeReturnTo(requestUrl.searchParams.get("returnTo"));
  const redirectUri = callbackUrl(origin);

  const authorize = new URL(openId.authorization_endpoint);
  authorize.searchParams.set("scope", AUTH_SCOPE);
  authorize.searchParams.set("client_id", env.config.clientId);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("nonce", nonce);
  authorize.searchParams.set("code_challenge", codeChallenge(verifier));
  authorize.searchParams.set("code_challenge_method", "S256");
  authorize.searchParams.set("locale", "es");
  authorize.searchParams.set("region_country", "MX");

  const response = NextResponse.redirect(authorize);
  applyOAuthCookies(response, { state, verifier, nonce, returnTo });
  return response;
}

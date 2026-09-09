import { NextResponse } from "next/server";
import { discoverOpenId } from "@/lib/shopify/customer-discovery";
import {
  logoutRedirectUrl,
  requestOrigin,
} from "@/lib/shopify/customer-origin";
import {
  clearCustomerSession,
  readCustomerTokens,
} from "@/lib/shopify/customer-session";
import { getCustomerAccountEnv } from "@/lib/shopify/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const env = getCustomerAccountEnv();
  const origin = requestOrigin(request, env.ok ? env.config.origin : null);
  const home = NextResponse.redirect(new URL("/", origin));
  const tokens = await readCustomerTokens();
  clearCustomerSession(home);

  if (!env.ok || !tokens?.idToken) {
    return home;
  }

  try {
    const openId = await discoverOpenId(env.config.domain);
    const logout = new URL(openId.end_session_endpoint);
    logout.searchParams.set("id_token_hint", tokens.idToken);
    logout.searchParams.set("post_logout_redirect_uri", logoutRedirectUrl(origin));
    const response = NextResponse.redirect(logout);
    clearCustomerSession(response);
    return response;
  } catch (error) {
    console.error("Shopify customer logout:", error);
    return home;
  }
}

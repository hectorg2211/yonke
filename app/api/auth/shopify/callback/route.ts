import { NextResponse } from "next/server";
import { updateCartBuyerIdentity } from "@/lib/shopify/cart";
import { CART_COOKIE, cartCookieOptions, readCartId } from "@/lib/shopify/cart-cookie";
import {
  callbackUrl,
  isPublicHttpsOrigin,
  requestOrigin,
  safeReturnTo,
} from "@/lib/shopify/customer-origin";
import { decodeJwtPayload } from "@/lib/shopify/customer-pkce";
import {
  applyCustomerTokens,
  clearOAuthCookies,
  exchangeAuthorizationCode,
  readOAuthCookies,
} from "@/lib/shopify/customer-session";
import { getCustomerAccountEnv } from "@/lib/shopify/env";

export const dynamic = "force-dynamic";

function fail(request: Request, code: string): NextResponse {
  const response = NextResponse.redirect(new URL(`/cuenta?error=${code}`, request.url));
  clearOAuthCookies(response);
  return response;
}

export async function GET(request: Request) {
  const env = getCustomerAccountEnv();
  if (!env.ok) return fail(request, "config");

  const origin = requestOrigin(request, env.config.origin);
  if (!isPublicHttpsOrigin(origin)) return fail(request, "https");

  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) return fail(request, "login");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return fail(request, "login");

  const oauth = await readOAuthCookies();
  if (!oauth.state || oauth.state !== state || !oauth.verifier) {
    return fail(request, "login");
  }

  try {
    const tokens = await exchangeAuthorizationCode({
      code,
      redirectUri: callbackUrl(origin),
      verifier: oauth.verifier,
      origin,
    });

    if (oauth.nonce && tokens.idToken) {
      const payload = decodeJwtPayload(tokens.idToken);
      if (payload.nonce !== oauth.nonce) {
        return fail(request, "login");
      }
    }

    const returnTo = safeReturnTo(oauth.returnTo);
    const response = NextResponse.redirect(new URL(returnTo, origin));
    applyCustomerTokens(response, tokens);
    clearOAuthCookies(response);

    const cartId = await readCartId();
    if (cartId) {
      try {
        const cart = await updateCartBuyerIdentity(cartId, tokens.accessToken);
        response.cookies.set(
          CART_COOKIE,
          encodeURIComponent(cart.id),
          cartCookieOptions,
        );
      } catch (cartError) {
        console.error("Shopify cart buyer identity:", cartError);
      }
    }

    return response;
  } catch (authError) {
    console.error("Shopify customer login:", authError);
    return fail(request, "login");
  }
}

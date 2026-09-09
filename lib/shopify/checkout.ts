export function withSilentSso(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("sso", "silent");
    return url.toString();
  } catch {
    const join = checkoutUrl.includes("?") ? "&" : "?";
    return `${checkoutUrl}${join}sso=silent`;
  }
}

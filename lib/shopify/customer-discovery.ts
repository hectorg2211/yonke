import "server-only";

export type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  issuer: string;
};

export type CustomerApiConfig = {
  graphql_api: string;
};

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`No se pudo leer ${url} (${response.status}).`);
  }

  return (await response.json()) as T;
}

export async function discoverOpenId(domain: string): Promise<OpenIdConfig> {
  return getJson<OpenIdConfig>(
    `https://${domain}/.well-known/openid-configuration`,
  );
}

export async function discoverCustomerApi(domain: string): Promise<CustomerApiConfig> {
  return getJson<CustomerApiConfig>(
    `https://${domain}/.well-known/customer-account-api`,
  );
}

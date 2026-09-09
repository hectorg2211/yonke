export type ShopifyConnectionStatus =
  | {
      ok: true;
      configured: true;
      shopName: string;
      domain: string;
      host: string | null;
      apiVersion: string;
    }
  | {
      ok: false;
      configured: boolean;
      missing: string[];
      error: string;
      domain: string | null;
      apiVersion: string;
    };

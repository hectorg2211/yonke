import { WhatsappMark } from "@/components/whatsapp-fab";
import { productPath, site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

export const quotePriceLabel = "Precio a cotizar";

function quoteMessage(
  name: string,
  sku: string | null | undefined,
  handle: string,
  url: string,
) {
  const code = sku?.trim();
  // A blank Shopify SKU is stored as the product handle. That is not a SKU.
  const skuPart = code && code !== handle ? ` (SKU: ${code})` : "";
  const title = name.trim().replace(/\.+$/u, "");
  return `Hola, me interesa cotizar esta pieza: ${title}${skuPart}. ${url}`;
}

export function WhatsappQuoteButton({
  name,
  sku,
  handle,
  block = false,
}: {
  name: string;
  sku?: string | null;
  handle: string;
  block?: boolean;
}) {
  const url = `${siteUrl()}${productPath(handle)}`;
  const href = `https://wa.me/${site.whatsappE164}?text=${encodeURIComponent(
    quoteMessage(name, sku, handle, url),
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Cotizar ${name} por WhatsApp`}
      className={`stamp inline-flex items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] px-6 py-3 text-[12px] text-white hover:bg-[#1DA851] ${
        block ? "w-full" : "w-full sm:w-auto sm:self-start"
      }`}
    >
      <WhatsappMark className="size-4 shrink-0" />
      Cotizar por WhatsApp
    </a>
  );
}

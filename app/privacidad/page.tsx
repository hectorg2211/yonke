import type { Metadata } from "next";
import { getPrivacyPolicy } from "@/lib/shopify/policies";
import { ShopifyConfigError } from "@/lib/shopify/storefront";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad de Yonke El Cuñado: cómo se trata la información personal en esta tienda.",
};

export default async function PrivacidadPage() {
  let policy = null;
  let loadError: string | null = null;

  try {
    policy = await getPrivacyPolicy();
  } catch (error) {
    console.error("Shopify privacy policy:", error);
    loadError =
      error instanceof ShopifyConfigError
        ? "La política de privacidad no está disponible."
        : "No se pudo cargar el aviso de privacidad. Intenta más tarde.";
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-16">
      <p className="stamp text-[11px] text-rust">Legal</p>
      <h1 className="display mt-3 text-7xl text-cream md:text-8xl">
        Aviso de privacidad
      </h1>

      {loadError ? (
        <p className="mt-8 border border-rust/40 bg-oxide px-4 py-3 text-sm text-ink">
          {loadError}
        </p>
      ) : policy ? (
        <article
          className="shop-policy mt-10"
          dangerouslySetInnerHTML={{ __html: policy.html }}
        />
      ) : (
        <p className="mt-8 text-steel">
          El aviso de privacidad todavía no está publicado en Shopify.
        </p>
      )}
    </div>
  );
}

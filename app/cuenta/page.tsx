import type { Metadata } from "next";
import Link from "next/link";
import { getCustomerAccount } from "@/lib/shopify/customer-account";
import { isCustomerSignedIn } from "@/lib/shopify/customer-session";
import { isCustomerAccountConfigured } from "@/lib/shopify/env";

export const metadata: Metadata = {
  title: "Cuenta",
  description: "Pedidos, dirección y sesión de cliente en Yonke El Cuñado.",
};

const ERRORS: Record<string, string> = {
  config: "La cuenta no está disponible. Intenta más tarde.",
  https: "No se pudo iniciar sesión. Intenta de nuevo.",
  login: "No se pudo iniciar sesión. Intenta de nuevo.",
};

const FINANCIAL: Record<string, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  AUTHORIZED: "Autorizado",
  PARTIALLY_PAID: "Pago parcial",
  PARTIALLY_REFUNDED: "Reembolso parcial",
  REFUNDED: "Reembolsado",
  VOIDED: "Anulado",
  EXPIRED: "Vencido",
};

const FULFILLMENT: Record<string, string> = {
  FULFILLED: "Enviado",
  UNFULFILLED: "Sin enviar",
  PARTIALLY_FULFILLED: "Parcial",
  IN_PROGRESS: "En proceso",
  ON_HOLD: "En espera",
  SCHEDULED: "Programado",
  RESTOCKED: "Reingresado",
};

function label(map: Record<string, string>, value: string | null): string {
  if (!value) return "—";
  return map[value] ?? value.replace(/_/g, " ").toLowerCase();
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(date);
}

export default async function CuentaPage({
  searchParams,
}: PageProps<"/cuenta">) {
  const params = await searchParams;
  const errorCode = typeof params.error === "string" ? params.error : null;
  const error = errorCode ? (ERRORS[errorCode] ?? ERRORS.login) : null;
  const configured = isCustomerAccountConfigured();
  const signedIn = configured ? await isCustomerSignedIn() : false;

  let customer = null;
  let loadError: string | null = null;
  if (signedIn) {
    try {
      customer = await getCustomerAccount();
    } catch (accountError) {
      console.error("Shopify customer account:", accountError);
      loadError = "No se pudo cargar la cuenta. Vuelve a iniciar sesión.";
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
      <p className="stamp text-[11px] text-amber">Cliente</p>
      <h1 className="display mt-3 text-7xl text-cream md:text-9xl">Cuenta</h1>
      <p className="mt-4 max-w-xl text-steel">
        Pedidos, datos de envío y sesión del cliente.
      </p>

      {error ? (
        <p className="mt-6 border border-rust/40 bg-oxide/20 px-4 py-3 text-sm text-amber">
          {error}
        </p>
      ) : null}

      {loadError ? (
        <p className="mt-6 border border-rust/40 bg-oxide/20 px-4 py-3 text-sm text-amber">
          {loadError}
        </p>
      ) : null}

      {!configured ? (
        <div className="mt-10 border border-line bg-asphalt px-5 py-8">
          <p className="stamp text-[10px] text-amber">Cliente</p>
          <p className="mt-3 text-cream">La cuenta no está disponible.</p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-steel">
            Puedes seguir cotizando por WhatsApp o revisar el inventario.
          </p>
        </div>
      ) : null}

      {configured && !customer ? (
        <div className="mt-10 border border-line bg-asphalt px-5 py-8">
          <p className="stamp text-[10px] text-amber">Cliente</p>
          <p className="mt-3 text-cream">
            Entra con tu cuenta para ver pedidos y datos de envío.
          </p>
          <a
            href="/api/auth/shopify/login?returnTo=/cuenta"
            className="stamp mt-6 inline-flex border border-amber bg-amber px-5 py-3 text-[12px] text-oil hover:bg-cream"
          >
            Iniciar sesión
          </a>
        </div>
      ) : null}

      {customer ? (
        <div className="mt-10 grid gap-8">
          <section className="grid gap-6 border border-line bg-asphalt p-5 md:grid-cols-2">
            <div>
              <p className="stamp text-[10px] text-steel">Cliente</p>
              <p className="display mt-3 text-5xl text-cream">
                {customer.displayName}
              </p>
              {customer.email ? (
                <p className="mt-2 text-sm text-steel">{customer.email}</p>
              ) : null}
            </div>
            <div>
              <p className="stamp text-[10px] text-steel">Envío</p>
              {customer.addressLines.length > 0 ? (
                <p className="mt-3 text-sm leading-6 text-cream">
                  {customer.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ) : (
                <p className="mt-3 text-sm text-steel">
                  Sin dirección guardada. Se puede agregar en el checkout.
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <a
                href="/api/auth/shopify/logout"
                className="stamp border border-line px-4 py-2 text-[11px] text-cream hover:border-amber hover:text-amber"
              >
                Cerrar sesión
              </a>
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="stamp text-[10px] text-amber">Historial</p>
                <h2 className="display mt-2 text-5xl text-cream">Pedidos</h2>
              </div>
              <Link
                href="/inventario"
                className="stamp text-[11px] text-steel underline decoration-rust underline-offset-4 hover:text-amber"
              >
                Seguir viendo inventario
              </Link>
            </div>

            {customer.orders.length === 0 ? (
              <p className="mt-6 border border-line bg-asphalt px-5 py-8 text-sm text-steel">
                Todavía no hay pedidos en esta cuenta.
              </p>
            ) : (
              <ul className="mt-6 grid gap-3">
                {customer.orders.map((order) => (
                  <li
                    key={order.id}
                    className="grid gap-3 border border-line bg-asphalt px-4 py-4 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="display text-4xl text-cream">{order.name}</p>
                      <p className="mt-2 text-sm text-steel">
                        {formatDate(order.processedAt)} ·{" "}
                        {label(FINANCIAL, order.financialStatus)} ·{" "}
                        {label(FULFILLMENT, order.fulfillmentStatus)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <p className="text-amber">{order.total}</p>
                      {order.statusPageUrl ? (
                        <a
                          href={order.statusPageUrl}
                          className="stamp text-[10px] text-cream underline decoration-rust underline-offset-4 hover:text-amber"
                        >
                          Ver pedido
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}

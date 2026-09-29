import {
  facturaCopyAfterPay,
  facturaCopyWhenYouPay,
  facturaWhatsAppUrl,
} from "@/lib/factura";

export function FacturaNote({
  when = "after",
  orderName,
  className = "",
}: {
  when?: "after" | "when";
  orderName?: string;
  className?: string;
}) {
  const copy = when === "when" ? facturaCopyWhenYouPay : facturaCopyAfterPay;
  return (
    <p className={`text-sm leading-6 text-steel ${className}`.trim()}>
      {copy}{" "}
      <a
        href={facturaWhatsAppUrl(orderName)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cream underline decoration-rust underline-offset-4 hover:text-rust"
      >
        Abrir WhatsApp
      </a>
    </p>
  );
}

export function FacturaOrderLink({
  orderName,
  className = "",
}: {
  orderName: string;
  className?: string;
}) {
  return (
    <a
      href={facturaWhatsAppUrl(orderName)}
      target="_blank"
      rel="noopener noreferrer"
      className={`stamp text-[10px] text-cream underline decoration-rust underline-offset-4 hover:text-rust ${className}`.trim()}
    >
      Pedir factura
    </a>
  );
}

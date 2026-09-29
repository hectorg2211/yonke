import { whatsappUrl } from "@/lib/site";

export const facturaCopyAfterPay =
  "¿Factura? Después de pagar, mándanos por WhatsApp tu Constancia de Situación Fiscal (PDF) y el número de pedido.";

export const facturaCopyWhenYouPay = "Sí facturamos.";

export function facturaWhatsAppMessage(orderName?: string) {
  if (orderName) {
    return `Hola, ya pagué el pedido ${orderName}. Te mando mi Constancia de Situación Fiscal (PDF) para factura.`;
  }
  return "Hola, ya pagué. Te mando mi Constancia de Situación Fiscal (PDF) para factura. El número de pedido es:";
}

export function facturaWhatsAppUrl(orderName?: string) {
  return whatsappUrl(facturaWhatsAppMessage(orderName));
}

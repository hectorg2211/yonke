export const site = {
  name: "Yonke El Cuñado",
  shortName: "El Cuñado",
  tagline: "Venta de partes para tractocamión",
  city: "Tijuana",
  phoneLabel: "WhatsApp del patio",
  email: "yonke.elcunado@gmail.com",
  whatsapp: "664 415 9482",
  whatsappE164: "526644159482",
};

export function whatsappUrl(message?: string) {
  const url = new URL(`https://wa.me/${site.whatsappE164}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}

export function mapsPinUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=es`;
}

export function mapsEmbedUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=es&output=embed`;
}

export function mapsDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export const sites = [
  {
    id: "principal",
    label: "Yonke principal",
    lat: 32.5454241,
    lng: -116.9483476,
  },
  {
    id: "secundario",
    label: "Yonke secundario",
    lat: 32.545101165771484,
    lng: -116.9496841430664,
  },
  {
    id: "taller",
    label: "Taller mecánico",
    lat: 32.5450363,
    lng: -116.9492893,
  },
] as const;

export type YardSite = (typeof sites)[number];

export const location = {
  street: "Aeropuerto 1008",
  neighborhood: "Garita de Otay",
  district: "Mesa de Otay",
  city: "Tijuana",
  state: "B.C.",
  postal: "22430",
  lat: sites[0].lat,
  lng: sites[0].lng,
  mapsUrl: mapsPinUrl(sites[0].lat, sites[0].lng),
  directionsUrl: mapsDirectionsUrl(sites[0].lat, sites[0].lng),
};

export const nav = [
  { href: "/", label: "Patio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/importaciones", label: "Cotizar" },
  { href: "/#ubicacion", label: "Ubicación" },
] as const;

export const partFamilies = [
  {
    code: "01",
    title: "Cabina",
    copy: "Cabinas, camarotes, rompevientos y piezas de la caseta.",
  },
  {
    code: "02",
    title: "Motor",
    copy: "Motores, transmisiones, radiadores y lo que mueve el tracto.",
  },
  {
    code: "03",
    title: "Carrocería",
    copy: "Espejos, defensas, focos y lámina de tractocamión.",
  },
  {
    code: "04",
    title: "Tren",
    copy: "Ejes, diferenciales, muelles y rines para la unidad.",
  },
];

export type CatalogItem = {
  handle: string;
  sku: string;
  name: string;
  category: string;
  price: string;
  priceAmount: number | null;
  note: string;
  image: string;
  imageAlt: string;
  condition: string;
  origin: string;
  stock: string;
  fit: string;
  details: string;
  variantId: string | null;
  availableForSale: boolean;
};

const mockCatalog: Omit<
  CatalogItem,
  "handle" | "variantId" | "availableForSale"
>[] = [
  {
    sku: "YC-CAB-05",
    name: "Cabina completa",
    category: "Cabina",
    price: "Desde 1,500 USD",
    priceAmount: 1500,
    note: "Pieza de tractocamión. Precio según año",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Tractocamión estacionado en patio",
    condition: "Usada de patio",
    origin: "Patio Otay",
    stock: "En piso · a cotizar año",
    fit: "Tractocamión, según año de cabina",
    details:
      "Cabina de tractocamión para cambio en patio. El precio parte de 1,500 USD y se ajusta con el año. No incluye instalación: solo la pieza.",
  },
  {
    sku: "YC-MTR-12",
    name: "Motor diésel",
    category: "Motor",
    price: "A cotizar",
    priceAmount: null,
    note: "De patio o por importación, según existencia",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Motor de tractocamión",
    condition: "Usado / a traer",
    origin: "Patio o importación",
    stock: "Según existencia",
    fit: "Diésel de tractocamión, año y modelo a confirmar",
    details:
      "Motor para tractocamión. Si no está en piso, se cotiza por año. El yonke vende la pieza; el cliente la lleva o pide envío.",
  },
  {
    sku: "YC-ESP-08",
    name: "Espejo lateral",
    category: "Carrocería",
    price: "Consultar",
    priceAmount: null,
    note: "Pieza de movimiento diario",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Tractocamión visto de costado",
    condition: "Usada de patio",
    origin: "Patio Otay",
    stock: "Alta rotación",
    fit: "Lateral de tractocamión",
    details:
      "Espejo de costado, de los que se van todos los días. Pregunta si le queda a tu unidad antes de pedir el envío.",
  },
  {
    sku: "YC-FOC-03",
    name: "Juego de focos",
    category: "Eléctrico",
    price: "Consultar",
    priceAmount: null,
    note: "Uno de los tipos de alta rotación",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Piezas y refacciones en el yonke",
    condition: "Usada de patio",
    origin: "Patio Otay",
    stock: "En piso",
    fit: "Iluminación de tractocamión",
    details:
      "Juego de focos de tractocamión. Pieza chica, de las ~100 que más se piden. Se manda a toda la República.",
  },
  {
    sku: "YC-TRN-21",
    name: "Transmisión",
    category: "Tren",
    price: "A cotizar",
    priceAmount: null,
    note: "Caja para tractocamión, según año y modelo",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Patio industrial de refacciones",
    condition: "Usada / a cotizar",
    origin: "Patio o importación",
    stock: "A confirmar",
    fit: "Caja de tractocamión, año y velocidad a confirmar",
    details:
      "Transmisión para tractocamión. Hay que cruzar año y tipo de caja. Sin mecánica: se vende la pieza como sale del patio.",
  },
  {
    sku: "YC-DIF-01",
    name: "Diferencial",
    category: "Tren",
    price: "A cotizar",
    priceAmount: null,
    note: "Pieza de tren motriz, no unidad completa",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Fila de tractocamiones en patio",
    condition: "Usada de patio",
    origin: "Patio Otay",
    stock: "A cotizar",
    fit: "Tren motriz de tractocamión",
    details:
      "Diferencial de tractocamión. No se vende la unidad completa: solo esta pieza del tren. El año define si hay compatibilidad.",
  },
];

export const catalog: CatalogItem[] = mockCatalog.map((item) => ({
  ...item,
  handle: item.sku.toLowerCase(),
  variantId: null,
  availableForSale: true,
}));

export const categories = [
  "Todos",
  "Cabina",
  "Motor",
  "Eléctrico",
  "Carrocería",
  "Tren",
] as const;

export function productSlug(sku: string) {
  return sku.toLowerCase();
}

export function productPath(handle: string) {
  return `/inventario/${handle}`;
}

export function getProductBySlug(slug: string) {
  const key = slug.toLowerCase();
  return catalog.find(
    (item) => item.handle === key || productSlug(item.sku) === key,
  );
}

export const site = {
  name: "Yonke El Cuñado",
  shortName: "El Cuñado",
  tagline: "Venta de partes para tractocamión",
  city: "Tijuana",
  phoneLabel: "WhatsApp del patio",
  email: "yonke.elcunado@gmail.com",
};

export const location = {
  street: "Aeropuerto 1008",
  neighborhood: "Garita de Otay",
  district: "Mesa de Otay",
  city: "Tijuana",
  state: "B.C.",
  postal: "22430",
  lat: 32.5454357,
  lng: -116.9483628,
  mapsUrl:
    "https://www.google.com/maps/place/Yonke+El+Cu%C3%B1ado+Tractocamiones/@32.5454357,-116.9483628,17z",
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354!2d-116.9483628!3d32.5454357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94743bb2abcd1%3A0xb9390de088c54aa9!2sYonke%20El%20Cu%C3%B1ado%20Tractocamiones!5e0!3m2!1ses-419!2smx!4v1",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=32.5454357,-116.9483628",
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
      "Cabina de tractocamión para cambio en patio. El precio de vitrina parte de 1,500 USD y se ajusta con el año. No incluye instalación: solo la pieza.",
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

import type { Metadata, Viewport } from "next";
import { Barlow, Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { getCart } from "@/app/actions/cart";
import { isCustomerSignedIn } from "@/lib/shopify/customer-session";
import { isCustomerAccountConfigured } from "@/lib/shopify/env";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101319",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Yonke El Cuñado en Garita de Otay, Tijuana: venta de partes para tractocamión. Catálogo y envíos a toda la República.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const accountEnabled = isCustomerAccountConfigured();
  const [cart, signedIn] = await Promise.all([
    getCart(),
    accountEnabled ? isCustomerSignedIn() : Promise.resolve(false),
  ]);

  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full w-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="grain flex min-h-full w-full flex-col bg-oil text-cream"
        suppressHydrationWarning
      >
        <CartProvider initialCart={cart}>
          <Header account={{ enabled: accountEnabled, signedIn }} />
          <main className="w-full flex-1">{children}</main>
          <Footer />
          <WhatsappFab />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

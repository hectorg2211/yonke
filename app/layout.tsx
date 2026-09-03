import type { Metadata, Viewport } from "next";
import { Big_Shoulders_Stencil, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { site } from "@/lib/site";
import "./globals.css";

const display = Big_Shoulders_Stencil({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  themeColor: "#0c0b09",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col bg-oil text-cream">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsappFab />
      </body>
    </html>
  );
}

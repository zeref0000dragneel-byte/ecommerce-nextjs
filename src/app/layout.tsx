import type { Metadata } from "next";
import { Inter, Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ONSET – Tu estilo, tu inicio",
    template: "%s | ONSET",
  },
  description: "E-commerce juvenil. Ropa, accesorios y más. Envío rápido. ONSET – energía, inicio, impacto.",
  keywords: ["ONSET", "tienda", "ecommerce", "juvenil", "urbano", "moda", "compras online"],
  authors: [{ name: "ONSET" }],
  icons: {
    icon: "/Fabicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://onset.com",
    siteName: "ONSET",
    title: "ONSET – Tu estilo, tu inicio",
    description: "E-commerce juvenil. Energía, inicio, impacto.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

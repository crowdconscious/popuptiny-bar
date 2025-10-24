import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Popup Tiny Bar | Cocktails de Autor en Lata para tu Evento",
  description: "Bar móvil premium con cocktails artesanales en lata personalizada. Servicio de barra para bodas, eventos corporativos y fiestas en México.",
  keywords: ["bar móvil", "cocktails en lata", "bar para bodas", "eventos corporativos México", "cocktails personalizados"],
  authors: [{ name: "Popup Tiny Bar" }],
  openGraph: {
    title: "Popup Tiny Bar | Cocktails de Autor en Lata",
    description: "Bar móvil premium para eventos inolvidables",
    type: "website",
    locale: "es_MX",
    url: "https://popuptinybar.com",
    siteName: "Popup Tiny Bar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popup Tiny Bar | Cocktails de Autor en Lata",
    description: "Bar móvil premium para eventos inolvidables",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${bebas.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

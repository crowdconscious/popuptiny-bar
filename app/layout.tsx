import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
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
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

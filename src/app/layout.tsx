import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LENS — Hiper-Produtividade Neuro-Orientada",
  description: "Rastreie seus hábitos, domine seu tempo, eleve seu nível. A rede neural para sua melhor versão.",
  openGraph: {
    title: "LENS — Hiper-Produtividade Neuro-Orientada",
    description: "Domine sua rotina com o poder da neurociência e gamificação.",
    url: "https://lens.app",
    siteName: "LENS",
    images: [
      {
        url: "https://lens.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LENS — Hiper-Produtividade",
    description: "Eleve seu nível com LENS.",
    images: ["https://lens.app/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased selection:bg-purple/30">
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#F8F8F8",
              border: "1px solid #1A1A1A",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#A855F7", secondary: "#050505" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#050505" },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}

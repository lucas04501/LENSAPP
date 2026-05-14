import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LENS — Hiper-Produtividade Neuro-Orientada",
  description: "Rastreie seus hábitos, domine seu tempo, eleve seu nível.",
};

export const viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased">
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
      </body>
    </html>
  );
}

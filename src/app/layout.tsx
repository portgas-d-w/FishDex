import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNavV2 } from "@/components/BottomNavV2";
import { ConditionalHeader } from "@/components/ConditionalHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FishDex — Ton journal de pêche",
  description: "Identifie, collectionne et retrace toutes tes prises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ConditionalHeader header={<Header />} />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <BottomNavV2 />
      </body>
    </html>
  );
}

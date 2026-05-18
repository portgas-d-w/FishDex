import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { BottomNavV2 } from "@/components/BottomNavV2";

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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo/favicon.svg",  type: "image/svg+xml" },
      { url: "/logo/icon-32.png",  sizes: "32x32",   type: "image/png" },
      { url: "/logo/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/logo/icon-180.png", sizes: "180x180" },
    shortcut: "/logo/icon-32.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FishDex",
  },
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
        <main className="flex-1">
          {children}
        </main>
        <BottomNavV2 />
      </body>
    </html>
  );
}

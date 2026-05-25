import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Outfit, Dancing_Script } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { BottomNavV2 } from "@/components/BottomNavV2";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: '#0a0f14',
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} ${dancingScript.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Suspense fallback={null}>
          <PostHogProvider>
            <main className="flex-1">
              {children}
            </main>
            {user && <BottomNavV2 />}
          </PostHogProvider>
        </Suspense>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(10, 15, 20, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}

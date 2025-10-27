import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import MobileNav from "@/components/MobileNav";


export const metadata: Metadata = {
  title: "InspireCraft - Artist Portfolio & Gallery",
  description: "Discover and showcase amazing artworks, creations, and artistic inspiration",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black">
        <Providers>
          <Header/>
          <main className="pb-24">
            {children}
          </main>
          <MobileNav/>
        </Providers>
      </body>
    </html>
  );
}

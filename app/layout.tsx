import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LARPN — Engineering the Future",
  description:
    "LARPN crafts custom software, web apps, SaaS products, and refined interfaces for ambitious teams.",
  icons: {
    icon: "/larpn.jpg",
    shortcut: "/larpn.jpg",
    apple: "/larpn.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // fills iPhone safe-area background
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `dark` keeps Tailwind's dark: variants always active (the site is permanently dark)
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="min-h-dvh bg-ink text-white grain overflow-x-hidden">
        <LoadingScreen />
        {/* Navbar lives in the root layout so it persists across route
            changes — putting it inside <PageTransition> caused it to
            unmount/re-animate on every navigation. */}
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}

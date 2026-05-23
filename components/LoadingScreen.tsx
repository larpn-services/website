"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fadeT = setTimeout(() => setFadingOut(true), 1400);
    const removeT = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, 2100);

    return () => {
      clearTimeout(fadeT);
      clearTimeout(removeT);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-10 transition-opacity duration-700",
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      aria-hidden={fadingOut}
    >
      <LogoLoader />
      <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">
        <span className="text-white">LARPN</span>
        <span className="text-ember">.</span>
      </p>
    </div>
  );
}

// Reusable logo loader: orbiting ember ring + soft breath behind the logo.
// Exported so route transitions can reuse the exact same visual.
export function LogoLoader({
  size = 88,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* slow orbiting conic ring */}
      <div
        className="absolute -inset-4 rounded-full opacity-90"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,107,26,0) 0deg, rgba(255,107,26,0.65) 90deg, rgba(255,107,26,0) 200deg, rgba(255,138,61,0.45) 290deg, rgba(255,107,26,0) 360deg)",
          filter: "blur(16px)",
          animation: "ember-orbit 4.5s linear infinite",
        }}
      />
      {/* inner breath glow */}
      <div
        className="absolute inset-0 -m-2 rounded-2xl bg-ember/25 blur-xl"
        style={{ animation: "ember-breath 3s ease-in-out infinite" }}
      />
      {/* the logo */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
        <Image
          src="/larpn.jpg"
          alt="LARPN"
          fill
          sizes={`${size}px`}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30 mix-blend-overlay" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-ember/25" />
      </div>
    </div>
  );
}

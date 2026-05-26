"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "/services" },
  { label: "Templates", href: "/templates" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Return true when `pathname` is on/under `href`. Root is matched exactly.
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // When you're on a sub-page (e.g. /services/client-work) and click a
  // top-level nav item (Work → /services), Link's default optimisation can
  // bail because the URL "appears" to match. Push imperatively so clicking
  // a section in the nav always behaves like a back navigation to its hub.
  const handleNavClick =
    (href: string) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Sub-route case: /about/foo → /about.
      if (pathname !== href && pathname.startsWith(href + "/")) {
        e.preventDefault();
        router.push(href);
      }
      // Same-pathname-with-search-params case: /about?p=4 → /about.
      // Without intervening, Link sees a matching URL and does nothing.
      else if (
        pathname === href &&
        typeof window !== "undefined" &&
        window.location.search.length > 0
      ) {
        e.preventDefault();
        router.push(href);
      }
      setOpen(false);
    };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The Navbar now lives in the root layout and persists across route
  // changes. Next.js resets scroll to 0 on navigation without firing a
  // scroll event, so re-sync the chrome state whenever the path changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time route → chrome state sync
    setScrolled(window.scrollY > 24);
    setOpen(false);
  }, [pathname]);

  const onContact = isActive(pathname, "/contact");

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        scrolled ? "bg-black/40 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="group">
          <span className="text-white font-medium text-sm tracking-[0.35em]">
            LARPN
          </span>
          <span className="ml-1 text-ember">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleNavClick(link.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative text-xs font-light tracking-[0.2em] uppercase transition-colors",
                  active
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-ember transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* CTA — on /contact this becomes a Home button.
            The global PageTransition handles the smooth crossfade. */}
        <Link
          href={onContact ? "/" : "/contact"}
          aria-label={onContact ? "Back to home" : "Open contact page"}
          className="hidden md:inline-flex items-center px-4 py-2 border border-white/20 text-white text-xs tracking-[0.2em] uppercase font-light rounded-full hover:border-ember hover:text-ember transition-colors"
        >
          {onContact ? "Home" : "Let’s talk"}
        </Link>

        {/* Mobile toggle — 44px target hits iOS HIG */}
        <button
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col"
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={handleNavClick(link.href)}
                className={cn(
                  "py-3 text-xs font-light tracking-[0.2em] uppercase",
                  active
                    ? "text-white border-l-2 border-ember pl-3 -ml-3"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={onContact ? "/" : "/contact"}
            onClick={() => setOpen(false)}
            className="mt-4 mb-2 inline-flex items-center justify-center min-h-11 px-4 py-2.5 border border-white/20 text-white text-xs tracking-[0.2em] uppercase rounded-full"
          >
            {onContact ? "Home" : "Let’s talk"}
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}

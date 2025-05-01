"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  BookOpen,
  Image,
  BrainCircuit,
  Brush,
  
} from "lucide-react";

import clsx from "clsx";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  // { href: "/explore", icon: Search, label: "Explore" },
  {href: "/ai-images/public", icon: BrainCircuit, label: "AI Images"},
  { href: "/tutorial", icon: BookOpen, label: "Tutorials" },
  { href: "/artwork", icon: Brush, label: "Artworks" },
  {href: '/post', icon: Image, label: 'Posts'},
  // { href: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <>
     {/* Mobile Footer - Visible on small screens only */}
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around  items-center px-4 py-2">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className="flex flex-col items-center text-xs text-gray-500 hover:text-indigo-600 transition">
          <Icon
            className={clsx("w-6 h-6 mb-1", {
              "text-indigo-600": pathname.startsWith(href),
              "text-gray-400": !pathname.startsWith(href),
            })}
          />
          <span className={clsx("text-[10px]", { "font-semibold text-indigo-600": pathname.startsWith(href) })}>
            {label}
          </span>
        </Link>
      ))}
    </nav>
    {/* Desktop Footer - Only visible on md and above */}
    {/* <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 text-white text-center  px-4 py-2 shadow-inner">
        <p >You're on desktop — maybe show something else here 🖥️</p>
      </div> */}
    </>
  );
}

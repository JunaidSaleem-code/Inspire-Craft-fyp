"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Image,
  BrainCircuit,
  Brush,
} from "lucide-react";

import clsx from "clsx";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  {href: "/ai-images/public", icon: BrainCircuit, label: "AI Images"},
  { href: "/tutorial", icon: BookOpen, label: "Tutorials" },
  { href: "/artwork", icon: Brush, label: "Artworks" },
  {href: '/post', icon: Image, label: 'Posts'},
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 backdrop-blur-xl bg-black/40">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link 
            key={href} 
            href={href} 
            className={clsx(
              "flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-300",
              pathname?.startsWith(href)
                ? "text-purple-400"
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[11px] sm:text-xs font-medium">
              {label}
            </span>
            {pathname?.startsWith(href) && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

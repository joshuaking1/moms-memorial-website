// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/life-story', label: 'Her Story' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/tributes', label: 'Tributes' },
    { href: '/funeral-details', label: 'Funeral Details' },
    { href: '/donations', label: 'Support' },
    { href: '/brochure', label: 'Program' },
    // We will add more links here as we build new pages
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-30 p-4">
      <nav className="mx-auto max-w-5xl bg-black/30 backdrop-blur-sm rounded-full p-2">
        <ul className="flex items-center justify-center space-x-2 md:space-x-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`
                px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors
                ${pathname === item.href 
                  ? 'bg-yellow-400 text-gray-900' 
                  : 'text-white/80 hover:bg-white/10'
                }
              `}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
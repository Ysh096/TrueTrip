'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              TrueTrip ✈️
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  pathname === '/' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                AI Planner
              </Link>
              <Link 
                href="/places" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  pathname === '/places' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
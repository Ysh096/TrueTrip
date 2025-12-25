'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {

  const pathname = usePathname();



  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300">

      <div className="flex items-center gap-10">

        <Link href="/" className="flex items-center gap-2 group">

          <span className="text-xl">✈️</span>

          <span className="text-lg font-black tracking-tighter text-slate-900">

            True<span className="text-blue-600">Trip</span>

          </span>

        </Link>

        

        <div className="hidden md:flex items-center gap-6">

          <Link 

            href="/" 

            className={`text-xs font-bold transition-all hover:text-blue-600 ${

              pathname === '/' ? 'text-blue-600' : 'text-slate-400'

            }`}

          >

            AI 플래너

          </Link>

          <Link 

            href="/places" 

            className={`text-xs font-bold transition-all hover:text-blue-600 ${

              pathname === '/places' ? 'text-blue-600' : 'text-slate-400'

            }`}

          >

            장소 탐색

          </Link>

        </div>

      </div>



      <div className="flex items-center gap-4">

         <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100">

           로그인

         </button>

      </div>

    </nav>

  );

}

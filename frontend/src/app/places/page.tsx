'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/States';
import { motion } from 'framer-motion';
import { fetchAllPlaces } from '@/lib/api';
import { Recommendation } from '@/types';

export default function PlacesPage() {
  const [places, setPlaces] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchAllPlaces();
        setPlaces(data);
      } catch (err) {
        console.error('Failed to fetch places:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, []);

  return (
    <main className="page-container bg-white">
      {/* Background Decor */}
      <div className="bg-orb -top-24 -right-24 w-96 h-96 bg-blue-50/50" />
      
      <div className="max-w-7xl w-full space-y-12 relative z-10 py-12 px-6">
        <header className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Badge variant="blue" className="px-4 py-1 uppercase tracking-widest text-[10px] font-bold">Curated Selection</Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-slate-900 tracking-tight"
          >
            인기 있는 <span className="text-blue-600">여행지</span> 탐색
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl font-medium"
          >
            TrueTrip AI가 검증한 가장 신뢰할 수 있고 인기 있는 장소들을 확인해보세요.
          </motion.p>
        </header>

        {loading ? (
          <LoadingState message="추천 장소들을 불러오고 있습니다..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place, index) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col group overflow-hidden border-slate-100 hover:border-blue-200 transition-all duration-500 rounded-[2rem]">
                  {/* Image Container */}
                  <div className="h-56 relative overflow-hidden bg-slate-50 flex items-center justify-center">
                    {place.imageUrl ? (
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center -z-10">
                       <span className="text-3xl opacity-20 mb-1">🏞️</span>
                       <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Image Placeholder</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md border-none shadow-sm text-slate-900 text-[10px] px-3">
                        {place.category === 'ACCOMMODATION' ? '🏠 숙소' : '📍 명소'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col space-y-4">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
                      {place.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                      {place.description}
                    </p>
                    <div className="pt-4 mt-auto flex items-center justify-between">
                      {place.namuWikiUrl ? (
                        <a 
                          href={place.namuWikiUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                          상세 정보 ↗
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1 cursor-default">
                          정보 준비 중
                        </span>
                      )}
                      <button className="px-5 py-2.5 bg-slate-900 text-white hover:bg-blue-600 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200 active:scale-95">
                        일정에 담기
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
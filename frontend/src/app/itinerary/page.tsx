'use client';

import { useRouter } from 'next/navigation';
import { usePlannerStore } from '@/lib/store';
import TravelMap from '@/components/planner/TravelMap';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useEffect, useState } from 'react';
import { StepIndicator } from '@/components/ui/StepIndicator';

export default function ItineraryPage() {
  const router = useRouter();
  const store = usePlannerStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const itinerary = store.itinerary;
  const destination = store.destination;

  useEffect(() => {
    if (isHydrated && !itinerary) {
      router.replace('/');
    }
  }, [isHydrated, itinerary, router]);

  if (!isHydrated || !itinerary) {
    return (
      <main className="page-container justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">최적화된 일정을 구성하고 있습니다...</p>
        </div>
      </main>
    );
  }

  const allPlaces = itinerary.days?.flatMap(day => day.places || []) || [];

  const handleOpenGoogleMaps = () => {
    if (allPlaces.length === 0) {
      store.showToast('동선 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    const coordinatePath = allPlaces
      .filter(p => p && p.latitude && p.longitude)
      .map(p => `${p.latitude},${p.longitude}`)
      .join('/');
    
    if (coordinatePath) {
      window.open(`https://www.google.com/maps/dir/${coordinatePath}`, '_blank');
    } else {
      store.showToast('동선 좌표 정보가 부족합니다.', 'error');
    }
  };

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <StepIndicator currentStep={3} />

        <header className="text-center space-y-4">
           <button 
              onClick={() => router.back()}
              className="text-slate-400 font-medium hover:text-blue-600 transition-colors mb-2 text-sm"
            >
              ← 이전 단계로
            </button>
            <h1 className="hero-title">
              나의 <span className="text-blue-600">{destination}</span> 여행 코스
            </h1>
            <div className="flex justify-center gap-2">
               <Badge className="px-4 py-1 text-xs bg-blue-50 text-blue-600 border-blue-100">AI 최적화 완료</Badge>
               <Badge className="px-4 py-1 text-xs bg-slate-50 text-slate-600 border-slate-100">동선 최적화</Badge>
            </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Map Section */}
          <section className="glass-card p-6 bg-slate-50/50">
             <div className="flex items-center justify-between mb-6 px-4">
                <h3 className="section-title text-xl">🗺️ 전체 동선</h3>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Route Preview</span>
             </div>
             <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <TravelMap places={allPlaces} showRoute={true} />
             </div>
          </section>

          {/* Timeline Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Sticky Day Nav */}
            <div className="hidden lg:block lg:col-span-1 sticky top-32 h-fit space-y-4">
              {itinerary.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => document.getElementById(`day-${day.day}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center font-bold text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-all bg-white"
                >
                  D{day.day}
                </button>
              ))}
            </div>

            {/* Right: Actual Itinerary */}
            <div className="lg:col-span-11 space-y-16">
              {itinerary.days.map((day) => (
                <div key={day.day} id={`day-${day.day}`} className="relative scroll-mt-32">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-bold">
                       {day.day}
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900">{day.date}</h2>
                  </div>

                  <div className="relative ml-6 pl-10 border-l-2 border-dashed border-slate-200 space-y-8">
                    {day.places.map((place, pIdx) => (
                      <div key={pIdx} className="relative">
                        <div className="absolute -left-[51px] top-8 w-5 h-5 bg-white border-4 border-blue-600 rounded-full z-10" />
                        
                        <Card className="max-w-2xl hover:border-blue-200 transition-all border-slate-100 shadow-sm rounded-3xl p-6 group">
                          <div className="flex justify-between items-start mb-4">
                             <span className="chip-button chip-slate text-[9px] uppercase">
                               {place.timeSlot}
                             </span>
                             <div className="flex gap-2">
                               {place.category === 'ACCOMMODATION' && (
                                 <span className="text-orange-500 text-xs font-bold flex items-center gap-1">🏠 Stay</span>
                               )}
                               <a 
                                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.latitude},${place.longitude}`}
                                 target="_blank"
                                 className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-500 font-bold underline"
                               >
                                 지도보기 ↗
                               </a>
                             </div>
                          </div>
                          <h4 className="text-xl font-bold text-slate-800 mb-2">
                            {place.displayName || place.name}
                          </h4>
                          <p className="text-slate-500 text-sm leading-relaxed font-medium">{place.activity}</p>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex flex-col md:flex-row items-center justify-center gap-4 pt-12">
           <button 
             onClick={handleOpenGoogleMaps}
             className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
           >
             🗺️ 구글 맵으로 전체 동선 보기
           </button>
           <button 
             onClick={() => window.print()}
             className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
           >
             🖨️ 일정 인쇄하기
           </button>
        </footer>
      </div>
    </main>
  );
}

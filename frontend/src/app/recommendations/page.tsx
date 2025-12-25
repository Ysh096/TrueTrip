'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePlannerStore } from '@/lib/store';
import RecommendationList from '@/components/planner/RecommendationList';
import TravelMap from '@/components/planner/TravelMap';
import { EmptyState } from '@/components/ui/States';
import { StepIndicator } from '@/components/ui/StepIndicator';

export default function RecommendationsPage() {
  const router = useRouter();
  const store = usePlannerStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const recommendations = store.recommendations || [];
  const destination = store.destination;
  const startDate = store.startDate;
  const endDate = store.endDate;
  
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    // If hydration is complete and no data is present, redirect to home
    if (isHydrated && recommendations.length === 0 && !destination) {
      store.showToast('데이터를 찾을 수 없어 메인 페이지로 이동합니다.', 'info');
      router.replace('/');
    }
  }, [isHydrated, recommendations.length, destination, router, store]);

  if (!isHydrated) {
    return (
      <main className="page-container justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">추천 코스를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (recommendations.length === 0) {
    return (
      <main className="page-container justify-center">
        <EmptyState 
          message="추천 데이터가 없습니다. 메인 페이지로 이동합니다..." 
          onAction={() => router.push('/')}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-12 pb-32 relative">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
        
        <StepIndicator currentStep={2} />

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <button 
              onClick={() => router.back()} 
              className="group flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Planner
            </button>
            <h1 className="hero-title text-4xl md:text-5xl">
              <span className="text-blue-600">{destination}</span> <br className="md:hidden"/>
              여행을 위한 완벽한 추천
            </h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <span className="w-8 h-[1px] bg-slate-200" />
              {startDate} - {endDate}
            </p>
          </div>
        </header>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-white p-1 rounded-2xl border border-slate-100">
          <button 
            onClick={() => setMobileView('list')}
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${mobileView === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            📋 리스트 보기
          </button>
          <button 
            onClick={() => setMobileView('map')}
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${mobileView === 'map' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            🗺️ 지도 보기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className={`lg:col-span-7 ${mobileView === 'map' ? 'hidden lg:block' : 'block'}`}>
            <RecommendationList items={recommendations} />
          </div>
          
          <div className={`lg:col-span-5 sticky top-12 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
            <div className="glass-card p-6 space-y-6">
              <h3 className="section-title text-xl flex items-center gap-2">📍 추천 여행 지도</h3>
              <div className="rounded-3xl overflow-hidden shadow-inner bg-slate-100">
                <TravelMap places={recommendations} showRoute={false} />
              </div>
              <div className="bg-blue-50/50 p-4 rounded-2xl text-blue-700 text-[10px] leading-relaxed font-medium">
                💡 빨간색 마커는 AI가 추천하는 숙소 위치입니다. <br/>
                가장 효율적인 동선을 위해 숙소를 먼저 확인해보세요!
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

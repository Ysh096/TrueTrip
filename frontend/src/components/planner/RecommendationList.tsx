'use client';

import { useState } from 'react';
import { Recommendation } from '@/types';
import { RecommendationCard } from './RecommendationCard';
import { Button } from '@/components/ui/Button';
import { useItinerary } from '@/lib/hooks';
import { usePlannerStore } from '@/lib/store';

interface RecommendationListProps {
  items: Recommendation[];
}

export default function RecommendationList({ items }: RecommendationListProps) {

  const { generate } = useItinerary();

  const { isGlobalLoading, selectedPlaces, setSelectedPlaces } = usePlannerStore();



  const togglePlace = (name: string) => {

    const newSelection = selectedPlaces.includes(name) 

      ? selectedPlaces.filter(p => p !== name) 

      : [...selectedPlaces, name];

    setSelectedPlaces(newSelection);

  };



  if (items.length === 0) return null;



  const MAX_PREVIEW = 5;



  return (

    <div className="space-y-8 pb-32">

      <header className="flex items-center justify-between">

         <h2 className="section-title">AI 추천 장소 <span className="text-blue-600">{items.length}</span></h2>

         <div className="flex flex-col items-end gap-1">

            <p className="text-slate-400 text-sm font-medium">취향에 맞는 곳을 담아보세요</p>

            {selectedPlaces.length > 0 && (

              <button 

                onClick={() => setSelectedPlaces([])}

                className="text-[10px] text-red-400 hover:text-red-500 font-bold uppercase tracking-wider"

              >

                Clear Selection ({selectedPlaces.length})

              </button>

            )}

         </div>

      </header>



      <div className="space-y-4">

        {items.map((item, index) => (

          <RecommendationCard 

            key={item.name} 

            item={item} 

            index={index} 

            isSelected={selectedPlaces.includes(item.name)}

            onToggle={() => togglePlace(item.name)}

          />

        ))}

      </div>



      {selectedPlaces.length > 0 && (

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">

          <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Mini Preview of Selected Places */}

            <div className="flex flex-wrap justify-center gap-1.5 mb-4">

              {selectedPlaces.slice(0, MAX_PREVIEW).map(name => (

                <span key={name} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-white/90">

                  {name}

                </span>

              ))}

              {selectedPlaces.length > MAX_PREVIEW && (

                <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold text-white">

                  +{selectedPlaces.length - MAX_PREVIEW} 더보기

                </span>

              )}

            </div>

            

            <Button 

              className="w-full py-6 text-lg rounded-3xl bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"

              onClick={() => generate(selectedPlaces)}

              isLoading={isGlobalLoading}

            >

              {isGlobalLoading ? '일정을 최적화 중입니다...' : '여행 코스 생성하기 ✨'}

            </Button>

          </div>

        </div>

      )}

    </div>

  );

}

'use client';

import { useState } from 'react';
import { RecommendationResponse, ItineraryPlanResponse } from '@/types';
import { RecommendationCard } from './RecommendationCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { planItinerary } from '@/lib/api';

interface RecommendationListProps {
  destination: string;
  startDate: string;
  endDate: string;
  items: RecommendationResponse[];
}

export default function RecommendationList({ destination, startDate, endDate, items }: RecommendationListProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (items.length === 0) return null;

  const togglePlace = (name: string) => {
    setSelectedPlaces(prev => 
      prev.includes(name) 
        ? prev.filter(p => p !== name) 
        : [...prev, name]
    );
  };

  const handlePlanItinerary = async () => {
    if (selectedPlaces.length === 0) {
      alert('최소 하나 이상의 장소를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const plan = await planItinerary({
        destination,
        startDate,
        endDate,
        selectedPlaces
      });
      setItinerary(plan);
      // Scroll to itinerary
      setTimeout(() => {
        document.getElementById('itinerary-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert('일정 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12 animate-fade-in pt-10 pb-20">
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
          <span className="text-emerald-500">{destination}</span> 추천 코스
        </h3>
        <p className="text-slate-500">AI가 엄선한 맞춤 장소입니다. 가고 싶은 곳을 담아보세요!</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {items.map((item, index) => (
          <RecommendationCard 
            key={`${item.name}-${index}`} 
            item={item} 
            index={index} 
            isSelected={selectedPlaces.includes(item.name)}
            onToggle={() => togglePlace(item.name)}
          />
        ))}
      </div>

      <div className="sticky bottom-8 flex justify-center z-10">
        <Button 
          className="shadow-2xl px-12 py-8 text-xl rounded-full bg-emerald-600 hover:bg-emerald-700 transition-all transform hover:scale-105 active:scale-95"
          onClick={handlePlanItinerary}
          disabled={isLoading || selectedPlaces.length === 0}
        >
          {isLoading ? '최적의 경로를 계산 중...' : `선택한 ${selectedPlaces.length}곳으로 일정 짜기 ✨`}
        </Button>
      </div>

      {itinerary && (
        <div id="itinerary-section" className="space-y-8 pt-10 border-t border-slate-200">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-slate-800 mb-2">나만의 맞춤 여행 일정</h3>
            <p className="text-slate-500">동선과 숙소를 고려한 최적의 일정입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itinerary.days.map((day) => (
              <Card key={day.day} className="border-t-4 border-t-emerald-500 bg-slate-50/50">
                <div className="mb-6 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-slate-800">DAY {day.day}</h4>
                  {day.date && <span className="text-sm text-slate-500 font-medium">{day.date}</span>}
                </div>
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-100">
                  {day.places.map((place, pIndex) => (
                    <div key={pIndex} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm z-1"></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{place.timeSlot}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="font-bold text-slate-800">{place.name}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{place.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

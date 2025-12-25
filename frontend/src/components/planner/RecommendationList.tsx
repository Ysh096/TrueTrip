'use client';

import { RecommendationResponse } from '@/types';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationListProps {
  destination: string;
  items: RecommendationResponse[];
}

export default function RecommendationList({ destination, items }: RecommendationListProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full space-y-8 animate-fade-in pt-10">
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
          <span className="text-emerald-500">{destination}</span> 추천 코스
        </h3>
        <p className="text-slate-500">AI가 엄선한 5가지 맞춤 장소입니다.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {items.map((item, index) => (
          <RecommendationCard key={`${item.name}-${index}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

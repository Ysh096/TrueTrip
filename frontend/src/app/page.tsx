'use client';

import { useState } from 'react';
import PlannerForm from '@/components/planner/PlannerForm';
import RecommendationList from '@/components/planner/RecommendationList';
import { RecommendationResponse } from '@/types';

export default function PlannerPage() {
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [destination, setDestination] = useState<string>('');

  const handleSuccess = (data: RecommendationResponse[], dest: string) => {
    setRecommendations(data);
    setDestination(dest);
  };

  const handleError = (error: string) => {
    alert(error);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 md:p-12 pb-32">
      <div className="max-w-4xl w-full space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 pt-8">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold tracking-wide mb-2 animate-fade-in">
            New Travel Experience
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800">
            어디로 <span className="text-emerald-500">여행</span>을 떠나시나요?
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            취향과 일정만 알려주세요. <br className="hidden md:block"/>
            <span className="font-semibold text-emerald-600">TrueTrip AI</span>가 당신만을 위한 완벽한 여행 코스를 선물합니다. 🎁
          </p>
        </div>

        {/* Input Form Card */}
        <PlannerForm 
            onSuccess={handleSuccess} 
            onError={handleError} 
        />

        {/* Result Display */}
        {recommendations.length > 0 && (
          <RecommendationList destination={destination} items={recommendations} />
        )}
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { RecommendationRequest, RecommendationResponse } from '@/types';
import { fetchRecommendations } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ThemeSelector } from './ThemeSelector';

interface PlannerFormProps {
  onSuccess: (data: RecommendationResponse[], destination: string, startDate: string, endDate: string) => void;
  onError: (error: string) => void;
}

const AGES = ['10대', '20대', '30대', '40대', '50대 이상', '가족 동반(아이 포함)'];

export default function PlannerForm({ onSuccess, onError }: PlannerFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<RecommendationRequest, 'userLocale'>>({
    destination: '',
    startDate: '',
    endDate: '',
    ageGroup: '20대',
    themes: [] as string[],
    groupSize: 2,
  });

  const handleThemeToggle = (theme: string) => {
    setFormData((prev) => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter((t) => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchRecommendations(formData);
      onSuccess(data, formData.destination, formData.startDate, formData.endDate);
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-8 md:p-10 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            label="여행지"
            placeholder="예: 제주도, 도쿄, 파리"
            value={formData.destination}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            required
          />

          <Input 
            label="인원 수"
            type="number"
            min={1}
            value={formData.groupSize}
            onChange={(e) => setFormData({...formData, groupSize: parseInt(e.target.value)})}
            required
          />

          <Input 
            label="시작일"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
          />

          <Input 
            label="종료일"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            required
          />
          
          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">주요 연령대</label>
            <div className="relative">
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 focus:outline-none transition-all text-slate-800 font-medium text-lg cursor-pointer"
              >
                {AGES.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          <ThemeSelector 
            selectedThemes={formData.themes}
            onToggle={handleThemeToggle}
          />
        </div>

        <Button 
          type="submit" 
          isLoading={loading}
          className="w-full mt-10 text-xl py-5"
        >
          {loading ? '최고의 코스를 찾고 있어요...' : 'AI 추천 코스 보기 ✨'}
        </Button>
      </Card>
    </form>
  );
}
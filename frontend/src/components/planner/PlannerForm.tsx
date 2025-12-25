'use client';

import { useState, useEffect } from 'react';
import { RecommendationRequest, Recommendation } from '@/types';
import { fetchRecommendations } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeSelector } from './ThemeSelector';
import { usePlannerStore } from '@/lib/store';
import { motion, Variants } from 'framer-motion';

interface PlannerFormProps {
  onSuccess: (data: Recommendation[], destination: string, startDate: string, endDate: string) => void;
  onError: (error: string) => void;
}

const AGES = ['10대', '20대', '30대', '40대', '50대 이상', '가족 동반(아이 포함)'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function PlannerForm({ onSuccess, onError }: PlannerFormProps) {
  const store = usePlannerStore();
  const { setLoading, updateDraft, isGlobalLoading } = store;
  
  // Get local date string YYYY-MM-DD
  const getLocalDateString = (date: Date = new Date()) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
  };

  const todayStr = getLocalDateString();

  const [formData, setFormData] = useState<Omit<RecommendationRequest, 'userLocale'>>({
    destination: store.destination || '',
    startDate: store.startDate || todayStr,
    endDate: store.endDate || getLocalDateString(new Date(Date.now() + 86400000 * 2)), // Default +2 days
    ageGroup: store.ageGroup || '20대',
    themes: store.themes || [] as string[],
    groupSize: store.groupSize || 2,
    travelMethod: store.travelMethod || 'PUBLIC',
  });

  useEffect(() => {
    setFormData({
      destination: store.destination || '',
      startDate: store.startDate || '',
      endDate: store.endDate || '',
      ageGroup: store.ageGroup || '20대',
      themes: store.themes || [],
      groupSize: store.groupSize || 2,
      travelMethod: store.travelMethod || 'PUBLIC',
    });
  }, [store.destination, store.startDate, store.endDate, store.ageGroup, store.groupSize, store.travelMethod]);

  const handleChange = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    updateDraft(updates);
  };

  const handleThemeToggle = (theme: string) => {
    const newThemes = formData.themes.includes(theme)
      ? formData.themes.filter((t) => t !== theme)
      : [...formData.themes, theme];
    handleChange({ themes: newThemes });
  };

  const setQuickDate = (type: 'tomorrow' | 'weekend') => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (type === 'tomorrow') {
      start.setDate(today.getDate() + 1);
      end.setDate(start.getDate() + 2);
    } else if (type === 'weekend') {
      const day = today.getDay();
      const diff = (6 - day + 7) % 7 || 7; 
      start.setDate(today.getDate() + diff);
      end.setDate(start.getDate() + 1);
    }
    
    handleChange({ 
      startDate: getLocalDateString(start), 
      endDate: getLocalDateString(end) 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination.trim()) {
      store.showToast('여행지를 입력해주세요.', 'error');
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      store.showToast('종료일은 시작일보다 빠를 수 없습니다.', 'error');
      return;
    }
    if (formData.themes.length === 0) {
      store.showToast('하나 이상의 테마를 선택해주세요.', 'info');
      return;
    }

    setLoading(true, "AI가 최적의 장소들을 분석하고 있습니다...");

    try {
      const data = await fetchRecommendations(formData);
      // Wait a tiny bit for the loading state to stabilize before calling success
      setTimeout(() => {
        onSuccess(data, formData.destination, formData.startDate, formData.endDate);
        store.showToast('추천 장소를 성공적으로 불러왔습니다!', 'success');
      }, 100);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      onError(message);
      store.showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial="hidden" animate="visible" variants={containerVariants}
      onSubmit={handleSubmit} className="w-full"
    >
      <div className="p-8 md:p-12 space-y-12">
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="text-lg md:text-xl font-bold text-slate-800 ml-1 block">
            어디로 떠나고 싶으신가요? ✨
          </label>
          <div className="relative group">
            <input 
              placeholder="도시 또는 국가를 입력하세요"
              value={formData.destination}
              onChange={(e) => handleChange({ destination: e.target.value })}
              required
              className="input-base text-xl md:text-2xl py-5 md:py-6 rounded-2xl shadow-none bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/30 transition-all placeholder:text-slate-300"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-20 group-focus-within:opacity-100 transition-opacity">
               <span className="text-xl">🌏</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            {['제주도', '도쿄', '오사카', '삿포로', '파리', '런던'].map((city) => (
              <button
                key={city} type="button"
                onClick={() => handleChange({ destination: city })}
                className="px-4 py-1.5 rounded-full border border-slate-100 bg-white text-slate-400 font-bold text-xs hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 ml-1 block">여행 일정</label>
              <div className="flex gap-2">
                <button
                  type="button" onClick={() => setQuickDate('tomorrow')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                >
                  내일부터 3일
                </button>
                <button
                  type="button" onClick={() => setQuickDate('weekend')}
                  className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg font-bold text-xs hover:bg-slate-900 hover:text-white transition-all"
                >
                  이번 주말
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">출발일</span>
                  <Input 
                    type="date"
                    min={todayStr}
                    value={formData.startDate}
                    onChange={(e) => handleChange({ startDate: e.target.value })}
                    required
                    className="rounded-xl py-3.5 font-bold border-slate-100/50 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">도착일</span>
                  <Input 
                    type="date"
                    min={formData.startDate || todayStr}
                    value={formData.endDate}
                    onChange={(e) => handleChange({ endDate: e.target.value })}
                    required
                    className="rounded-xl py-3.5 font-bold border-slate-100/50 text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-600 ml-1 block">인원 및 수단</label>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">연령대</span>
                    <div className="relative">
                        <select
                          value={formData.ageGroup}
                          onChange={(e) => handleChange({ ageGroup: e.target.value })}
                          className="input-base py-3.5 text-xs appearance-none rounded-xl border-slate-100/50"
                        >
                          {AGES.map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">인원수</span>
                    <Input 
                      type="number" min={1}
                      value={formData.groupSize}
                      onChange={(e) => handleChange({ groupSize: parseInt(e.target.value) })}
                      required
                      className="font-bold rounded-xl py-3.5 border-slate-100/50 text-sm"
                    />
                 </div>
              </div>
              <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100/50">
                <button
                  type="button"
                  onClick={() => handleChange({ travelMethod: 'PUBLIC' })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.travelMethod === 'PUBLIC' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  🚌 대중교통
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ travelMethod: 'RENT' })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.travelMethod === 'RENT' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  🚗 렌트/자차
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pt-2">
           <ThemeSelector selectedThemes={formData.themes} onToggle={handleThemeToggle} />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6">
          <Button 
            type="submit" isLoading={isGlobalLoading}
            className="w-full py-8 text-xl rounded-3xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            {isGlobalLoading ? '추천 일정을 만드는 중...' : '맞춤 여행 코스 추천받기 ✨'}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
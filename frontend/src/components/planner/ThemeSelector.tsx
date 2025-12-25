'use client';

import { Button } from '@/components/ui/Button';

interface ThemeSelectorProps {
  selectedThemes: string[];
  onToggle: (theme: string) => void;
}

const THEMES = ['🍰 식도락', '🏰 역사/문화', '🌿 자연/힐링', '🏄 액티비티', '🛍️ 쇼핑', '☕ 카페투어', '📸 인생샷', '🧘 휴식'];

export const ThemeSelector = ({ selectedThemes, onToggle }: ThemeSelectorProps) => {
  return (
    <div className="space-y-4 md:col-span-2">
      <label className="text-sm font-bold text-slate-600 ml-1 block">
        어떤 스타일의 여행을 원하시나요? <span className="text-slate-300 font-medium normal-case ml-2">(중복 선택 가능)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((theme) => {
          const isSelected = selectedThemes.includes(theme);
          return (
            <button
              key={theme}
              type="button"
              onClick={() => onToggle(theme)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border
                ${isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-500'}
              `}
            >
              {theme}
            </button>
          );
        })}
      </div>
    </div>
  );
};

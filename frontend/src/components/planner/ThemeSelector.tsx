'use client';

import { Button } from '@/components/ui/Button';

interface ThemeSelectorProps {
  selectedThemes: string[];
  onToggle: (theme: string) => void;
}

const THEMES = ['🍰 식도락', '🏰 역사/문화', '🌿 자연/힐링', '🏄 액티비티', '🛍️ 쇼핑', '☕ 카페투어', '📸 인생샷', '🧘 휴식'];

export const ThemeSelector = ({ selectedThemes, onToggle }: ThemeSelectorProps) => {
  return (
    <div className="space-y-3 md:col-span-2">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
        여행 스타일 <span className="text-slate-400 font-normal normal-case">(복수 선택 가능)</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {THEMES.map((theme) => {
          const isSelected = selectedThemes.includes(theme);
          return (
            <Button
              key={theme}
              type="button"
              variant={isSelected ? 'primary' : 'outline'}
              onClick={() => onToggle(theme)}
              className="px-5 py-3 text-sm"
            >
              {theme} {isSelected && '✓'}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

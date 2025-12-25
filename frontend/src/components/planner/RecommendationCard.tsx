'use client';

import { Recommendation } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SafeImage } from '@/components/ui/SafeImage';

interface RecommendationCardProps {
  item: Recommendation;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const RecommendationCard = ({ item, index, isSelected, onToggle }: RecommendationCardProps) => {
  return (
    <Card hover className={`flex flex-col md:flex-row gap-6 items-stretch group transition-all duration-300 border-slate-50 ${isSelected ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-100' : ''}`}>
      {/* Image Section */}
      <div className="md:w-48 h-48 md:h-auto flex-shrink-0 relative overflow-hidden rounded-2xl">
        <SafeImage 
          src={item.imageUrl} 
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          placeholderText="No Image"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 font-bold text-xs rounded-lg w-8 h-8 flex items-center justify-center shadow-sm z-10">
          {index + 1}
        </div>
      </div>

      <div className="flex-grow p-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xl font-bold text-slate-900 tracking-tight">
            {item.displayName || item.name}
          </h4>
          {item.category === 'ACCOMMODATION' && (
            <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[10px] px-2 py-0.5">🏠 숙소</Badge>
          )}
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] px-2 py-0.5">{item.reason}</Badge>
          {item.namuWikiUrl && (
            <a 
              href={item.namuWikiUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-slate-400 hover:text-blue-500 transition-colors"
            >
              Info ↗
            </a>
          )}
        </div>
        <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.description}</p>
      </div>

      <div className="flex items-center p-6 pt-0 md:pt-6">
        <Button 
          variant={isSelected ? "primary" : "outline"} 
          className={`w-full md:w-auto flex-shrink-0 py-2.5 px-5 text-sm rounded-xl ${isSelected ? 'bg-blue-600 shadow-blue-200' : ''}`}
          onClick={onToggle}
        >
          {isSelected ? '선택됨' : '담기'}
        </Button>
      </div>
    </Card>
  );
};

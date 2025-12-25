'use client';

import { RecommendationResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RecommendationCardProps {
  item: RecommendationResponse;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const RecommendationCard = ({ item, index, isSelected, onToggle }: RecommendationCardProps) => {
  return (
    <Card hover className={`flex flex-col md:flex-row gap-6 items-start group transition-all ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/30' : ''}`}>
      <div className="flex-shrink-0 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 font-extrabold text-xl rounded-2xl w-16 h-16 flex items-center justify-center shadow-inner">
        {index + 1}
      </div>
      <div className="flex-grow space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-2xl font-bold text-slate-800">{item.name}</h4>
          <Badge>{item.reason}</Badge>
          {item.namuWikiUrl && (
            <a 
              href={item.namuWikiUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              나무위키 ↗
            </a>
          )}
        </div>
        <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
      </div>
      <Button 
        variant={isSelected ? "secondary" : "outline"} 
        className="flex-shrink-0"
        onClick={onToggle}
      >
        {isSelected ? '✓ 담김' : '+ 담기'}
      </Button>
    </Card>
  );
};

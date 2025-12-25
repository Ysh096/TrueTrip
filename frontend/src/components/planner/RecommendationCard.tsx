'use client';

import { RecommendationResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RecommendationCardProps {
  item: RecommendationResponse;
  index: number;
}

export const RecommendationCard = ({ item, index }: RecommendationCardProps) => {
  return (
    <Card hover className="flex flex-col md:flex-row gap-6 items-start group">
      <div className="flex-shrink-0 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 font-extrabold text-xl rounded-2xl w-16 h-16 flex items-center justify-center shadow-inner">
        {index + 1}
      </div>
      <div className="flex-grow space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-2xl font-bold text-slate-800">{item.name}</h4>
          <Badge>{item.reason}</Badge>
        </div>
        <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
      </div>
      <Button variant="outline" className="flex-shrink-0">
        + 담기
      </Button>
    </Card>
  );
};

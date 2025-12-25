import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlannerStore } from '@/lib/store';
import { planItinerary } from '@/lib/api';

export function useItinerary() {
  const router = useRouter();
  const { destination, startDate, endDate, setItinerary, setLoading, showToast, isGlobalLoading } = usePlannerStore();

  const generate = async (selectedPlaces: string[]) => {
    if (selectedPlaces.length === 0) {
      showToast('일정에 담을 장소를 선택해주세요.', 'info');
      return;
    }

    setLoading(true, '최적의 경로를 생성하고 있습니다...');
    try {
      const plan = await planItinerary({
        destination,
        startDate,
        endDate,
        selectedPlaces
      });
      setItinerary(plan);
      showToast('여행 일정이 생성되었습니다!', 'success');
      router.push('/itinerary');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '일정 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { generate, isLoading: isGlobalLoading };
}

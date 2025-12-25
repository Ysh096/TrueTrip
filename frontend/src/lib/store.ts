import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Recommendation, ItineraryPlanResponse } from '@/types';

interface PlannerState {
  destination: string;
  startDate: string;
  endDate: string;
  ageGroup: string;
  themes: string[];
  groupSize: number;
  travelMethod: 'PUBLIC' | 'RENT';
  recommendations: Recommendation[];
  selectedPlaces: string[];
  itinerary: ItineraryPlanResponse | null;
  isGlobalLoading: boolean;
  loadingMessage: string;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  setBasicInfo: (dest: string, start: string, end: string) => void;
  updateDraft: (data: Partial<{ destination: string; startDate: string; endDate: string; ageGroup: string; groupSize: number; travelMethod: 'PUBLIC' | 'RENT'; themes: string[] }>) => void;
  setRecommendations: (data: Recommendation[]) => void;
  setSelectedPlaces: (places: string[]) => void;
  setItinerary: (plan: ItineraryPlanResponse) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  reset: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      destination: '',
      startDate: '',
      endDate: '',
      ageGroup: '20대',
      themes: [],
      groupSize: 2,
      travelMethod: 'PUBLIC',
      recommendations: [],
      selectedPlaces: [],
      itinerary: null,
      isGlobalLoading: false,
      loadingMessage: '',
      toast: null,

      setBasicInfo: (dest, start, end) => set({ destination: dest, startDate: start, endDate: end }),
      updateDraft: (data) => set((state) => ({ ...state, ...data })),
      setRecommendations: (data) => set({ recommendations: data }),
      setSelectedPlaces: (places) => set({ selectedPlaces: places }),
      setItinerary: (plan) => set({ itinerary: plan }),
      setLoading: (isLoading, message = '') => set({ isGlobalLoading: isLoading, loadingMessage: message }),
      showToast: (message, type = 'info') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3000);
      },
      hideToast: () => set({ toast: null }),
      reset: () => set({ 
        destination: '', 
        startDate: '', 
        endDate: '', 
        ageGroup: '20대',
        themes: [],
        groupSize: 2,
        travelMethod: 'PUBLIC',
        recommendations: [], 
        selectedPlaces: [], 
        itinerary: null,
        isGlobalLoading: false,
        loadingMessage: '',
        toast: null
      }),
    }),
    {
      name: 'truetrip-planner-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

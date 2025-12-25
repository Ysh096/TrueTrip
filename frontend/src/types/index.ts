export interface RecommendationRequest {
  destination: string;
  startDate: string;
  endDate: string;
  ageGroup: string;
  themes: string[];
  groupSize: number;
  userLocale: string;
  travelMethod: 'PUBLIC' | 'RENT';
}

export interface Recommendation {
  name: string;
  description: string;
  reason: string;
  namuWikiUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  category?: 'SPOT' | 'ACCOMMODATION';
  imageUrl?: string | null;
  displayName?: string | null;
}

export interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  selectedPlaces: string[];
  userLocale?: string;
}

export interface ItineraryPlanResponse {
  days: DayPlan[];
}

export interface DayPlan {
  day: number;
  date: string | null;
  places: ItineraryPlace[];
}

export interface ItineraryPlace {
  name: string;
  timeSlot: string;
  activity: string;
  latitude: number | null;
  longitude: number | null;
  category?: 'SPOT' | 'ACCOMMODATION';
  imageUrl?: string | null;
  displayName?: string | null;
}

export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: T;
}

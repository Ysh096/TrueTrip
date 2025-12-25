export interface RecommendationRequest {
  destination: string;
  startDate: string;
  endDate: string;
  ageGroup: string;
  themes: string[];
  groupSize: number;
  userLocale: string;
}

export interface RecommendationResponse {
  name: string;
  description: string;
  reason: string;
  namuWikiUrl?: string;
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
}

export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: T;
}

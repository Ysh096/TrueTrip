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
}

export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: T;
}

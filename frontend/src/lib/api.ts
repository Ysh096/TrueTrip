import { ApiResponse, RecommendationRequest, RecommendationResponse } from "@/types";

const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchRecommendations(formData: Omit<RecommendationRequest, 'userLocale'>): Promise<RecommendationResponse[]> {
  const requestBody: RecommendationRequest = {
    ...formData,
    userLocale: navigator.language || 'ko-KR',
  };

  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const result: ApiResponse<RecommendationResponse[]> = await response.json();
  
  if (result.status !== 'success' || !result.data) {
    throw new Error(result.message || 'Failed to fetch recommendations');
  }

  return result.data;
}

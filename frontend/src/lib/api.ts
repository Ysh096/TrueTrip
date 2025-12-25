import { Recommendation, RecommendationRequest, ItineraryRequest, ItineraryPlanResponse, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const DEFAULT_TIMEOUT = 180000; // 3 minutes for deep AI analysis

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      cache: 'no-store',
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `서버 오류가 발생했습니다. (상태 코드: ${response.status})`);
    }

    const rawText = await response.text();
    let result: ApiResponse<T>;
    try {
      result = JSON.parse(rawText);
    } catch (e) {
      console.error('Failed to parse API response:', rawText);
      throw new Error('서버 응답 형식이 올바르지 않습니다.');
    }
    
    if (!result || result.status !== 'success') {
      throw new Error(result?.message || '요청 처리에 실패했습니다.');
    }

    if (result.data === undefined || result.data === null) {
       console.warn('API returned success but empty data:', url);
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('서버 응답 시간이 초과되었습니다. (AI 분석은 최대 30초가 소요될 수 있습니다)');
      }
      console.error(`API Error [${url}]:`, error.message);
      throw error;
    }
    throw new Error('알 수 없는 네트워크 오류가 발생했습니다.');
  }
}

export const fetchRecommendations = (data: Omit<RecommendationRequest, 'userLocale'>): Promise<Recommendation[]> => {
  return request<Recommendation[]>('/recommendations', {
    method: 'POST',
    body: JSON.stringify({ ...data, userLocale: 'ko-KR' }),
  });
};

export const planItinerary = (data: ItineraryRequest): Promise<ItineraryPlanResponse> => {
  return request<ItineraryPlanResponse>('/recommendations/plan', {
    method: 'POST',
    body: JSON.stringify({ ...data, userLocale: 'ko-KR' }),
  });
};

export const fetchAllPlaces = (): Promise<Recommendation[]> => {
  return request<Recommendation[]>('/places');
};
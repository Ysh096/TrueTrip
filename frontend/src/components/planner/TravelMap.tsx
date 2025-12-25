'use client';

import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { useMemo, useCallback } from 'react';

interface Place {
  name: string;
  latitude: number | null;
  longitude: number | null;
  category?: 'SPOT' | 'ACCOMMODATION';
}

interface TravelMapProps {
  places: Place[];
  center?: { lat: number; lng: number };
  showRoute?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

export default function TravelMap({ places, center, showRoute = true }: TravelMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  // 좌표가 있는 장소들만 필터링 (0, 0 이나 null 제외)
  const validPlaces = useMemo(() => 
    places.filter(p => 
      p.latitude !== null && 
      p.longitude !== null && 
      p.latitude !== 0 && 
      p.longitude !== 0
    ) as (Place & { latitude: number; longitude: number })[], 
    [places]
  );

  // 지도 중심 계산 (모든 마커를 포함할 수 있도록 또는 첫 마커 중심)
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (validPlaces.length > 0) {
      // 데이터가 바뀌면 첫 번째 장소로 중심 이동
      return { lat: validPlaces[0].latitude, lng: validPlaces[0].longitude };
    }
    return { lat: 37.5665, lng: 126.9780 };
  }, [validPlaces, center]);

  // 동선 좌표 배열 생성
  const pathCoordinates = useMemo(() => 
    validPlaces.map(p => ({ lat: p.latitude, lng: p.longitude })),
    [validPlaces]
  );

  // 지도가 로드되었을 때 모든 마커가 보이도록 범위 조정
  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (validPlaces.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      validPlaces.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }));
      map.fitBounds(bounds);
    }
  }, [validPlaces]);

  if (!isLoaded) return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={validPlaces.length > 1 ? 11 : 14}
      onLoad={onMapLoad}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      {validPlaces.map((place, index) => (
        <Marker
          key={`${place.name}-${index}`}
          position={{ lat: place.latitude, lng: place.longitude }}
          label={{
             text: (index + 1).toString(),
             color: 'white',
             fontWeight: 'bold'
          }}
          title={place.name}
          icon={place.category === 'ACCOMMODATION' ? {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          } : {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      ))}

      {showRoute && pathCoordinates.length > 1 && (
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: '#3B82F6', // Blue-500
            strokeOpacity: 0.8,
            strokeWeight: 3,
            geodesic: true,
          }}
        />
      )}
    </GoogleMap>
  );
}

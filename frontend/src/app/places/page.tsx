'use client';

import { useEffect, useState } from 'react';

interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  namuWikiUrl: string;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/places')
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch places:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">탐색하기</h1>
          <p className="text-zinc-400">TrueTrip이 추천하는 신뢰할 수 있는 여행지들입니다.</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <div key={place.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group">
                <div className="h-48 bg-zinc-800 relative">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-bold text-xl uppercase tracking-widest">
                        {place.name}
                    </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{place.name}</h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{place.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <a 
                      href={place.namuWikiUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      나무위키 더보기
                    </a>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                      일정에 추가
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

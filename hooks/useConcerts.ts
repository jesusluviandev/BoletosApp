'use client';

import { useState, useEffect } from 'react';
import { Concert } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

export function useConcerts() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar conciertos desde localStorage
  useEffect(() => {
    const loadedConcerts = storage.get<Concert[]>(STORAGE_KEYS.CONCERTS) || [];
    setConcerts(loadedConcerts);
    setLoading(false);
  }, []);

  // Guardar conciertos en localStorage cuando cambien
  useEffect(() => {
    if (!loading) {
      storage.set(STORAGE_KEYS.CONCERTS, concerts);
    }
  }, [concerts, loading]);

  const addConcert = (concertData: Omit<Concert, 'id' | 'createdAt'>) => {
    const newConcert: Concert = {
      ...concertData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setConcerts((prev) => [...prev, newConcert]);
    return newConcert;
  };

  const updateConcert = (id: string, concertData: Partial<Omit<Concert, 'id' | 'createdAt'>>) => {
    setConcerts((prev) =>
      prev.map((concert) =>
        concert.id === id ? { ...concert, ...concertData } : concert
      )
    );
  };

  const deleteConcert = (id: string) => {
    setConcerts((prev) => prev.filter((concert) => concert.id !== id));
  };

  const getConcertById = (id: string) => {
    return concerts.find((concert) => concert.id === id);
  };

  return {
    concerts,
    loading,
    addConcert,
    updateConcert,
    deleteConcert,
    getConcertById,
  };
}

import { create } from 'zustand';
import { Language, Station } from '@/types';
import { stations as mockStations } from '@/data/mockData';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  stations: Station[];
  setStations: (stations: Station[]) => void;
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  stations: mockStations,
  setStations: (stations) => set({ stations }),
  selectedStationId: null,
  setSelectedStationId: (selectedStationId) => set({ selectedStationId }),
}));

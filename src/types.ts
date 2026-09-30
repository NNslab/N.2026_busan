export type FamilyType = 'pei_en' | 'yun_cen';

export interface ItineraryItem {
  time?: string;
  title: string;
  description?: string;
  notes?: string[];
  type: 'transport' | 'activity' | 'food' | 'hotel' | 'shopping' | 'free' | 'other';
  duration?: string;
  photoSpots?: string[];
  oathText?: string[];
}

export interface DayItinerary {
  dayNum: number;
  date: string;
  dayOfWeek: string;
  theme: string;
  items: ItineraryItem[];
}

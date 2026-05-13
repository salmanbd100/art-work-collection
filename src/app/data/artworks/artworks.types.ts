export type ArtworkSort = 'name' | 'artist' | 'date';

export interface Artwork {
  id: number;
  imageId: string | null;
  title: string;
  artist: string;
  location: string;
  startDate: number | null;
  endDate: number | null;
  materials: string[];
  styleTitles: string[];
}

export interface Page<T> {
  items: T[];
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  iiifUrl: string;
}

export interface ArtworkFilters {
  styles: string[];
}

export interface ArtworkDto {
  id: number;
  image_id: string | null;
  title: string | null;
  artist_title: string | null;
  place_of_origin: string | null;
  date_start: number | null;
  date_end: number | null;
  material_titles: string[];
  style_titles: string[];
}

export interface PaginationDto {
  total: number;
  current_page: number;
  limit: number;
  total_pages: number;
}

export interface ArtworkListResponseDto {
  data: ArtworkDto[];
  pagination: PaginationDto;
  config: {
    iiif_url: string;
  };
}

export interface ArtworkSingleResponseDto {
  data: ArtworkDto;
  config: {
    iiif_url: string;
  };
}

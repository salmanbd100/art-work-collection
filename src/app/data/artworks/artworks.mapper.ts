import { ArtworkDto, ArtworkListResponseDto } from './artworks.dto';
import { Artwork, Page } from './artworks.types';

export function toArtwork(dto: ArtworkDto): Artwork {
  return {
    id: dto.id,
    imageId: dto.image_id,
    title: dto.title ?? 'Untitled',
    artist: dto.artist_title ?? 'Unknown artist',
    location: dto.place_of_origin ?? '',
    startDate: dto.date_start,
    endDate: dto.date_end,
    materials: dto.material_titles ?? [],
    styleTitles: dto.style_titles ?? [],
  };
}

export function toPage(response: ArtworkListResponseDto): Page<Artwork> {
  return {
    items: response.data.map(toArtwork),
    total: response.pagination.total,
    currentPage: response.pagination.current_page,
    perPage: response.pagination.limit,
    totalPages: response.pagination.total_pages,
    iiifUrl: response.config.iiif_url,
  };
}

export function formatLocation(artwork: Artwork): string {
  if (!artwork.startDate && !artwork.endDate) return artwork.location;
  if (artwork.startDate === artwork.endDate) return `${artwork.location} (${artwork.startDate})`;
  return `${artwork.location} (${artwork.startDate} - ${artwork.endDate})`;
}

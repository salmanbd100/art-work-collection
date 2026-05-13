import { ArtworkDto, ArtworkListResponseDto } from './artworks.dto';
import { Artwork, Page } from './artworks.types';

export function toArtwork(dto: ArtworkDto, iiifUrl = ''): Artwork {
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
    iiifUrl,
  };
}

export function toPage(response: ArtworkListResponseDto): Page<Artwork> {
  const iiifUrl = response.config.iiif_url;
  return {
    items: response.data.map((dto) => toArtwork(dto, iiifUrl)),
    total: response.pagination.total,
    currentPage: response.pagination.current_page,
    perPage: response.pagination.limit,
    totalPages: response.pagination.total_pages,
    iiifUrl,
  };
}

export function formatLocation(artwork: Artwork): string {
  if (!artwork.startDate && !artwork.endDate) return artwork.location;
  if (artwork.startDate === artwork.endDate) return `${artwork.location} (${artwork.startDate})`;
  return `${artwork.location} (${artwork.startDate} - ${artwork.endDate})`;
}

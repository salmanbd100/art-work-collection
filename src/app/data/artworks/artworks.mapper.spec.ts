import { toArtwork, formatLocation } from './artworks.mapper';
import { ArtworkDto } from './artworks.dto';
import { Artwork } from './artworks.types';

describe('toArtwork', () => {
  it('should map all fields from DTO', () => {
    const dto: ArtworkDto = {
      id: 1,
      image_id: 'abc123',
      title: 'Starry Night',
      artist_title: 'Van Gogh',
      place_of_origin: 'Netherlands',
      date_start: 1889,
      date_end: 1889,
      material_titles: ['Oil on canvas'],
      style_titles: ['Post-Impressionism'],
    };

    const result = toArtwork(dto);

    expect(result.id).toBe(1);
    expect(result.imageId).toBe('abc123');
    expect(result.title).toBe('Starry Night');
    expect(result.artist).toBe('Van Gogh');
    expect(result.location).toBe('Netherlands');
    expect(result.startDate).toBe(1889);
    expect(result.endDate).toBe(1889);
    expect(result.materials).toEqual(['Oil on canvas']);
    expect(result.styleTitles).toEqual(['Post-Impressionism']);
  });

  it('should default null title to "Untitled"', () => {
    const dto: ArtworkDto = {
      id: 2,
      image_id: null,
      title: null,
      artist_title: null,
      place_of_origin: null,
      date_start: null,
      date_end: null,
      material_titles: [],
      style_titles: [],
    };

    const result = toArtwork(dto);

    expect(result.title).toBe('Untitled');
    expect(result.artist).toBe('Unknown artist');
    expect(result.location).toBe('');
    expect(result.imageId).toBeNull();
    expect(result.startDate).toBeNull();
    expect(result.endDate).toBeNull();
  });

  it('should preserve empty arrays for materials and styleTitles', () => {
    const dto: ArtworkDto = {
      id: 3,
      image_id: null,
      title: 'Test',
      artist_title: 'Test Artist',
      place_of_origin: 'France',
      date_start: 1900,
      date_end: 1910,
      material_titles: [],
      style_titles: [],
    };

    const result = toArtwork(dto);
    expect(result.materials).toEqual([]);
    expect(result.styleTitles).toEqual([]);
  });
});

describe('formatLocation', () => {
  function makeArtwork(overrides: Partial<Artwork>): Artwork {
    return {
      id: 1,
      imageId: null,
      title: 'Test',
      artist: 'Test',
      location: 'France',
      startDate: null,
      endDate: null,
      materials: [],
      styleTitles: [],
      ...overrides,
    };
  }

  it('should return just location when no dates', () => {
    const artwork = makeArtwork({ location: 'France', startDate: null, endDate: null });
    expect(formatLocation(artwork)).toBe('France');
  });

  it('should return location with single date when start equals end', () => {
    const artwork = makeArtwork({ location: 'France', startDate: 1900, endDate: 1900 });
    expect(formatLocation(artwork)).toBe('France (1900)');
  });

  it('should return location with date range when start and end differ', () => {
    const artwork = makeArtwork({ location: 'France', startDate: 1900, endDate: 1910 });
    expect(formatLocation(artwork)).toBe('France (1900 - 1910)');
  });

  it('should return just location when start is null but end is also null', () => {
    const artwork = makeArtwork({ location: 'Italy', startDate: null, endDate: null });
    expect(formatLocation(artwork)).toBe('Italy');
  });
});

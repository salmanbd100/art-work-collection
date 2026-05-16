import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ArtworksApi } from './artworks.api';
import { ArtworkListResponseDto, ArtworkSingleResponseDto } from './artworks.dto';

function makeDtoItem(
  overrides: Partial<{
    id: number;
    image_id: string | null;
    title: string | null;
    artist_title: string | null;
    place_of_origin: string | null;
    date_start: number | null;
    date_end: number | null;
    material_titles: string[];
    style_titles: string[];
  }> = {},
) {
  return {
    id: 1,
    image_id: 'img1',
    title: 'Monet',
    artist_title: 'Claude Monet',
    place_of_origin: 'France',
    date_start: 1900,
    date_end: 1910,
    material_titles: ['Oil'],
    style_titles: ['Impressionism'],
    ...overrides,
  };
}

const CONFIG = { iiif_url: 'https://www.artic.edu/iiif/2' };
const PAGINATION = { total: 100, limit: 8, offset: 0, total_pages: 13, current_page: 1 };

describe('ArtworksApi', () => {
  let api: ArtworksApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtworksApi, provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ArtworksApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('list()', () => {
    it('calls /artworks when query is empty', () => {
      api.list({ page: 1, perPage: 8 }).subscribe();
      const req = httpMock.expectOne(
        (r) => r.url.includes('/artworks') && !r.url.includes('/search'),
      );
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('8');
      req.flush({
        data: [],
        pagination: PAGINATION,
        config: CONFIG,
      } satisfies ArtworkListResponseDto);
    });

    it('calls /artworks/search when query is provided', () => {
      api.list({ page: 1, perPage: 8, query: 'monet' }).subscribe();
      const req = httpMock.expectOne((r) => r.url.includes('/artworks/search'));
      expect(req.request.params.get('q')).toBe('monet');
      req.flush({
        data: [],
        pagination: PAGINATION,
        config: CONFIG,
      } satisfies ArtworkListResponseDto);
    });

    it('maps response to Page<Artwork> with correct total/totalPages', async () => {
      const promise = firstValueFrom(api.list({ page: 1, perPage: 8 }));
      const req = httpMock.expectOne((r) => r.url.includes('/artworks'));
      req.flush({
        data: [makeDtoItem()],
        pagination: PAGINATION,
        config: CONFIG,
      } satisfies ArtworkListResponseDto);
      const page = await promise;
      expect(page.total).toBe(100);
      expect(page.totalPages).toBe(13);
      expect(page.items).toHaveLength(1);
      expect(page.items[0]?.title).toBe('Monet');
    });

    it('handles empty result set', async () => {
      const promise = firstValueFrom(api.list({ page: 2, perPage: 8 }));
      const req = httpMock.expectOne((r) => r.url.includes('/artworks'));
      req.flush({
        data: [],
        pagination: { total: 0, limit: 8, offset: 0, total_pages: 0, current_page: 2 },
        config: CONFIG,
      } satisfies ArtworkListResponseDto);
      const page = await promise;
      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });
  });

  describe('getById()', () => {
    it('calls /artworks/:id with correct id', () => {
      api.getById(42).subscribe();
      const req = httpMock.expectOne((r) => r.url.includes('/artworks/42'));
      req.flush({
        data: makeDtoItem({ id: 42 }),
        config: CONFIG,
      } satisfies ArtworkSingleResponseDto);
    });

    it('returns mapped artwork and iiifUrl', async () => {
      const promise = firstValueFrom(api.getById(1));
      const req = httpMock.expectOne((r) => r.url.includes('/artworks/1'));
      req.flush({ data: makeDtoItem(), config: CONFIG } satisfies ArtworkSingleResponseDto);
      const { artwork, iiifUrl } = await promise;
      expect(artwork.id).toBe(1);
      expect(artwork.title).toBe('Monet');
      expect(iiifUrl).toBe('https://www.artic.edu/iiif/2');
    });

    it('sets imageId from image_id field', async () => {
      const promise = firstValueFrom(api.getById(5));
      const req = httpMock.expectOne((r) => r.url.includes('/artworks/5'));
      req.flush({
        data: makeDtoItem({ id: 5, image_id: 'img999' }),
        config: CONFIG,
      } satisfies ArtworkSingleResponseDto);
      const { artwork } = await promise;
      expect(artwork.imageId).toBe('img999');
    });

    it('handles null image_id', async () => {
      const promise = firstValueFrom(api.getById(7));
      const req = httpMock.expectOne((r) => r.url.includes('/artworks/7'));
      req.flush({
        data: makeDtoItem({ id: 7, image_id: null }),
        config: CONFIG,
      } satisfies ArtworkSingleResponseDto);
      const { artwork } = await promise;
      expect(artwork.imageId).toBeNull();
    });
  });
});

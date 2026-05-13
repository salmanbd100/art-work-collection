import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environment';
import { ArtworkListResponseDto, ArtworkSingleResponseDto } from './artworks.dto';
import { toPage, toArtwork } from './artworks.mapper';
import { Artwork, Page } from './artworks.types';

export interface ArtworkListInput {
  page: number;
  perPage: number;
  query?: string;
}

const FIELDS =
  'id,title,artist_title,date_display,material_titles,date_start,date_end,place_of_origin,image_id,style_titles';

@Injectable({ providedIn: 'root' })
export class ArtworksApi {
  private http = inject(HttpClient);

  list(input: ArtworkListInput): Observable<Page<Artwork>> {
    const params: Record<string, string | number> = {
      fields: FIELDS,
      page: input.page,
      limit: input.perPage,
    };
    if (input.query) {
      params['q'] = input.query;
    }
    const endpoint = input.query
      ? `${environment.artWork}/artworks/search`
      : `${environment.artWork}/artworks`;
    return this.http.get<ArtworkListResponseDto>(endpoint, { params }).pipe(map(toPage));
  }

  getById(id: number): Observable<{ artwork: Artwork; iiifUrl: string }> {
    return this.http
      .get<ArtworkSingleResponseDto>(`${environment.artWork}/artworks/${id}`, {
        params: { fields: FIELDS },
      })
      .pipe(
        map((r) => ({
          artwork: toArtwork(r.data, r.config.iiif_url),
          iiifUrl: r.config.iiif_url,
        })),
      );
  }
}

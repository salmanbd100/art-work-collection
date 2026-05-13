import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environment';
import { ArtworkListResponseDto } from './artworks.dto';
import { toPage } from './artworks.mapper';
import { Artwork, Page } from './artworks.types';

export interface ArtworkListInput {
  page: number;
  perPage: number;
}

const FIELDS =
  'id,title,artist_title,date_display,material_titles,date_start,date_end,place_of_origin,image_id,style_titles';

@Injectable({ providedIn: 'root' })
export class ArtworksApi {
  private http = inject(HttpClient);

  list(input: ArtworkListInput): Observable<Page<Artwork>> {
    return this.http
      .get<ArtworkListResponseDto>(`${environment.artWork}/artworks`, {
        params: { fields: FIELDS, page: input.page, limit: input.perPage },
      })
      .pipe(map(toPage));
  }
}

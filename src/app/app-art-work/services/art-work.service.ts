import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "@environment";

interface ArtWorkListParams {
  fields: string;
  page: number;
  limit: number;
}

interface RawArtWork {
  id: string;
  image_id: string | null;
  title: string | null;
  artist_title: string | null;
  place_of_origin: string | null;
  date_start: string | null;
  date_end: string | null;
  material_titles: string[] | null;
  style_titles: string[] | null;
}

interface ArtWorkListResponse {
  data: RawArtWork[];
  pagination: {
    total: number;
    current_page: number;
    limit: number;
  };
  config: {
    iiif_url: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArtWorkService {

  constructor(private httpClient: HttpClient) {
  }

  GetArtWorkList(params: ArtWorkListParams) {
    const url = environment.artWork + '/artworks';
    return this.httpClient.get<ArtWorkListResponse>(url, { params: { ...params } });
  }
}

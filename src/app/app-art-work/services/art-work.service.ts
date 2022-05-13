import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "@environment";


@Injectable({
  providedIn: 'root'
})
export class ArtWorkService {

  constructor(private httpClient: HttpClient) {
  }

  GetArtWorkList(params: any) {
    const url = environment.artWork + '/artworks';
    return this.httpClient.get(url, { params: { ...params } })
  }
}

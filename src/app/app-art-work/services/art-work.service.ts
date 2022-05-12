import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@environment";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ArtWorkService {

  constructor(private httpClient: HttpClient) { }

  GetArtWorkList() {
    const url = environment.artWork;
  }
}

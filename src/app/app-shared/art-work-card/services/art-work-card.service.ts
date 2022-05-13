import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ArtWorkCardService {

  constructor() {
  }

  IsExistArtWorkImage(imageUrl: string) {
    const http = new XMLHttpRequest();

    http.open('HEAD', imageUrl, false);
    http.send();

    return http.status != 404;
  }
}

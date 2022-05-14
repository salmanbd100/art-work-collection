import { Injectable } from '@angular/core';
import { ArtWorksInterface } from "../interfaces/art-works.interface";

@Injectable({
  providedIn: 'root'
})
export class SortUtilityService {

  constructor() { }

  SortByArtist(a: ArtWorksInterface, b: ArtWorksInterface) {
    // @ts-ignore
    if (a?.artist?.toLowerCase() < b?.artist?.toLowerCase()) {
      return -1;
    } else { // @ts-ignore
      if(a?.artist?.toLowerCase() > b?.artist?.toLowerCase()) {
            return 1;
          }
    }
    return 0
  }

  SortByName(a: ArtWorksInterface, b: ArtWorksInterface) {
    // @ts-ignore
    if (a?.name?.toLowerCase() < b?.name?.toLowerCase()) {
      return -1;
    } else { // @ts-ignore
      if(a?.name?.toLowerCase() > b?.name?.toLowerCase()) {
        return 1;
      }
    }
    return 0
  }

  SortByDate(a: ArtWorksInterface, b: ArtWorksInterface) {
    // @ts-ignore
    if (a?.startDate < b?.startDate) {
      return -1;
    } else { // @ts-ignore
      if(a?.startDate > b?.startDate) {
        return 1;
      }
    }
    return 0
  }
}

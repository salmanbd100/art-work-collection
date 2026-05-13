import { Injectable } from '@angular/core';
import { ArtWorksInterface } from "../interfaces/art-works.interface";

@Injectable({
  providedIn: 'root'
})
export class SortUtilityService {

  SortByArtist(a: ArtWorksInterface, b: ArtWorksInterface): number {
    const aVal = a.artist?.toLowerCase() ?? '';
    const bVal = b.artist?.toLowerCase() ?? '';
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  }

  SortByName(a: ArtWorksInterface, b: ArtWorksInterface): number {
    const aVal = a.name?.toLowerCase() ?? '';
    const bVal = b.name?.toLowerCase() ?? '';
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  }

  SortByDate(a: ArtWorksInterface, b: ArtWorksInterface): number {
    const aVal = a.startDate ?? '';
    const bVal = b.startDate ?? '';
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  }
}

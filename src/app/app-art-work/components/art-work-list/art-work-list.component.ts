import { Component, OnInit } from '@angular/core';
import { ArtWorkService } from "../../services/art-work.service";
import { ArtWorksInterface } from "../../interfaces/art-works.interface";

@Component({
  selector: 'app-art-work-list',
  templateUrl: './art-work-list.component.html',
  styleUrls: ['./art-work-list.component.scss']
})
export class ArtWorkListComponent implements OnInit {

  artWorks: ArtWorksInterface[] = []

  constructor(private artWorkService: ArtWorkService) {
  }

  ngOnInit(): void {
    this.getArtWorkList();
  }

  getArtWorkList() {
    const query = {
      fields: 'id,title,artist_title,date_display,material_titles,date_start,date_end,place_of_origin',
      page: 1,
      limit: 8,
    }
    this.artWorkService.GetArtWorkList(query).subscribe((response: any) => {
      if (response?.data?.length) {
        response.data.forEach((artData: any) => {
          this.artWorks.push({
            id: artData.id,
            image: '',
            name: artData.title,
            artist: artData.artist_title,
            location: artData.place_of_origin,
            startDate: artData.date_start,
            endDate: artData.date_end,
            materials: artData.material_titles,
          })
        })
      }
    })
  }

}

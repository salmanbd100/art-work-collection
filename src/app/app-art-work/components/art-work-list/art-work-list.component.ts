import { Component, OnInit } from '@angular/core';
import { ArtWorkService } from "../../services/art-work.service";
import { ArtWorksInterface } from "../../interfaces/art-works.interface";

@Component({
  selector: 'app-art-work-list',
  templateUrl: './art-work-list.component.html',
  styleUrls: ['./art-work-list.component.scss']
})
export class ArtWorkListComponent implements OnInit {

  artWorks: ArtWorksInterface[] = [];
  iiifUrl: string = '';

  isDataLoading: boolean = false;

  // pagination variable
  count: number = 210;
  page: number = 1;
  perPage: number = 8;

  constructor(private artWorkService: ArtWorkService) {
  }

  ngOnInit(): void {
    this.getArtWorkList();
  }

  getArtWorkList() {
    this.isDataLoading = true;
    const query = {
      fields: 'id,title,artist_title,date_display,material_titles,date_start,date_end,place_of_origin,image_id',
      page: this.page,
      limit: this.perPage,
    }
    this.artWorkService.GetArtWorkList(query).subscribe((response: any) => {
      if (response?.data?.length) {
        this.count = response?.pagination?.total;
        this.page = response?.pagination?.current_page;
        this.perPage = response?.pagination?.limit;
        this.iiifUrl = response?.config?.iiif_url;
        this.artWorks = [];
        response.data.forEach((artData: any) => {
          this.artWorks.push({
            id: artData.id,
            imageId: artData?.image_id,
            name: artData.title,
            artist: artData.artist_title,
            location: artData.place_of_origin,
            startDate: artData.date_start,
            endDate: artData.date_end,
            materials: artData.material_titles,
          })
        })
        this.isDataLoading = false;
      }
    })
  }


  prevPage() {
    this.page--;
    this.getArtWorkList();
  }

  nextPage() {
    this.page++;
    this.getArtWorkList();
  }

  goToPage(n: number) {
    this.page = n;
    this.getArtWorkList();
  }

}

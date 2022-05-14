import { Component, OnInit } from '@angular/core';
import { ArtWorkService } from "../../services/art-work.service";
import { ArtWorksInterface, SelectTitleOptionInterface } from "../../interfaces/art-works.interface";
import { SortUtilityService } from "../../services/sort-utility.service";

@Component({
  selector: 'app-art-work-list',
  templateUrl: './art-work-list.component.html',
  styleUrls: ['./art-work-list.component.scss']
})
export class ArtWorkListComponent implements OnInit {

  artWorks: ArtWorksInterface[] = [];
  isDataLoading: boolean = false;

  // Image root url
  iiifUrl: string = '';

  // Sort
  sortBy: string = '';
  sortOptions = ['Name', 'Artist', 'Date'];

  // Filter
  modelWithFilter: any[] = [];
  styleTitleOptions: SelectTitleOptionInterface[] = [];
  isFilter: boolean = false;
  isFilteredArtWorks: ArtWorksInterface[] = [];

  // pagination variable
  count: number = 210;
  page: number = 1;
  perPage: number = 8;

  constructor(private artWorkService: ArtWorkService,
              private sortUtilityService: SortUtilityService) {
  }

  ngOnInit(): void {
    this.getArtWorkList();
  }

  private _formatArtWorkData(artWorkData: any) {
    artWorkData.forEach((artData: any) => {
      this.artWorks.push({
        id: artData.id,
        imageId: artData?.image_id,
        name: artData.title,
        artist: artData.artist_title,
        location: artData.place_of_origin,
        startDate: artData.date_start,
        endDate: artData.date_end,
        materials: artData.material_titles,
        styleTitles: artData.style_titles,
      })
    })
  }

  private _sortArtWorkerData() {
    if (this.sortBy === 'ARTIST') {
      this.artWorks.sort(this.sortUtilityService.SortByArtist)
    }
    if (this.sortBy === 'NAME') {
      this.artWorks.sort(this.sortUtilityService.SortByName)
    }
    if (this.sortBy === 'DATE') {
      this.artWorks.sort(this.sortUtilityService.SortByDate)
    }
  }

  getArtWorkList() {
    this.isDataLoading = true;
    const query = {
      fields: 'id,title,artist_title,date_display,material_titles,date_start,date_end,place_of_origin,image_id,style_titles',
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
        this._formatArtWorkData(response.data);
        this._formatStyleTitleFilter();
        if (this.sortBy) {
          this._sortArtWorkerData();
        }
        this.isDataLoading = false;
      }
    })
  }

  private _clearStyleFilter() {
    this.isFilteredArtWorks = [];
    this.isFilter = false;
    this.styleTitleOptions = [];
  }


  prevPage() {
    this.page--;
    this.getArtWorkList();
    this._clearStyleFilter();
  }

  nextPage() {
    this.page++;
    this.getArtWorkList();
    this._clearStyleFilter();
  }

  goToPage(n: number) {
    this.page = n;
    this.getArtWorkList();
    this._clearStyleFilter();
  }

  private _formatStyleTitleFilter() {
    this.styleTitleOptions = [];
    let styleTitles: string[] = []
    this.artWorks.forEach((artWork: ArtWorksInterface) => {
      if (artWork.styleTitles?.length) {
        styleTitles = [...styleTitles, ...artWork.styleTitles]
      }
    })

    let keys: string[] = [];
    let titleDictionary: any = {};
    styleTitles.forEach((title: string) => {
      if (keys.indexOf(title) >= 0) {
        titleDictionary[title]++;
      } else {
        titleDictionary[title] = 1;
        keys.push(title);
      }
    })

    keys.forEach((key: string) => {
      this.styleTitleOptions.push(
        {
          styleTitle: key,
          numberOfItem: titleDictionary[key]
        }
      )
    })
  }

  selectLabel(option: SelectTitleOptionInterface): string {
    return `${option.styleTitle} (${option.numberOfItem})`;
  }

  selectValue(option: SelectTitleOptionInterface): string {
    return option.styleTitle;
  }

  onStyleFilterChange(filterKeys: string[]) {
    this.isFilteredArtWorks = [];
    this.sortBy = '';
    if (filterKeys.length === 0) {
      this.isFilteredArtWorks = this.artWorks;
    } else {
      this.isFilter = true;
      this.isFilteredArtWorks = this.artWorks.filter((item: ArtWorksInterface) => {
        // @ts-ignore
        const arr = filterKeys.filter(x => item.styleTitles.includes(x));
        return arr.length > 0;
      })
      // this.artWorks.forEach((artWork: ArtWorksInterface) => {
      //   if (artWork.styleTitles?.length !== 0) {
      //     artWork.styleTitles?.forEach((key: string) => {
      //       $event.forEach((eventKey: string) => {
      //         if (key === eventKey) {
      //           this.isFilteredArtWorks.push(artWork);
      //         }
      //       })
      //     })
      //   }
      // })
    }
  }

  onChangeSortBy($event: any) {
    this._clearStyleFilter();
    this.sortBy = $event.value.toUpperCase();
    this._sortArtWorkerData();
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ArtWorksInterface } from "../../../../app-art-work/interfaces/art-works.interface";
import { ArtWorkCardService } from "../../services/art-work-card.service";
import { environment } from "@environment";

@Component({
  selector: 'art-work-card',
  templateUrl: './art-work-card.component.html',
  styleUrls: ['./art-work-card.component.scss']
})
export class ArtWorkCardComponent implements OnInit {
  @Input() artWork: ArtWorksInterface = {};
  @Input() iiifUrl: string = '';

  imageUrl: string = '';

  artWorkLocation: string | undefined = '';

  constructor(private artWorkCardService: ArtWorkCardService) {
  }

  ngOnInit(): void {
    this._formatArtWorkLocation();
    this._getArtWorkImageUrl();
  }

  _formatArtWorkLocation() {
    if (!this.artWork.startDate && !this.artWork.endDate) {
      this.artWorkLocation = this.artWork.location;
      return;
    }
    if (this.artWork.startDate === this.artWork.endDate) {
      this.artWorkLocation = `${this.artWork.location} (${this.artWork.startDate})`;
      return;
    }
    if (this.artWork.startDate === this.artWork.endDate) {
      this.artWorkLocation = `${this.artWork.location} (${this.artWork.startDate} - ${this.artWork.endDate})`;
      return;
    }
  }


  _getArtWorkImageUrl() {
    const orginalImageUrl = `${this.iiifUrl}/${this.artWork.imageId}/full/300,/0/default.jpg`

    const isExistImage = this.artWorkCardService.IsExistArtWorkImage(orginalImageUrl);
    this.imageUrl = isExistImage ? orginalImageUrl: environment.defaultImageUrl;
  }

  onImageLoadError($event: ErrorEvent) {
    this.imageUrl = environment.defaultImageUrl;
  }
}

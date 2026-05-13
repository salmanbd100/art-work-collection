import { Component, OnInit, Input, inject } from '@angular/core';
import { ArtWorksInterface } from '../../../../app-art-work/interfaces/art-works.interface';
import { ArtWorkCardService } from '../../services/art-work-card.service';
import { environment } from '@environment';
import {
  MatCard,
  MatCardImage,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
  selector: 'app-art-work-card',
  templateUrl: './art-work-card.component.html',
  styleUrls: ['./art-work-card.component.scss'],
  imports: [MatCard, MatCardImage, MatCardHeader, MatCardTitle, MatCardContent],
})
export class ArtWorkCardComponent implements OnInit {
  private artWorkCardService = inject(ArtWorkCardService);

  @Input() artWork: ArtWorksInterface = {};
  @Input() iiifUrl = '';

  imageUrl = '';
  artWorkLocation: string | undefined = '';

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
    this.artWorkLocation = `${this.artWork.location} (${this.artWork.startDate} - ${this.artWork.endDate})`;
  }

  _getArtWorkImageUrl() {
    const originalImageUrl = `${this.iiifUrl}/${this.artWork.imageId}/full/300,/0/default.jpg`;
    const isExistImage = this.artWorkCardService.IsExistArtWorkImage(originalImageUrl);
    this.imageUrl = isExistImage ? originalImageUrl : environment.defaultImageUrl;
  }

  onImageLoadError() {
    this.imageUrl = environment.defaultImageUrl;
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ArtWorksInterface } from "../../../../app-art-work/interfaces/art-works.interface";

@Component({
  selector: 'art-work-card',
  templateUrl: './art-work-card.component.html',
  styleUrls: ['./art-work-card.component.scss']
})
export class ArtWorkCardComponent implements OnInit {
  @Input() artWork: ArtWorksInterface = {};

  artWorkLocation: string | undefined = '';

  constructor() {
  }

  ngOnInit(): void {
    this._formatArtWorkLocation();
    console.log(this.artWork)
    console.log(this.artWorkLocation)
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

}

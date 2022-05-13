import { TestBed } from '@angular/core/testing';

import { ArtWorkCardService } from './art-work-card.service';

describe('ArtWorkCardService', () => {
  let service: ArtWorkCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtWorkCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

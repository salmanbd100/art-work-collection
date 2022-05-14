import { TestBed } from '@angular/core/testing';

import { SortUtilityService } from './sort-utility.service';

describe('SortUtilityService', () => {
  let service: SortUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

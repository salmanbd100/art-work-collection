import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtWorkListComponent } from './art-work-list.component';

describe('ArtWorkListComponent', () => {
  let component: ArtWorkListComponent;
  let fixture: ComponentFixture<ArtWorkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtWorkListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

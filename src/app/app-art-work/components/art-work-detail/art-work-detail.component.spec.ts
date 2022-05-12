import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtWorkDetailComponent } from './art-work-detail.component';

describe('ArtWorkDetailComponent', () => {
  let component: ArtWorkDetailComponent;
  let fixture: ComponentFixture<ArtWorkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtWorkDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtWorkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

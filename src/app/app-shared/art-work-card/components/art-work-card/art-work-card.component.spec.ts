import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtWorkCardComponent } from './art-work-card.component';

describe('ArtWorkCardComponent', () => {
  let component: ArtWorkCardComponent;
  let fixture: ComponentFixture<ArtWorkCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtWorkCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtWorkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

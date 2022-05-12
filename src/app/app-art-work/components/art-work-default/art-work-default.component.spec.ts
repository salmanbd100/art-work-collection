import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtWorkDefaultComponent } from './art-work-default.component';

describe('ArtWorkDefaultComponent', () => {
  let component: ArtWorkDefaultComponent;
  let fixture: ComponentFixture<ArtWorkDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtWorkDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtWorkDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

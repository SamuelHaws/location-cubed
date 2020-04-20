import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerMapComponent } from './markermap.component';

describe('MapComponent', () => {
  let component: MarkerMapComponent;
  let fixture: ComponentFixture<MarkerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarkerMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

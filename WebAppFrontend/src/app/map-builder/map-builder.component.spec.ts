import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBuilderComponent } from './map-builder.component';

describe('MapBuilderComponent', () => {
  let component: MapBuilderComponent;
  let fixture: ComponentFixture<MapBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

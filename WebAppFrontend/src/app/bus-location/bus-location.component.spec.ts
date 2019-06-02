import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusLocationComponent } from './bus-location.component';

describe('BusLocationComponent', () => {
  let component: BusLocationComponent;
  let fixture: ComponentFixture<BusLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

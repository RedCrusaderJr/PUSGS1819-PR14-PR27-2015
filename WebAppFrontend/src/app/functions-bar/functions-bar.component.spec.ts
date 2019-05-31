import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionsBarComponent } from './functions-bar.component';

describe('FunctionsBarComponent', () => {
  let component: FunctionsBarComponent;
  let fixture: ComponentFixture<FunctionsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionsBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

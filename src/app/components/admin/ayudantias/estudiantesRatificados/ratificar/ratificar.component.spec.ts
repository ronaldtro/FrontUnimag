import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatificarComponent } from './ratificar.component';

describe('RatificarComponent', () => {
  let component: RatificarComponent;
  let fixture: ComponentFixture<RatificarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatificarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

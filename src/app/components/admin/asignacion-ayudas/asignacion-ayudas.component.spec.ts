import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAyudasComponent } from './asignacion-ayudas.component';

describe('AsignacionAyudasComponent', () => {
  let component: AsignacionAyudasComponent;
  let fixture: ComponentFixture<AsignacionAyudasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionAyudasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAyudasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

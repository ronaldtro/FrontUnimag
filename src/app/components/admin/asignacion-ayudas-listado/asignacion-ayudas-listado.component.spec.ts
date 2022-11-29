import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAyudasListadoComponent } from './asignacion-ayudas-listado.component';

describe('AsignacionAyudasListadoComponent', () => {
  let component: AsignacionAyudasListadoComponent;
  let fixture: ComponentFixture<AsignacionAyudasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionAyudasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionAyudasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEntregasConvocatoriasComponent } from './reporte-entregas-convocatorias.component';

describe('ReporteEntregasConvocatoriasComponent', () => {
  let component: ReporteEntregasConvocatoriasComponent;
  let fixture: ComponentFixture<ReporteEntregasConvocatoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteEntregasConvocatoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEntregasConvocatoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

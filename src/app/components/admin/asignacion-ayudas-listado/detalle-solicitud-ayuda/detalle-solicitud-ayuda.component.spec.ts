import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitudAyudaComponent } from './detalle-solicitud-ayuda.component';

describe('DetalleSolicitudAyudaComponent', () => {
  let component: DetalleSolicitudAyudaComponent;
  let fixture: ComponentFixture<DetalleSolicitudAyudaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleSolicitudAyudaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolicitudAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

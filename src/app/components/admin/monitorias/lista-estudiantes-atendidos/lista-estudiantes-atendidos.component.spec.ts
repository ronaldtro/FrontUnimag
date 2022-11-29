import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEstudiantesAtendidosComponent } from './lista-estudiantes-atendidos.component';

describe('ListaEstudiantesAtendidosComponent', () => {
  let component: ListaEstudiantesAtendidosComponent;
  let fixture: ComponentFixture<ListaEstudiantesAtendidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEstudiantesAtendidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEstudiantesAtendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

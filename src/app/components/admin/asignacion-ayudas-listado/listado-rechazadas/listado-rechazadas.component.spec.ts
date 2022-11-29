import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoRechazadasComponent } from './listado-rechazadas.component';

describe('ListadoRechazadasComponent', () => {
  let component: ListadoRechazadasComponent;
  let fixture: ComponentFixture<ListadoRechazadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoRechazadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoRechazadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

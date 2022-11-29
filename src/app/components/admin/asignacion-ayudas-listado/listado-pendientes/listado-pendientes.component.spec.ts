import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPendientesComponent } from './listado-pendientes.component';

describe('ListadoPendientesComponent', () => {
  let component: ListadoPendientesComponent;
  let fixture: ComponentFixture<ListadoPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

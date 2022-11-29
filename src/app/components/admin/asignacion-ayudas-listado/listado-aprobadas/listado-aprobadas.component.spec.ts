import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAprobadasComponent } from './listado-aprobadas.component';

describe('ListadoAprobadasComponent', () => {
  let component: ListadoAprobadasComponent;
  let fixture: ComponentFixture<ListadoAprobadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAprobadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAprobadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

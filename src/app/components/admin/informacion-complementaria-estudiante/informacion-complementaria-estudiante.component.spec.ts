import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionComplementariaEstudianteComponent } from './informacion-complementaria-estudiante.component';

describe('InformacionComplementariaEstudianteComponent', () => {
  let component: InformacionComplementariaEstudianteComponent;
  let fixture: ComponentFixture<InformacionComplementariaEstudianteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionComplementariaEstudianteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionComplementariaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

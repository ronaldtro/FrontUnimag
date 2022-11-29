import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestasRefrigeriosListarComponent } from './encuestas-refrigerios-listar.component';

describe('EncuestasRefrigeriosListarComponent', () => {
  let component: EncuestasRefrigeriosListarComponent;
  let fixture: ComponentFixture<EncuestasRefrigeriosListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestasRefrigeriosListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestasRefrigeriosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

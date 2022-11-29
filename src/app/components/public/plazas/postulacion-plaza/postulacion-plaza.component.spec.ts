import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulacionPlazaComponent } from './postulacion-plaza.component';

describe('PostulacionPlazaComponent', () => {
  let component: PostulacionPlazaComponent;
  let fixture: ComponentFixture<PostulacionPlazaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostulacionPlazaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostulacionPlazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

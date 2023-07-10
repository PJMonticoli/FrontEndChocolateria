import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPromocionesComponent } from './listado-promociones.component';

describe('ListadoPromocionesComponent', () => {
  let component: ListadoPromocionesComponent;
  let fixture: ComponentFixture<ListadoPromocionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPromocionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPromocionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

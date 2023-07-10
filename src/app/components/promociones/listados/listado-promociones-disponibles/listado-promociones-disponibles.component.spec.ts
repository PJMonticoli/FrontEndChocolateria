import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPromocionesDisponiblesComponent } from './listado-promociones-disponibles.component';

describe('ListadoPromocionesDisponiblesComponent', () => {
  let component: ListadoPromocionesDisponiblesComponent;
  let fixture: ComponentFixture<ListadoPromocionesDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPromocionesDisponiblesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPromocionesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

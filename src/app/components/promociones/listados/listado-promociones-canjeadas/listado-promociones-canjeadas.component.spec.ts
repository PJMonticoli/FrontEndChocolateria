import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPromocionesCanjeadasComponent } from './listado-promociones-canjeadas.component';

describe('ListadoPromocionesCanjeadasComponent', () => {
  let component: ListadoPromocionesCanjeadasComponent;
  let fixture: ComponentFixture<ListadoPromocionesCanjeadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPromocionesCanjeadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPromocionesCanjeadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPedidosPendientesComponent } from './listado-pedidos-pendientes.component';

describe('ListadoPedidosPendientesComponent', () => {
  let component: ListadoPedidosPendientesComponent;
  let fixture: ComponentFixture<ListadoPedidosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPedidosPendientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPedidosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

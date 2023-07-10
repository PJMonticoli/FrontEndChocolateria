import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPedidosPropiosComponent } from './listado-pedidos-propios.component';

describe('ListadoPedidosPropiosComponent', () => {
  let component: ListadoPedidosPropiosComponent;
  let fixture: ComponentFixture<ListadoPedidosPropiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPedidosPropiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPedidosPropiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

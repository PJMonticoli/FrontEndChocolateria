import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPromocionCanjeadaComponent } from './detalles-promocion-canjeada.component';

describe('DetallesPromocionCanjeadaComponent', () => {
  let component: DetallesPromocionCanjeadaComponent;
  let fixture: ComponentFixture<DetallesPromocionCanjeadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesPromocionCanjeadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPromocionCanjeadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

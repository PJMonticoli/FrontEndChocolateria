import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaStockComponent } from './alta-stock.component';

describe('AltaStockComponent', () => {
  let component: AltaStockComponent;
  let fixture: ComponentFixture<AltaStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

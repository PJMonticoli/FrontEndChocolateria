import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPromocionComponent } from './alta-promocion.component';

describe('AltaPromocionComponent', () => {
  let component: AltaPromocionComponent;
  let fixture: ComponentFixture<AltaPromocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaPromocionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaPromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

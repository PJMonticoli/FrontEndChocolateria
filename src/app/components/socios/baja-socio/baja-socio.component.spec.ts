import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaSocioComponent } from './baja-socio.component';

describe('BajaSocioComponent', () => {
  let component: BajaSocioComponent;
  let fixture: ComponentFixture<BajaSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BajaSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

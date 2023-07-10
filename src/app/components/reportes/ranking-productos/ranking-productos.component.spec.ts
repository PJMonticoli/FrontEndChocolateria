import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingProductosComponent } from './ranking-productos.component';

describe('RankingProductosComponent', () => {
  let component: RankingProductosComponent;
  let fixture: ComponentFixture<RankingProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingProductosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

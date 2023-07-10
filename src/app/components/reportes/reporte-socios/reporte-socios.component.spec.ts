import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSociosComponent } from './reporte-socios.component';

describe('ReporteSociosComponent', () => {
  let component: ReporteSociosComponent;
  let fixture: ComponentFixture<ReporteSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSociosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

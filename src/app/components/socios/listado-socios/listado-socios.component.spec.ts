import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSociosComponent } from './listado-socios.component';

describe('ListadoSociosComponent', () => {
  let component: ListadoSociosComponent;
  let fixture: ComponentFixture<ListadoSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoSociosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

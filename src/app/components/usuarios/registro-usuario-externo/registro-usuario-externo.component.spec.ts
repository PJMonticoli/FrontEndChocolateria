import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioExternoComponent } from './registro-usuario-externo.component';

describe('RegistroUsuarioExternoComponent', () => {
  let component: RegistroUsuarioExternoComponent;
  let fixture: ComponentFixture<RegistroUsuarioExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroUsuarioExternoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUsuarioExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementoProductoComponent } from './elemento-producto.component';

describe('ElementoProductoComponent', () => {
  let component: ElementoProductoComponent;
  let fixture: ComponentFixture<ElementoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementoProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

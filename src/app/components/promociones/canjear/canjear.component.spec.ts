import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanjearComponent } from './canjear.component';

describe('CanjearComponent', () => {
  let component: CanjearComponent;
  let fixture: ComponentFixture<CanjearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanjearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanjearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

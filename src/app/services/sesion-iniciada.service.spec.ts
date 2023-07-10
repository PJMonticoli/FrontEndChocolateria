import { TestBed } from '@angular/core/testing';

import { SesionIniciadaService } from './sesion-iniciada.service';

describe('SesionIniciadaService', () => {
  let service: SesionIniciadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SesionIniciadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

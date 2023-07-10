import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
@Injectable()
export class SesionIniciadaService {

  private sesionSubject : Subject<boolean>;
  constructor(http : HttpClient) { 
    this.sesionSubject = new Subject<boolean>;
  }

  cambiarEstadoSesion(x : boolean) {
    this.sesionSubject.next(x);
  }

  sesionCambio = (): Observable<boolean> => this.sesionSubject.asObservable();
}

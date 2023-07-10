import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoGenerico } from '../models/resultado-generico';

@Injectable()
export class TipoPagoService {
  private API_URL : string = 'http://localhost:3000/tiposPago/';
  constructor(private http : HttpClient) { }
  
  obtenerTodos(): Observable<ResultadoGenerico>{
    return this.http.get<ResultadoGenerico>(this.API_URL);
  }
}

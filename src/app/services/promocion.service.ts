import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DtoPromociones } from '../models/dto-promociones';
import { Promocion } from '../models/promocion';
import { ResultadoGenerico } from '../models/resultado-generico';

@Injectable()
export class PromocionService {

  constructor(private http : HttpClient) { }
  private API_URL : string = 'http://localhost:3000/promociones/';

  agregar(promocion : Promocion) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
  const requestOptions = { headers: headers };
   return this.http.post<ResultadoGenerico>(this.API_URL,promocion,requestOptions);
  }

  obtenerTodas() : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    const requestOptions = { headers : headers };
    return this.http.get<ResultadoGenerico>(this.API_URL,requestOptions);
  }

  eliminar(promocion : Promocion) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    const requestOptions = { headers : headers };
    return this.http.delete<ResultadoGenerico>(this.API_URL +promocion.id ,requestOptions);
  }

  obtenerDisponibles() : Observable<ResultadoGenerico>{
    return this.http.get<ResultadoGenerico>(this.API_URL+ 'disponibles');
  }

  canjear(promocion : Promocion) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL+'canjear',promocion,requestOptions);
  }

  obtenerCanjeadas() : Observable<DtoPromociones[]>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    const requestOptions = { headers : headers };
    return this.http.get<DtoPromociones[]>(this.API_URL + 'canjeadas',requestOptions);
  }

  obtenerDetalles(id: number): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL + 'detalles/' + id, requestOptions);
  }

  reportePromociones(body: any): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL+'reportePromocion',body,requestOptions);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { ResultadoGenerico } from '../models/resultado-generico';

@Injectable()
export class PedidoService {
  private API_URL: string = 'http://localhost:3000/pedidos/';
  constructor(private http : HttpClient) { }

  agregar(pedido: Pedido): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });

    const requestOptions = { headers: headers };

    if (auth_token) {
      return this.http.post<ResultadoGenerico>(this.API_URL, pedido, requestOptions);
    } else {
      return this.http.post<ResultadoGenerico>(this.API_URL + 'sinLogin', pedido);
    }
  }

  obtenerTodos() : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });

    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL,requestOptions)
  }

  obtenerPendientes(): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL+'pendientes', requestOptions);
  }
  obtenerPropios(): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL+'propios', requestOptions);
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
  actualizarEstado(body: any){
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.put<ResultadoGenerico>(this.API_URL + 'estado',body, requestOptions);
  }
  cancelar(id: number){
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`

    });
    const requestOptions = { headers: headers };
    return this.http.delete<ResultadoGenerico>(this.API_URL + id, requestOptions);
  }

}

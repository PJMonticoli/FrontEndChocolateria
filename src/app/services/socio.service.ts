import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoGenerico } from '../models/resultado-generico';
import { Socio } from '../models/socio';

@Injectable()
export class SocioService {
  private API_URL : string = 'http://localhost:3000/socios/';
  constructor(private http : HttpClient) { }

  agregar (socio : Socio) : Observable<ResultadoGenerico>{
    return this.http.post<ResultadoGenerico>(this.API_URL,socio);
  }

  obtenerTodos(): Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL,requestOptions);
  }

  eliminar(socio : Socio) : Observable<any>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers }
    return this.http.delete(this.API_URL+socio.id,requestOptions);
  }

  obtenerDetallesSocio(idSocio: number): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL + idSocio, requestOptions);
  }

  modificar(body : Socio) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.put<ResultadoGenerico>(this.API_URL,body,requestOptions);
   }

   getSocioById(idSocio : number) : Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
      return this.http.get<ResultadoGenerico>(this.API_URL +idSocio,requestOptions);
   }

   
   obtenerPuntosDelSocio() : Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
      return this.http.get<ResultadoGenerico>(this.API_URL+'puntos',requestOptions);
   }


   existeSocioConDNI(dni:number): Observable<boolean> {
    return this.http.get<boolean>(this.API_URL+'existe?dni='+dni);
   }

   sociosNuevos(body : any) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL + 'nuevos' ,body,requestOptions);
   }

   sociosBaja(body : any) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL + 'bajas' ,body,requestOptions);
   }

   sociosConMasPedidos(body : any) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL + 'pedidos',body, requestOptions);
   }

   getSociosConMasPuntos(limite : number) : Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
      return this.http.get<ResultadoGenerico>(this.API_URL + 'reportePuntos/' + limite,requestOptions);
   }
}

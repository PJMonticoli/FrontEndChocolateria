import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoGenerico } from '../models/resultado-generico';
import { UsuarioLogin } from '../models/usuario-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class UsuarioService {

  private API_URL : string = 'http://localhost:3000/usuarios/';
  constructor(private http : HttpClient) { }

  login(usuario: UsuarioLogin): Observable<ResultadoGenerico> {
    return this.http.post<ResultadoGenerico>(this.API_URL+ 'iniciarSesion',usuario);
  }

  obtenerRol() : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get<ResultadoGenerico>(this.API_URL +'rol',requestOptions);
  }

  existeSocioConDNI(dni : number): Observable<boolean> {
    return this.http.get<boolean>(this.API_URL+'exists?dni='+dni);
   }

   registrarUsuExterno(usuario : UsuarioLogin) : Observable<ResultadoGenerico>{
    return this.http.post<ResultadoGenerico>(this.API_URL+ 'nuevoUsuarioSocio', usuario);
   }

   modificarClave(usuario : UsuarioLogin) : Observable<ResultadoGenerico>{
    return this.http.put<ResultadoGenerico>(this.API_URL+ 'nuevaClave',usuario);
   }

   eliminarUsuario(idUsuario : number) : Observable<any>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers }
    return this.http.delete(this.API_URL+idUsuario,requestOptions);
  }
}

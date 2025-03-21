import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeContacto } from '../models/mensaje-contacto';
import { ResultadoGenerico } from '../models/resultado-generico';

@Injectable()
export class ContactoService {
  private API_URL: string = 'http://localhost:3000/contacto';

  constructor(private http: HttpClient) {}

  enviarMensaje(mensaje: MensajeContacto): Observable<ResultadoGenerico> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ResultadoGenerico>(this.API_URL, mensaje, { headers });
  }
}

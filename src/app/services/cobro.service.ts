import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoGenerico } from '../models/resultado-generico';

@Injectable()
export class CobroService {
  private API_URL: string = 'http://localhost:3000/cobros/';
  constructor(private http : HttpClient) { }

  agregar (body : any) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({     
      'Content-Type': 'application/json',

      'Authorization': `Bearer ${auth_token}`
    })
    const requestOptions= {headers : headers};
    return this.http.post<ResultadoGenerico>(this.API_URL,body,requestOptions);
  }
  
  reporteCobro(body: any): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL+'reporteCobros',body,requestOptions);
  }
}

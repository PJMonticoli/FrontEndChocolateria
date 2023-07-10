import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { ResultadoGenerico } from '../models/resultado-generico';

@Injectable()
export class ProductoService {
  private API_URL : string = 'http://localhost:3000/productos/';
  constructor(private http : HttpClient) { }

  obtenerTodos(): Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };

    return this.http.get<ResultadoGenerico>(this.API_URL,requestOptions);
  }


  agregar(producto : Producto) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };

    return this.http.post<ResultadoGenerico>(this.API_URL,producto,requestOptions);
  }


  eliminar(producto : Producto) : Observable<any>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
    return this.http.delete(this.API_URL+producto.id,requestOptions)
  }

  obtenerProductosActivos(): Observable<ResultadoGenerico>{
    return this.http.get<ResultadoGenerico>(this.API_URL + 'activos');
  }

  obtenerActivos(precioMin: number, precioMax: number): Observable<ResultadoGenerico> {
    const params = new HttpParams()
      .set('precioMin', precioMin.toString())
      .set('precioMax', precioMax.toString());
  
    return this.http.get<ResultadoGenerico>(this.API_URL + 'activosFiltrados', { params });
  }

  modificar(body : Producto) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
    return this.http.put<ResultadoGenerico>(this.API_URL,body,requestOptions);
   }

   getProductoById(id : number) : Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
      return this.http.get<ResultadoGenerico>(this.API_URL +id,requestOptions);
   }


   modificarStock(body : Producto) : Observable<ResultadoGenerico>{
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
    return this.http.put<ResultadoGenerico>(this.API_URL + 'stock',body,requestOptions);
   }
   
   rankingCantidad(limite: number, body: any): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    const requestOptions = { headers: headers };
    const requestBody = { ...body, limite };
  
    return this.http.post<ResultadoGenerico>(this.API_URL + 'cantidadProd', requestBody, requestOptions);
  }
  
  
  rankingPromedio(limite: number, body: any): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    const requestOptions = { headers: headers };
    const requestBody = { ...body, limite };
    return this.http.post<ResultadoGenerico>(`${this.API_URL}promedioProd`, requestBody, requestOptions);
  }


  reporteCantidad(body: any): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': `Bearer ${auth_token}`

      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL + 'reporteCantidad', body, requestOptions);
  }
  
  
  reportePromedio(body: any): Observable<ResultadoGenerico> {
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
    const requestOptions = { headers: headers };
    return this.http.post<ResultadoGenerico>(this.API_URL + 'reportePromedio', body, requestOptions);
  }
  
  
}

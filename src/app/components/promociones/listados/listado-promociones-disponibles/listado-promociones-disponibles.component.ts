import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PromocionService } from 'src/app/services/promocion.service';
import { SocioService } from 'src/app/services/socio.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-promociones-disponibles',
  templateUrl: './listado-promociones-disponibles.component.html',
  styleUrls: ['./listado-promociones-disponibles.component.css']
})
export class ListadoPromocionesDisponiblesComponent implements OnInit,OnDestroy{
  @Input() listado : any[]= [];
  private subscription = new Subscription();
  page : number = 0;
  search : string ='';
  puntos : number;
  constructor(private servicioPromocion : PromocionService,
             private servicioSocio : SocioService,
             private router : Router) { }

  ngOnInit(): void {
    this.cargarDatos();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarDatos(){
    this.cargarPuntos();
    this.cargarTabla();
  }

  cargarPuntos(): void {
    this.subscription.add(
      this.servicioSocio.obtenerPuntosDelSocio().subscribe({
        next: (res: ResultadoGenerico) => {
          if(res.ok && res.resultado){
            this.puntos = res.resultado[0]? res.resultado[0].puntos : 0;
          } else {
            console.error(res.mensaje);
          }
        },
        error: (e) => {
          Swal.fire({title:'Error!', text:`Error al obtener puntos: ${e}`, icon: 'error'})
          this.router.navigate(['home']);

        }
      })
    )
  }


  cargarTabla(){
    this.subscription.add(
      this.servicioPromocion.obtenerDisponibles().subscribe({
        next : (res : ResultadoGenerico)=>{
          if(res.resultado && res.resultado.length>=0){ 
            this.listado=res.resultado;
          }else{
            console.error(res.mensaje);
          }
        },
        error :(err)=>{
          console.error(err);
          Swal.fire({title:'Error!', text: `Error al listar promociones disponibles`, icon: 'error'});
        }
      })
    )
  }

  onSearch(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }

  prevPage(){
    if(this.page>0){
      this.page-=6;
    }
  }

  nextPage(){
    this.page+=6;
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-promociones',
  templateUrl: './listado-promociones.component.html',
  styleUrls: ['./listado-promociones.component.css']
})
export class ListadoPromocionesComponent implements OnInit,OnDestroy{
  @Input() listado : any[]= [];
  private subscription = new Subscription();
  page : number = 0;
  search : string ='';
  constructor(private servicioPromocion : PromocionService) { }


  ngOnInit(): void {
    this.cargarTabla();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  cargarTabla(){
    this.subscription.add(
      this.servicioPromocion.obtenerTodas().subscribe({
        next :(res : ResultadoGenerico)=>{
          if(res.resultado && res.resultado.length>=0){ 
            this.listado=res.resultado;
          }else{
            console.error(res.mensaje);
          }
        },
        error :(err)=>{
          console.error(err);
          Swal.fire({title:'Error!', text: `Error al listar promociones`, icon: 'error'});
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
      this.page-=5;
    }
  }

  nextPage(){
    this.page+=5;
  }
}

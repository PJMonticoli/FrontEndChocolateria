import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DtoPromociones } from 'src/app/models/dto-promociones';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-promociones-canjeadas',
  templateUrl: './listado-promociones-canjeadas.component.html',
  styleUrls: ['./listado-promociones-canjeadas.component.css']
})
export class ListadoPromocionesCanjeadasComponent implements OnInit,OnDestroy{
  constructor(private servicioPromocion : PromocionService){}
  private subscription : Subscription;
  listado : DtoPromociones[]= [];
  page = 0;
  search : string ='';
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = new Subscription();
    this.cargarTabla();
  }

  cargarTabla(){
    this.subscription.add(
      this.servicioPromocion.obtenerCanjeadas().subscribe({
        next :(res : DtoPromociones[])=>{
          this.listado=res;
        },
        error :(err)=>{
          console.error(err);
          Swal.fire({title:'Error!', text: `Error al listar promociones canjeadas`, icon: 'error'});
        }
      })
    )
  }


  onSearch(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }
  prevPage() {
    if (this.page > 0) {
      this.page-=5;
    }
  }

  nextPage() {
    this.page+=5;
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Socio } from 'src/app/models/socio';
import { SocioService } from 'src/app/services/socio.service';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-listado-socios',
  templateUrl: './listado-socios.component.html',
  styleUrls: ['./listado-socios.component.css']
})
export class ListadoSociosComponent implements OnInit, OnDestroy{
  @Input() listado : Socio[]=[];
  private subscription = new Subscription();
  page : number= 0;
  search : string='';
  constructor(private servicioSocio : SocioService){}

  ngOnInit(): void {
    this.cargarTabla();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  cargarTabla() : void{
    this.subscription.add(
      this.servicioSocio.obtenerTodos().subscribe({
        next: (r: ResultadoGenerico) => {
          if(r.ok) {
            this.listado = r.resultado as Socio[];
          }
          else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          Swal.fire({title:'Error!', text: `Error al listar socios`, icon: 'error'});
          console.error(e);
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

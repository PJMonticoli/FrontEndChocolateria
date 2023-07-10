import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-listado-pedidos-pendientes',
  templateUrl: './listado-pedidos-pendientes.component.html',
  styleUrls: ['./listado-pedidos-pendientes.component.css']
})
export class ListadoPedidosPendientesComponent implements OnInit {
  private subscription : Subscription;
  listado : any[]=[];
  page: number=0;
  search : string='';
  constructor(private servicioPedido : PedidoService){}
  ngOnInit(): void {
    this.subscription = new Subscription();
    this.cargarTabla();
  }

  cargarTabla() : void{
    this.subscription.add(
      this.servicioPedido.obtenerPendientes().subscribe({
        next: (res: ResultadoGenerico) => {
          if(res.resultado && res.resultado.length>=0){ 
            this.listado=res.resultado;
          }
          else {
            console.error(res.mensaje);
          }
        },
        error: (e) => {
          Swal.fire({title:'Error!', text: `Error al listar pedidos pendientes`, icon: 'error'});
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

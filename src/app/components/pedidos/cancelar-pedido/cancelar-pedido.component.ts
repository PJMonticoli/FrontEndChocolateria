import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-cancelar-pedido',
  templateUrl: './cancelar-pedido.component.html',
  styleUrls: ['./cancelar-pedido.component.css']
})
export class CancelarPedidoComponent implements OnInit, OnDestroy{
  private subscription: Subscription;
  @Input() pedido: any;
  @Output() onCancelar= new EventEmitter();
  constructor(
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.subscription = new Subscription();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  cancelarPedido(): void {
    if(!this.pedido.id){
      console.error("pedido no definido");
      return;
    }
    this.subscription.add(
      this.pedidoService.cancelar(this.pedido.id).subscribe({
        next: (res:ResultadoGenerico)  => {
          if(res.ok){
            Swal.fire({title:'Listo!', text:'Pedido cancelado con exito', icon: 'success'});
            this.onCancelar.emit();
          } else {
            Swal.fire({title:'Error!', text:`Error al intentar cancelar el pedido: ${res.mensaje}`, icon: 'error'});
            console.error(res.mensaje);
          }
        },
        error: (e) => {
          console.error(e);
        }
      })
    )
  }
}



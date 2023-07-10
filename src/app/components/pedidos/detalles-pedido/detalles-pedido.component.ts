import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-detalles-pedido',
  templateUrl: './detalles-pedido.component.html',
  styleUrls: ['./detalles-pedido.component.css'],
})
export class DetallesPedidoComponent implements OnInit, OnDestroy {
  @Input() pedido: Pedido;
  detalles: any[] = [];
  private subscription: Subscription;

  constructor(private servicioPedido: PedidoService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  getDetalles(): void {
    if (!this.pedido.id) {
      console.error('Pedido no definido');
      return;
    }
    this.subscription.add(
      this.servicioPedido.obtenerDetalles(this.pedido.id).subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            this.detalles = res.resultado ? res.resultado : [];
          } else {
            console.error(res.mensaje);
          }
        },
      })
    );
  }


  
}

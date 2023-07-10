import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DtoPromociones } from 'src/app/models/dto-promociones';
import { MovimientosPuntos } from 'src/app/models/movimientos-puntos';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PromocionService } from 'src/app/services/promocion.service';

@Component({
  selector: 'app-detalles-promocion-canjeada',
  templateUrl: './detalles-promocion-canjeada.component.html',
  styleUrls: ['./detalles-promocion-canjeada.component.css']
})
export class DetallesPromocionCanjeadaComponent implements OnInit,OnDestroy {
  @Input() promocion: DtoPromociones;
  detalles: any[] = [];
  private subscription: Subscription;

  constructor(private servicioPromocion: PromocionService) {}

  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDetalles(): void {
    if (!this.promocion.id) {
      console.error('Promocion no definida');
      return;
    }
    this.subscription.add(
      this.servicioPromocion.obtenerDetalles(this.promocion.id).subscribe({
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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { Socio } from 'src/app/models/socio';
import { SocioService } from 'src/app/services/socio.service';

@Component({
  selector: 'app-detalles-socio',
  templateUrl: './detalles-socio.component.html',
  styleUrls: ['./detalles-socio.component.css']
})
export class DetallesSocioComponent implements OnInit, OnDestroy {
  @Input() socio : Socio;
  listado : any[] =[];
  private subscription: Subscription;

  constructor(private servicioSocio: SocioService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  getDetalles(): void {
    if (!this.socio.id) {
      console.error('Socio no definido');
      return;
    }
    this.subscription.add(
      this.servicioSocio.obtenerDetallesSocio(this.socio.id).subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            this.listado = res.resultado ? res.resultado : [];
          } else {
            console.error(res.mensaje);
          }
        },
      })
    );
  }
}

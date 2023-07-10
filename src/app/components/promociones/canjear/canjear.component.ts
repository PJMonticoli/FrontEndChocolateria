import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Promocion } from 'src/app/models/promocion';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-canjear',
  templateUrl: './canjear.component.html',
  styleUrls: ['./canjear.component.css']
})
export class CanjearComponent implements OnInit,OnDestroy{
  private subscription : Subscription;
  @Input() promocion : Promocion;
  @Output() onCanjear = new EventEmitter();
  @Input() deshabilitado : boolean;
  constructor(private servicioPromocion : PromocionService){}

  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canjearPromocion(): void {
    if(this.deshabilitado) {
      Swal.fire({title:'Atención!', text:`No posee suficientes puntos para canjear esta promocion!`, icon: 'warning'});
    }
    this.subscription.add(
      this.servicioPromocion.canjear(this.promocion).subscribe({
        next: (res : ResultadoGenerico) => {
          if(res.ok){
            Swal.fire({title:'Listo!', text:'Canjeo la promoción con éxito', icon: 'success'});
            this.onCanjear.emit();
          } 
          else {
            Swal.fire({title:'Error!', text:`Error al canjear promoción: ${res.mensaje}`, icon: 'error'});
          }
        },
        error: () => {
          Swal.fire({title:'Atención!', text:`Actualmente no hay suficiente stock para realizar el canje de promoción`, icon: 'warning'});
        }
      })
    )
  }
}

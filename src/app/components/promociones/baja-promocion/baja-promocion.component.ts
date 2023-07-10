import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Promocion } from 'src/app/models/promocion';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-baja-promocion',
  templateUrl: './baja-promocion.component.html',
  styleUrls: ['./baja-promocion.component.css']
})
export class BajaPromocionComponent implements OnInit, OnDestroy{
@Input() promocion : Promocion;
@Output() onEliminado = new EventEmitter();
private subscription : Subscription;
constructor(private servicioPromocion : PromocionService){}
deshabilitado :boolean = false;

ngOnInit(): void {
    this.subscription = new Subscription();
    this.verificarFechaDesde();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  eliminar(){
    this.subscription.add(
        this.servicioPromocion.eliminar(this.promocion).subscribe({
            next : ()=>{
                Swal.fire({title:'Listo!', text:`Finalizo la promoción "${this.promocion.nombre}" correctamente`, icon: 'success'});
                this.onEliminado.emit();
            },
            error :(e)=>{
                Swal.fire({title:'Error!', text:`Error al finalizar promoción: ${e}`, icon: 'error'});
            }
        })
    )
  }

  verificarFechaDesde() {
    const fechaHastaTabla = new Date(this.promocion.fechaHasta);
    const fechaActual = new Date();
    this.deshabilitado = fechaActual >= fechaHastaTabla;
  }
  
}

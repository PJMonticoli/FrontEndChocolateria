import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Socio } from 'src/app/models/socio';
import { SocioService } from 'src/app/services/socio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-baja-socio',
  templateUrl: './baja-socio.component.html',
  styleUrls: ['./baja-socio.component.css']
})
export class BajaSocioComponent implements OnInit,OnDestroy {
  @Input() socio : Socio;
  @Input() deshabilitado : boolean = false;
  @Output () onEliminado = new EventEmitter();
  private subscription : Subscription;
  constructor(private servicioSocio : SocioService){}

  ngOnInit(): void {
    this.subscription= new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  eliminar(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No vas a poder revertir la acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39AF09',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, dar de baja'
    }).then((result : any) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.servicioSocio.eliminar(this.socio).subscribe({
            next : ()=>{
              Swal.fire({title: 'Listo', text : 'Diste de baja al socio: ' + this.socio.apellido + ' ' +this.socio.nombre +' correctamente', icon: 'success'});
              this.onEliminado.emit();
            },
            error : (err)=>{
              Swal.fire({title:'Error', text:`Error al dar de baja: ${err}`, icon: 'error'});
            }
          })
        )
        Swal.fire(
          'Dado de baja!',
          'El socio ha sido dado de baja.',
          'success'
        )
      }
    })
    }
  }


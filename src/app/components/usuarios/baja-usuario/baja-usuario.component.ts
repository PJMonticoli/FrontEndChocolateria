import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-baja-usuario',
  templateUrl: './baja-usuario.component.html',
  styleUrls: ['./baja-usuario.component.css']
})
export class BajaUsuarioComponent implements OnInit,OnDestroy{
  @Input() idUsuario : number | undefined;
  @Input() deshabilitado : boolean = false;
  @Output () onUsuarioEliminado = new EventEmitter();
  private subscription : Subscription;
  constructor(private servicioUsuario : UsuarioService){}

  ngOnInit(): void {
    this.subscription= new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  eliminarUsuario(){
      Swal.fire({
        title: '¿Estas seguro?',
        text: "No vas a poder revertir la acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#39AF09',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, dar de baja'
      }).then((result : any) => {
        if (result.isConfirmed && this.idUsuario) {
          this.subscription.add(
            this.servicioUsuario.eliminarUsuario(this.idUsuario).subscribe({
              next : ()=>{
                Swal.fire({title: 'Listo', text : 'Diste de baja al usuario correctamente', icon: 'success'});
                this.deshabilitado=true;
                this.onUsuarioEliminado.emit();
              },
              error : (err)=>{
                Swal.fire({title:'Error', text:`Error al dar de baja: ${err}`, icon: 'error'});
              }
            })
          )
          Swal.fire(
            'Dado de baja!',
            'El usuario ha sido dado de baja.',
            'success'
          )
        }
      })
      }
}

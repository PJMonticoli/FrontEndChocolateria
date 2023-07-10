import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-baja-producto',
  templateUrl: './baja-producto.component.html',
  styleUrls: ['./baja-producto.component.css'],
})
export class BajaProductoComponent implements OnInit {
  @Input() producto: Producto;
  @Output () onEliminado = new EventEmitter();
  private subscription: Subscription;
  constructor(private servicioProducto: ProductoService) {}

  ngOnInit(): void {
    this.subscription= new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  eliminarProducto(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No vas a poder revertir la acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39AF09',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result : any) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.servicioProducto.eliminar(this.producto).subscribe({
            next : ()=>{
              Swal.fire({title: 'Listo', text : 'Eliminaste el producto con id: ' + this.producto.id + ' correctamente', icon: 'success'});
              this.onEliminado.emit();
            },
            error : (err)=>{
              Swal.fire({title:'Error', text:`Error al intentar eliminar producto: ${err}`, icon: 'error'});
            }
          })
        )
        Swal.fire(
          'Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        )
      }
    })
    }


}

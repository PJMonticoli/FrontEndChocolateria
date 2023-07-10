import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-elemento-producto',
  templateUrl: './elemento-producto.component.html',
  styleUrls: ['./elemento-producto.component.css']
})
export class ElementoProductoComponent implements OnInit{
  gestorComentarios = new FormControl('');
  rutaImgDefault = 'imagenDefault.png';

  @Input() modalId: number = 1;
  @Input() disabled: boolean;
  @Input() producto: Producto;
  @Output() onAgregar = new EventEmitter<DetallePedido>();
  cantidad: number = 1;
  detalle: DetallePedido;
  constructor(){}
  ngOnInit(): void {
  }
  agregar(){
    this.detalle = {
      producto: this.producto,
      cantidad: this.cantidad,
      precioUnitario: this.producto.precio,
      puntosGanados: this.producto.puntosGanados * this.cantidad,
      comentarios: this.gestorComentarios.value? this.gestorComentarios.value : ""
    }
    this.onAgregar.emit(this.detalle);
    this.disabled = true;
    this.limpiarModal();
  }
  limpiarModal():void {
    this.detalle = new DetallePedido();
    this.gestorComentarios.setValue("");
    this.cantidad = 1;
  }
  modificoCantidad(esSuma: boolean) {
    if(esSuma) {
      if(this.cantidad >= this.producto.stock){
        return 
      }
      this.cantidad=this.cantidad+1;
    }
    else {
      if(this.cantidad <= 1){
        return
      }
      this.cantidad=this.cantidad-1;
      
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.component.html',
  styleUrls: ['./alta-pedido.component.css']
})
export class AltaPedidoComponent implements OnInit, OnDestroy {
  cantidadTotal: number = 0;
  montoTotal: number = 0;
  controlObservaciones = new FormControl('');
  productos: Producto[];
  pedido: Pedido;
  mostrarPedido : boolean = false;
  precioMax: number;
  precioMin: number;
  formulario : FormGroup;
  search : string ='';
  flagFiltro : boolean= false;
  private subscription: Subscription
  constructor(
    private servicioProducto: ProductoService,
    private servicioPedido: PedidoService,
    private router: Router,
    private formBuilder : FormBuilder
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.getProductos();
    this.pedido = new Pedido();
    this.pedido.detalles = [];
    this.formulario = this.formBuilder.group({
      precioMin : [,Validators.required],
      precioMax : [,Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProductos(): void {
    this.subscription.add(
      this.servicioProducto.obtenerProductosActivos().subscribe({
        next: (resultado: ResultadoGenerico) => {
          if (resultado.ok) {
            this.productos = resultado.resultado as Producto[];
          }
          else {
            console.error(resultado.mensaje)
          }
        },
        error: (e) => { console.error(e) }
      })
    )
  }

  calcularTotal(): void {
    let total = 0;
    this.pedido.detalles.forEach(x => {
      total = total + x.producto.precio * x.cantidad;
    });
    this.montoTotal = total;
  }

  calcularCantidadTotal(): void {
    let total = 0;
    this.pedido.detalles.forEach(x => {
      total = total + x.cantidad;
    })
    this.cantidadTotal = total;
  }

  agregarDetalle(detalle: DetallePedido): void {
    this.pedido.detalles.push(detalle);
    this.calcularCantidadTotal();
    this.calcularTotal();
    this.mostrarPedido = true;
  }

  quitarDetalle(detalle: DetallePedido): void {
    this.pedido.detalles = this.pedido.detalles.filter(d => d !== detalle);
    this.calcularCantidadTotal();
    this.calcularTotal();
    this.mostrarPedido = this.pedido.detalles.length > 0;
}


  guardarPedido() {
    this.pedido.observaciones = this.controlObservaciones.value ? this.controlObservaciones.value : "";
    this.subscription.add(
      this.servicioPedido.agregar(this.pedido).subscribe({
        next: () => {
          if(this.pedido.detalles.length>0){
            Swal.fire({ title: 'Listo!', text: 'Registraste tu pedido con éxito.', icon: 'success' });
            this.router.navigate(['/home']);
          }else{
            Swal.fire({ title: 'Atención!', text: 'Selecciona al menos un producto antes de enviar el pedido.', icon: 'warning' });
          }
        },
        error: (e) => {
          Swal.fire({ title: 'Error!', text: 'Se produjo un error', icon: 'error' });
          console.error(e);
        }
      })
    )
  }

  estaAgregado(p: Producto): boolean {
    let condicion = this.pedido.detalles.find(x => x.producto === p);
    if (condicion) {
      return true;
    }
    return false;
  }

onSearchProduct(event: any) {
  const buscar = event.target.value.toLowerCase().normalize('NFD')
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1");
  this.search = buscar;
}



filtrar() {
  const precioMin = this.formulario.get('precioMin')?.value;
  const precioMax = this.formulario.get('precioMax')?.value;

  if (this.formulario.valid) {
    if (precioMin !== null && precioMax !== null) {
      this.subscription.add(
        this.servicioProducto.obtenerActivos(precioMin, precioMax).subscribe({
          next: (resultado: ResultadoGenerico) => {
            if (resultado.ok) {
              this.productos = resultado.resultado as Producto[];
              this.flagFiltro = true;

              if (this.productos.length === 0) {
                Swal.fire({
                  title: 'Atención!',
                  text: 'No se encontraron productos con ese rango de precios',
                  icon: 'warning'
                });
                this.limpiarFiltro();
              }
            } else {
              console.error(resultado.mensaje);
            }
          },
          error: (e) => {
            console.error(e);
          }
        })
      );
    }
  } else {
    Swal.fire({
      title: 'Atención!',
      text: 'Completar los campos precio mínimo y máximo',
      icon: 'warning'
    });
  }
}

limpiarFiltro() {
  this.formulario.get('precioMin')?.setValue(null);
  this.formulario.get('precioMax')?.setValue(null);
  this.getProductos();
  this.flagFiltro = false;
}

get controlPrecioMin() : FormControl{
  return this.formulario.controls['precioMin'] as FormControl;
}

get controlPrecioMax() : FormControl{
  return this.formulario.controls['precioMax'] as FormControl;
}
}

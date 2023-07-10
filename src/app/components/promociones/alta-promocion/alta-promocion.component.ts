import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DetallePromocion } from 'src/app/models/detalle-promocion';
import { Producto } from 'src/app/models/producto';
import { Promocion } from 'src/app/models/promocion';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-alta-promocion',
  templateUrl: './alta-promocion.component.html',
  styleUrls: ['./alta-promocion.component.css']
})
export class AltaPromocionComponent implements OnInit, OnDestroy{
formulario : FormGroup;
promocion : Promocion;
productos: Producto[];
detalles: DetallePromocion[] = [];

private subscription = new Subscription();
controlProductos = new FormControl('');
// cantidadProductos = new FormControl('');

constructor(private servicioPromocion : PromocionService,
           private servicioProducto : ProductoService,
           private formBuilder : FormBuilder,
           private router: Router){}
  ngOnInit(): void {
    this.formulario= this.formBuilder.group({
      nombre : [,Validators.required],
      descripcion : [],
      precioPuntos : [,Validators.required],
      fechaDesde : [,Validators.required],
      fechaHasta: [,Validators.required],
      cantidad : []
    });
    this.cargarCbo();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private cargarCbo(): void {
    this.subscription.add(
      this.servicioProducto.obtenerTodos().subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            this.productos = res.resultado as Producto[];
          }
          else {
            console.error(res.mensaje)
          }
        },
        error: (err) => { 
          console.error(err) 
        }
      })
    )
  }

  agregarProducto(): void {
    const prod: Producto = this.controlProductos.value as unknown as Producto;
    if (!prod) return;
    const cant = this.controlCantidad.value as unknown as number
    if (!cant || cant < 1) return;
    let d: DetallePromocion = {
      producto: prod,
      cantidad: cant
    };
    let indice = this.productos.indexOf(prod);
    this.detalles.push(d);
    this.productos.splice(indice, 1);
    this.controlProductos.reset();
    this.controlCantidad.reset();
  }

  quitarProducto(detalle: DetallePromocion): void {
    let indice = this.detalles.indexOf(detalle);
    this.productos.push(detalle.producto);
    this.detalles.splice(indice, 1);
  }

  registrar(){
    if(this.formulario.valid){
      this.promocion= this.formulario.value as Promocion;
      this.promocion.detalles = this.detalles;
      this.promocion.fechaDesde= new Date(this.formulario.value.fechaDesde);
      this.promocion.fechaHasta= new Date(this.formulario.value.fechaHasta);
      this.promocion.fechaHasta.setHours(this.promocion.fechaHasta.getHours() + 23);
      this.promocion.fechaHasta.setMinutes(this.promocion.fechaHasta.getMinutes() + 59);
      
      this.subscription.add(
        this.servicioPromocion.agregar(this.promocion).subscribe({
          next: () => {
            Swal.fire({title:'Listo!', text:`Registro la promoción con éxito`, icon: 'success'});
            this.router.navigate(['/promocion/listado']);
          },
          error: () => {
            Swal.fire({title:'Error!', text:`Error al registrar promoción`, icon: 'error'});
          }
        })
      )
    }else{
      Swal.fire({title: 'Atención!', text: 'Complete todos los campos',icon: 'warning'})
    }
  }


  get controlNombre() : FormControl{
    return this.formulario.controls['nombre'] as FormControl;
  }

  get controlDescripcion() : FormControl{
    return this.formulario.controls['descripcion'] as FormControl;
  }

  get controlPrecioPuntos() : FormControl{
    return this.formulario.controls['precioPuntos'] as FormControl;
  }

  get controlFechaDesde() : FormControl{
    return this.formulario.controls['fechaDesde'] as FormControl;
  }

  get controlFechaHasta() : FormControl{
    return this.formulario.controls['fechaHasta'] as FormControl;
  }

  get controlCantidad() : FormControl{
    return this.formulario.controls['cantidad'] as FormControl;
  }
}

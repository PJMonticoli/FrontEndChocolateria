import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-alta-stock',
  templateUrl: './alta-stock.component.html',
  styleUrls: ['./alta-stock.component.css']
})
export class AltaStockComponent implements OnInit, OnDestroy{
  private subscription : Subscription;
  formulario : FormGroup;
  productos: Producto[];
  @Input() producto : Producto;
  isEdit : boolean=false;
  @Output() onAgregarStock = new EventEmitter();
  constructor(private servicioProducto : ProductoService,
             private formBuilder : FormBuilder,
             private router : Router,
             private activatedRoute : ActivatedRoute){             
this.producto = new Producto();
             }

  ngOnInit(): void {
    this.subscription= new Subscription();
    this.formulario = this.formBuilder.group({
      nombre : [],
      stock: ['', [Validators.required, this.validarStock]]
    })
    this.cargar();
    this.formulario.controls['nombre'].disable();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  actualizarStock(){
    if(this.formulario.valid){
      let body = this.formulario.value as Producto;
      body.id=this.producto.id;
      this.servicioProducto.modificarStock(body).subscribe({
        next : (res : ResultadoGenerico) =>{
          if(res.ok){
            Swal.fire({title:'Listo!', text:`Registro el stock producto correctamente`, icon: 'success'});
            this.router.navigate(['/stock/listado']);
            this.onAgregarStock.emit();
          }else{
            Swal.fire({title:'Error!', text:`${res.mensaje}`, icon: 'error'});
          }
        },
        error: (e) => { 
          Swal.fire({title:'Error!', text:`Error al editar stock producto`, icon: 'error'});
          console.error(e);
        }
      })
    }else{
      Swal.fire({title:'Atención!', text:`Complete los campos y/o verifique de ingresar un valor de stock positivo`, icon: 'warning'});
    }
  }

  cargar(): void {
    this.formulario.patchValue(this.producto);
  }
  get controlStock (): FormControl{
    return this.formulario.controls['stock'] as FormControl;
  }

  get controlNombre (): FormControl{
    return this.formulario.controls['nombre'] as FormControl;
  }

  validarStock(control : any) {
    if (control.value <= 0) {
      return { stockNegativo: true };
    }
    return null;
  }
}

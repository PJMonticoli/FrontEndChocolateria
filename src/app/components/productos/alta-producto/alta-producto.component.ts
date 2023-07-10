import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.css']
})
export class AltaProductoComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  formulario : FormGroup;
  isEdit : boolean = false;
  producto : Producto;
  file ='';
  urlImagen = 'http://localhost:3000/uploads/noImage.jpg';
  imagenSubida : string;
  flag : boolean=false;

  constructor(private servicioProducto : ProductoService,
             private formBuilder : FormBuilder,
             private router : Router,
             private activatedRoute : ActivatedRoute,
             private http : HttpClient){

this.producto = new Producto();
}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombre : [,Validators.required],
      precio : [,Validators.required],
      descripcion : [],
      activo : [],
      observaciones : [],
      disponible : [],
      puntosGanados : [,Validators.required],
      urlImagen : []
    })
    this.cargar();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get controlNombre(): FormControl{
    return this.formulario.controls['nombre'] as FormControl;
  }

  get controlPrecio() : FormControl{
    return this.formulario.controls['precio'] as FormControl;
  }

  get controlPuntos() : FormControl{
    return this.formulario.controls['puntosGanados'] as FormControl;
  }

  cambioActivoCheck(x: boolean){
    this.formulario.patchValue({
      activo : x
    });
  }
  cambioDisponibleCheck(x: boolean){
    this.formulario.patchValue({
      disponible : x
    });
  }

  registrar(){
    if(this.formulario.valid){
      this.producto= this.formulario.value as Producto;
      this.producto.urlImagen = this.imagenSubida ? this.imagenSubida.replace(/\\/g, '/') : '';
      console.log(this.producto);
      this.subscription.add(
        this.servicioProducto.agregar(this.producto).subscribe({
          next :(res : ResultadoGenerico)=>{
            if(res.ok){
              Swal.fire({title:'Listo', text:'Registro el producto con exitó', icon: 'success'});
              this.router.navigate(['/producto/listado']);
            }else{
              Swal.fire({title : 'Error', text:'Error al intentar registrar producto', icon: 'error'});
              console.log(res.mensaje);
            }
          },
          error : (err)=>{
            Swal.fire({title:'Error', text:`Error al registrar producto`, icon: 'error'});
            console.error(err);
          }
        })
      )
    }else{
      Swal.fire({title:'Atención', text:`Complete los campos por favor`, icon: 'warning'});
    }
  }
editar() {
  let body = this.formulario.value as Producto;
  body.id = this.producto.id;

  if (this.file) {
    body.urlImagen = this.imagenSubida;
  } else {
    body.urlImagen = this.producto.urlImagen;
  }

  this.subscription.add(
    this.servicioProducto.modificar(body).subscribe({
      next: (res: ResultadoGenerico) => {
        if (res.ok) {
          Swal.fire({ title: 'Listo!', text: 'Se editó el producto correctamente', icon: 'success' });
          this.router.navigate(['/producto/listado']);
        } else {
          Swal.fire({ title: 'Error!', text: res.mensaje, icon: 'error' });
        }
      },
      error: (e) => {
        Swal.fire({ title: 'Error!', text: 'Error al editar producto', icon: 'error' });
        console.error(e);
      }
    })
  );
}
cargar(): void {
  this.subscription.add(
    this.activatedRoute.params.subscribe(e => {
      let id = e['id'];
      if (id) {
        this.isEdit = true;
        this.subscription.add(
          this.servicioProducto.getProductoById(id).subscribe({
            next: (res: ResultadoGenerico) => {
              if (res.ok && res.resultado) {
                this.producto = res.resultado[0];
                this.formulario.patchValue(this.producto);
                this.urlImagen = `http://localhost:3000/${this.producto.urlImagen}`;
              } else {
                Swal.fire({ title: 'Error!', text: `${res.mensaje}`, icon: 'error' });
              }
            },
            error: (err) => {
              Swal.fire({ title: 'Atención!', text: `No posee los permisos necesarios para acceder a este recurso`, icon: 'warning' });
              console.log(err);
            }
          })
        );
      } else {
        this.isEdit = false;
      }
    })
  );
}


  selectImage(event : any){
    if(event.target.files.length > 0){     
        const file =event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event : any) =>{
          this.urlImagen = event.target.result;
          this.flag=true;
        }
        this.file=file;

    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.file);
     
    this.http.post<any>('http://localhost:3000/productos/uploadImage', formData).subscribe({
      next :(r)=>{
        this.imagenSubida = 'uploads/' + r.filename;
        this.flag=false;
        Swal.fire({
          icon: 'success',
          title: 'Imagen cargada!!',
          text: 'La imagen se subió correctamente!'
        })
        this.urlImagen = 'http://localhost:3000/uploads/noImage.jpg';
      },
      error :(err)=>{
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que no se subió nada!!' 
        })
      }
    })
      
    this.urlImagen = '../../../../assets/img/noImage.jpg';
  }

    deleteImg(): void {
      this.urlImagen = 'http://localhost:3000/uploads/noImage.jpg';
      this.file = '';
      this.flag = false;
      const input = document.getElementById('urlImagen') as HTMLInputElement;
      input.value = '';
    }
}

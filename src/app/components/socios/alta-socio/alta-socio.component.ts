import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { Socio } from 'src/app/models/socio';
import { SocioService } from 'src/app/services/socio.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-alta-socio',
  templateUrl: './alta-socio.component.html',
  styleUrls: ['./alta-socio.component.css']
})
export class AltaSocioComponent implements OnInit, OnDestroy,AfterViewInit {
@ViewChild('inputNombre') inputNombre!: ElementRef;
isEdit : boolean =false;
socio : Socio;
formulario : FormGroup;
private subscription = new Subscription();
constructor(private formBuilder: FormBuilder,
           private servicioSocio : SocioService,
           private router : Router,
           private activatedRoute : ActivatedRoute){
this.socio = new Socio();
}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

ngOnInit(): void {
  this.formulario = this.formBuilder.group({
    nombre : [,Validators.required],
    apellido : [,Validators.required],
    domicilio : [],
    dni : [,Validators.required],
    email : [,Validators.required],
    telefono : []
  })
  this.cargar();
  if(this.isEdit){
    this.formulario.controls['dni'].disable();
  }
}

ngAfterViewInit() {
  this.inputNombre.nativeElement.focus();
}
get controlNombre(): FormControl {
  return this.formulario.controls['nombre'] as FormControl;
}

get controlApellido (): FormControl{
  return this.formulario.controls['apellido'] as FormControl;
}

get controlDni(): FormControl{
  return this.formulario.controls['dni'] as FormControl;
}

get controlEmail(): FormControl{
  return this.formulario.controls['email'] as FormControl;
}

registrar(){
  if(this.formulario.valid){
    this.socio=this.formulario.value as Socio;
    this.subscription.add(
      this.servicioSocio.agregar(this.socio).subscribe({
        next: () =>{
          Swal.fire({title:'Listo', text:`Registro el socio correctamente`, icon: 'success'});
          this.router.navigate(['/registro'])
        },
        error : (e) =>{
          Swal.fire({title:'Error', text:`Error al registrar socio: ${e}`, icon: 'error'});
        }
      })
    )
  }else {
    Swal.fire({title:'Atención!', text:`Revise y complete todos los campos!`, icon: 'warning'});
  }
}

editar(){
  console.log(this.formulario.value);
  let body = this.formulario.value as Socio;
  body.id=this.socio.id;
  body.dni=this.socio.dni;
  this.subscription.add(
    this.servicioSocio.modificar(body).subscribe({
      next : (res : ResultadoGenerico) =>{
        if(res.ok){
          Swal.fire({title:'Listo!', text:`Editó el socio correctamente`, icon: 'success'});
          this.router.navigate(['/socio/listado']);
        }else{
          console.log(res.mensaje);
        }
      },
      error: (e) => {
        Swal.fire({title:'Error!', text:`Error al editar socio: ${e}`, icon: 'error'});
      }
    })
  )
}


cargar () : void{
  this.subscription.add(
    this.activatedRoute.params.subscribe(
      e=>{
        let id = e['id'];
        if(id){
          this.isEdit=true;
          this.subscription.add(
            this.servicioSocio.getSocioById(id).subscribe({
              next : (res : ResultadoGenerico) =>{
                if(res.ok && res.resultado){
                  this.socio=res.resultado[0];
                  this.formulario.patchValue(this.socio);
                }else{
                  console.log(res.mensaje);                   
                }
              },
              error : (err) =>{
                console.log(err);
                Swal.fire({title:'Atención!', text:`Usted no esta autorizado para editar un socio`, icon: 'warning'});
              }
            }
          )
        )}else{
          this.isEdit=false;
        }
      }
    ) 
  )
}
  
}

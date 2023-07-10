import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { SocioService } from 'src/app/services/socio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidadorSocio } from 'src/app/validators/validador-socio';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-registro-usuario-externo',
  templateUrl: './registro-usuario-externo.component.html',
  styleUrls: ['./registro-usuario-externo.component.css']
})
export class RegistroUsuarioExternoComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('inputUsuario') inputUsuario!: ElementRef;
  private subscription : Subscription;
  formulario: FormGroup;
  fieldTextType: boolean;
  constructor(
    private servicioUsuario: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private servicioSocio : SocioService
  ) {
    this.formulario = this.formBuilder.group(      {
      usuario: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      contrasenia: [, [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      dni: [null, 
        [Validators.required, Validators.minLength(6), Validators.maxLength(8)], 
        [ValidadorSocio.validadorDNI(this.servicioSocio)]]
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription= new Subscription();
  }

  ngAfterViewInit() {
    this.inputUsuario.nativeElement.focus();
  }
  get controlUsuario(): FormControl {
    return this.formulario.controls['usuario'] as FormControl;
  }

  get controlContrasenia() : FormControl{
    return this.formulario.controls['contrasenia'] as FormControl;
  }

  get controlDNI() : FormControl{
    return this.formulario.controls['dni'] as FormControl;
  }

  registrar(){
    if(this.formulario.valid){
      let body = this.formulario.value;
      this.subscription.add(
        this.servicioUsuario.registrarUsuExterno(body).subscribe({
          next: (res : ResultadoGenerico)=>{
            if(res.ok){
              Swal.fire({ title: 'Listo!', text: `Usuario registrado con éxito. Inicie sesión con las mismas credenciales.`, icon: 'success' });
              this.router.navigate(['login']);
            }else{
              Swal.fire({ title: 'Error!', text: `${res.mensaje}`, icon: 'error' });
            }
          },
          error :(err)=>{
            Swal.fire({ title: 'Error!', text: `Error al registrarse: ${err.error.mensaje}`, icon: 'error' });
          }
        })
      )
    }else{
      Swal.fire({ title: 'Atención!', text: `Revise y complete todos los campos!`, icon: 'warning' });
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}

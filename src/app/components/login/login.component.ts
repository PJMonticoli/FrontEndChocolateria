import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { UsuarioLogin } from 'src/app/models/usuario-login';
import { SesionIniciadaService } from 'src/app/services/sesion-iniciada.service';
import { UsuarioService } from 'src/app/services/usuario.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('inputUsuario') inputUsuario!: ElementRef;
  private subscription = new Subscription();
  formulario: FormGroup;
  fieldTextType: boolean;
  @Input() modalId: number = 1;
  mostrarCheckboxTerminos: boolean = false;
  constructor(
    private servicioUsuario: UsuarioService,
    private formBuilder: FormBuilder,
    private servicioSesion : SesionIniciadaService,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      usuario : [,Validators.required],
      contrasenia : [,Validators.required],
      terminos : []
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.inputUsuario.nativeElement.focus();
  }
  get controlUsuario(): FormControl {
    return this.formulario.controls['usuario'] as FormControl;
  }

  get controlContrasenia() : FormControl{
    return this.formulario.controls['contrasenia'] as FormControl;
  }

  get controlTerminos() : FormControl{
    return this.formulario.controls['terminos'] as FormControl;
  }


  iniciarSesion(): void {
    if (this.formulario.valid) {
      let usuarioLogin = this.formulario.value as UsuarioLogin;
      this.subscription.add(
        this.servicioUsuario.login(usuarioLogin).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok && res.resultado != null) {
              localStorage.setItem('token', res.resultado[0]);
              Swal.fire({ title: 'Bienvenido/a!', icon: 'success' });
              this.servicioSesion.cambiarEstadoSesion(true);
              this.router.navigate(['home']);
            } else if (res.mensaje === 'Debes aceptar los Términos y condiciones') {
              Swal.fire({ title: 'Atención', text: `${res.mensaje}`, icon: 'info' });
              this.mostrarCheckboxTerminos = true;
            } else {
              Swal.fire({ title: 'Error', text: `${res.mensaje}`, icon: 'error' });
            }
          },
          error: (err) => {
            Swal.fire({ title: 'Error al iniciar sesión', text: `${err.message}`, icon: 'error' });
          }
        })
      );
    } else {
      Swal.fire({ title: 'Atención', text: 'Complete los campos por favor', icon: 'warning' });
    }
  }
  

  

toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}
}

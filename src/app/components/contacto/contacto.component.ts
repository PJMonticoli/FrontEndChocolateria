import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactoService } from 'src/app/services/contacto.service';
import { MensajeContacto } from 'src/app/models/mensaje-contacto';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      Swal.fire({ title: 'Atención', text: 'Por favor completá todos los campos requeridos.', icon: 'warning' });
      return;
    }

    const mensaje: MensajeContacto = this.contactForm.value;

    this.contactoService.enviarMensaje(mensaje).subscribe({
      next: (res) => {
        if (res.ok) {
          Swal.fire({ title: '¡Gracias!. Pronto nos pondremos en contacto con usted', text: res.mensaje, icon: 'success' });
          this.contactForm.reset();
          this.submitted = false;
        } else {
          Swal.fire({ title: 'Error', text: res.mensaje, icon: 'error' });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ title: 'Error', text: 'Hubo un problema al enviar el mensaje.', icon: 'error' });
      }
    });
  }
}

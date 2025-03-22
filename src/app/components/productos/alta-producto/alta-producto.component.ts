import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.css']
})
export class AltaProductoComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  formulario: FormGroup;
  isEdit: boolean = false;
  producto: Producto;
  file: File | null = null;
  urlImagen = 'http://localhost:3000/uploads/noImage.jpg';
  imagenSubida: string;
  flag: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  maxFileSize: number = 5 * 1024 * 1024; // 5MB en bytes

  constructor(
    private servicioProducto: ProductoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    this.producto = new Producto();
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      precio: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      descripcion: [''],
      activo: [true],
      observaciones: [''],
      disponible: [true],
      puntosGanados: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      urlImagen: ['']
    });
    this.cargar();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get controlNombre(): FormControl {
    return this.formulario.controls['nombre'] as FormControl;
  }

  get controlPrecio(): FormControl {
    return this.formulario.controls['precio'] as FormControl;
  }

  get controlPuntos(): FormControl {
    return this.formulario.controls['puntosGanados'] as FormControl;
  }

  cambioActivoCheck(x: boolean) {
    this.formulario.patchValue({
      activo: x
    });
  }
  
  cambioDisponibleCheck(x: boolean) {
    this.formulario.patchValue({
      disponible: x
    });
  }

  registrar() {
    if (this.formulario.valid) {
      if (!this.flag) {
        Swal.fire({
          title: 'Atención',
          text: 'Es necesario subir una imagen para el producto',
          icon: 'warning'
        });
        return;
      }

      Swal.fire({
        title: 'Registrando producto',
        text: 'Por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.producto = this.formulario.value as Producto;
      this.producto.urlImagen = this.imagenSubida ? this.imagenSubida.replace(/\\/g, '/') : '';
      
      this.subscription.add(
        this.servicioProducto.agregar(this.producto).subscribe({
          next: (res: ResultadoGenerico) => {
            Swal.close();
            if (res.ok) {
              Swal.fire({
                title: '¡Excelente!',
                text: 'El producto ha sido registrado con éxito',
                icon: 'success',
                confirmButtonColor: '#8B4513'
              }).then(() => {
                this.router.navigate(['/producto/listado']);
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: res.mensaje || 'Error al intentar registrar el producto',
                icon: 'error'
              });
            }
          },
          error: (err) => {
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al registrar el producto',
              icon: 'error'
            });
            console.error(err);
          }
        })
      );
    } else {
      Object.keys(this.formulario.controls).forEach(key => {
        const control = this.formulario.get(key);
        control?.markAsTouched();
      });
      
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos obligatorios',
        icon: 'warning',
        confirmButtonColor: '#8B4513'
      });
    }
  }

  editar() {
    if (this.formulario.valid) {
      let body = this.formulario.value as Producto;
      body.id = this.producto.id;

      if (this.file) {
        body.urlImagen = this.imagenSubida;
      } else {
        body.urlImagen = this.producto.urlImagen;
      }

      Swal.fire({
        title: 'Actualizando producto',
        text: 'Por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.subscription.add(
        this.servicioProducto.modificar(body).subscribe({
          next: (res: ResultadoGenerico) => {
            Swal.close();
            if (res.ok) {
              Swal.fire({
                title: '¡Actualizado!',
                text: 'El producto ha sido modificado con éxito',
                icon: 'success',
                confirmButtonColor: '#28a745'
              }).then(() => {
                this.router.navigate(['/producto/listado']);
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: res.mensaje || 'Error al intentar actualizar el producto',
                icon: 'error'
              });
            }
          },
          error: (e) => {
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al actualizar el producto',
              icon: 'error'
            });
            console.error(e);
          }
        })
      );
    } else {
      Object.keys(this.formulario.controls).forEach(key => {
        const control = this.formulario.get(key);
        control?.markAsTouched();
      });
      
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos obligatorios',
        icon: 'warning',
        confirmButtonColor: '#28a745'
      });
    }
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
                  if (this.producto.urlImagen && this.producto.urlImagen !== 'uploads/noImage.jpg') {
                    this.flag = true;
                  }
                } else {
                  Swal.fire({
                    title: 'Error',
                    text: res.mensaje || 'No se pudo cargar la información del producto',
                    icon: 'error'
                  });
                }
              },
              error: (err) => {
                Swal.fire({
                  title: 'Atención',
                  text: 'No posee los permisos necesarios para acceder a este recurso',
                  icon: 'warning'
                });
                console.error(err);
                this.router.navigate(['/home']);
              }
            })
          );
        } else {
          this.isEdit = false;
        }
      })
    );
  }

  selectImage(event: any) {
    let fileObj: File;
    
    // Manejar tanto evento click como drag & drop
    if (event.target && event.target.files) {
      if (event.target.files.length === 0) return;
      fileObj = event.target.files[0];
    } else if (event.dataTransfer && event.dataTransfer.files) {
      event.preventDefault();
      if (event.dataTransfer.files.length === 0) return;
      fileObj = event.dataTransfer.files[0];
    } else {
      return;
    }
    
    // Validar tipo de archivo
    if (!fileObj.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      Swal.fire({
        title: 'Formato no válido',
        text: 'Por favor seleccione una imagen en formato JPG, PNG o GIF',
        icon: 'error'
      });
      return;
    }
    
    // Validar tamaño
    if (fileObj.size > this.maxFileSize) {
      Swal.fire({
        title: 'Archivo demasiado grande',
        text: 'El tamaño máximo permitido es de 5MB',
        icon: 'error'
      });
      return;
    }
    
    this.file = fileObj;
    
    const reader = new FileReader();
    reader.readAsDataURL(fileObj);
    reader.onload = (event: any) => {
      this.urlImagen = event.target.result;
      this.subirImagen();
    };
  }

  subirImagen() {
    if (!this.file) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post<any>('http://localhost:3000/productos/uploadImage', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          if (event.body && event.body.filename) {
            this.imagenSubida = 'uploads/' + event.body.filename;
            this.flag = true;
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Imagen cargada!',
              text: 'La imagen se ha subido correctamente',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      },
      error: (err) => {
        this.isUploading = false;
        console.error('Error al subir imagen:', err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudo subir la imagen. Intente nuevamente.'
        });
      }
    });
  }

  deleteImg(): void {
    Swal.fire({
      title: '¿Eliminar imagen?',
      text: '¿Está seguro que desea eliminar la imagen del producto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.urlImagen = 'http://localhost:3000/uploads/noImage.jpg';
        this.file = null;
        this.flag = false;
        const input = document.getElementById('urlImagen') as HTMLInputElement;
        if (input) input.value = '';
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Imagen eliminada',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}
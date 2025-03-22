import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css']
})
export class ListadoProductosComponent implements OnInit, OnDestroy {
  rutaImgDefault = 'imagenDefault.png';
  private subscription = new Subscription();
  @Input() listado : Producto[]=[];
  search : string= '';
  page : number = 0;
  constructor(private servicioProducto : ProductoService){}

  ngOnInit(): void {
    this.cargarTabla();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarTabla(){
    this.subscription.add(
      this.servicioProducto.obtenerTodos().subscribe({
        next : (res: ResultadoGenerico) =>{    
          if(res.resultado && res.resultado.length>=0){ 
            this.listado=res.resultado;
          }
          else {
            console.error(res.mensaje);
          }
        },
        error: (e) => {
          Swal.fire({title:'Error!', text: `Error al intentar cargar listado de productos`, icon: 'error'});
          console.error(e);
        }
      })
    )
  }


  nextPage(){
    this.page+=5;
  }

  prevPage(){
    if(this.page>0){
      this.page-=5;
    }
  }

  onSearchProduct(buscar : string){
      this.page=0;
      this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }

  toggleEstadoProducto(p: Producto) {
    this.subscription.add(
      this.servicioProducto.toggleEstado(p.id, !p.activo).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Listo',
            text: `El estado del producto ${p.nombre} ha sido actualizado.`,
            icon: 'success'
          });
          this.cargarTabla();
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: `No se pudo actualizar el estado del producto: ${err}`,
            icon: 'error'
          });
        }
      })
    );
  }
  

}

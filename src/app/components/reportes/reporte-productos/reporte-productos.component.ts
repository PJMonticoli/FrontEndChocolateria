import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { DtoReporte } from 'src/app/models/dto-reporte';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.css']
})
export class ReporteProductosComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  formulario : FormGroup;
  visibilidadReporte : boolean= false;
  body : any;
  resultadoCantidad : DtoReporte[] = [];
  resultadoPromedio: DtoReporte[] = [];
  search : string= '';
  page : number = 0;
  filtroTabla = new FormControl('nombre');
  cantidadProd : number =0;
  promedioProd : number =0;
  constructor(private servicioProducto : ProductoService,
             private formBuilder : FormBuilder){}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      fechaDesde : [,Validators.required],
      fechaHasta : [,Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  private getPromedio() {
    if (!this.formulario.valid) {
      Swal.fire({ title: 'Atención!', text: '¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning' });
      return;
    }
  
    if (this.formulario.valid) {
      const { fechaDesde, fechaHasta } = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
  
      this.subscription.add(
        this.servicioProducto.reportePromedio(this.body).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok) {
              if (this.body.fechaDesde > this.body.fechaHasta) {
                Swal.fire({ title: 'Atención!', text: 'Ingrese fechas válidas:', icon: 'warning' });
                this.visibilidadReporte = false;
                return;
              }else if(res.resultado?.length===0){
                Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
                this.visibilidadReporte= false;
              }
              this.promedioProd = res.resultado ? res.resultado[0].promedioProd : 0;
              this.resultadoPromedio = res.resultado ? res.resultado : [];
            } else {
              console.error(res.mensaje);
            }
          },
          error: (err) => {
            console.error(err);
          }
        })
      );
    } else {
      Swal.fire({ title: 'Atención!', text: '¡Completar campos de fechas!', icon: 'warning' });
    }
  }
  

private getCantidad(generarPDF = false) {
  if (!this.formulario.valid) {
    Swal.fire({ title: 'Atención!', text: '¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning' });
    return;
  }

  if (this.formulario.valid) {
    const { fechaDesde, fechaHasta } = this.formulario.value;
    this.body = {
      fechaDesde: new Date(fechaDesde),
      fechaHasta: new Date(fechaHasta)
    };
    this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
    this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);

    this.subscription.add(
      this.servicioProducto.reporteCantidad(this.body).subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            this.cantidadProd = res.resultado ? res.resultado[0].cantidadProd : 0;
            this.resultadoCantidad = res.resultado ? res.resultado : [];

            if (generarPDF) {
              this.generarReportePDF();
            }
          } else {
            console.error(res.mensaje);
          }
        },
        error: (err) => {
          console.error(err);
        }
      })
    );
  } else {
    Swal.fire({ title: 'Atención!', text: '¡Completar campos de fechas!', icon: 'warning' });
  }
}

solicitarReporte() {
  if (this.formulario.valid) {
    this.visibilidadReporte = true;
    this.getCantidad();
    this.getPromedio();
  } else {
    Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
  }
}


generarReportePDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const elementosTablaCantidad = this.obtenerElementosCantidadTabla();
  const elementosTablaPromedio = this.obtenerElementosPromedioTabla();

  const cantidadTituloY = 20;
  const promedioTituloY = cantidadTituloY + elementosTablaCantidad.length * 10 + 10;
  
  doc.setFontSize(20);
  doc.text('Reporte de Productos', 10, 10);
  
  doc.setFontSize(14);
  doc.text('Cantidad de unidades vendidas por producto', 10, cantidadTituloY);
  autoTable(doc, { body: elementosTablaCantidad, startY: cantidadTituloY + 10 });

  doc.text('Promedio de unidades vendidas por pedido', 10, promedioTituloY);
  autoTable(doc, { body: elementosTablaPromedio, startY: promedioTituloY + 10 });

  console.log(new Date().toLocaleDateString("es-AR"));
  doc.save(`Reporte Productos (${new Date().toLocaleDateString("es-AR")}).pdf`);
}



obtenerElementosCantidadTabla(): string[][] {
  const elementos: string[][] = [];
  this.resultadoCantidad.forEach((res) => {
    const datosFila: string[] = [res.nombre, res.cantidad.toString()];
    elementos.push(datosFila);
  });
  return elementos;
}

obtenerElementosPromedioTabla(): string[][] {
  const elementos: string[][] = [];
  this.resultadoPromedio.forEach((res) => {
    const datosFila: string[] = [res.nombre, res.promedio.toString()];
    elementos.push(datosFila);
  });
  return elementos;
}



descargarPDF() {
  this.getCantidad(true);
  this.getPromedio();
}



get controlFechaDesde () : FormControl{
  return this.formulario.controls['fechaDesde'] as FormControl;
}

get controlFechaHasta () : FormControl{
  return this.formulario.controls['fechaHasta'] as FormControl;
}

nextPage(){
    this.page+=8;
  }

prevPage(){
  if(this.page>0){
    this.page-=8;
    }
  }

pageProm : number=0;
nextPageProm(){
  this.pageProm+=8;
}

  prevPageProm(){
   if(this.pageProm>0){
    this.pageProm-=8;
    }
  }

  onSearchProduct(buscar : string){
      this.page=0;
      this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }

}

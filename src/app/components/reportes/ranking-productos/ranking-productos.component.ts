import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData} from 'chart.js';
import { jsPDF } from "jspdf";
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { DtoReporte } from 'src/app/models/dto-reporte';
@Component({
  selector: 'app-ranking-productos',
  templateUrl: './ranking-productos.component.html',
  styleUrls: ['./ranking-productos.component.css']
})
export class RankingProductosComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  formulario : FormGroup;
  visibilidadReporte : boolean= false;
  datosCantidad: ChartData<'bar'>;
  datosPromedio: ChartData<'bar'>;
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

  private getCantidad() {
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
      return;
    }
    this.visibilidadReporte = true;
    if (this.formulario.valid) {
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
  
      this.subscription.add(
        this.servicioProducto.rankingCantidad(8,this.body).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok) {
              this.cantidadProd = res.resultado ? res.resultado[0].cantidadProd : 0;
              this.resultadoCantidad = res.resultado ? res.resultado : [];
              this.cargar();
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
      Swal.fire({title:'Atención!', text:'¡Completar campos de fechas!', icon: 'warning'});
    }
  }
  
  private getPromedio() {
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
      return;
    }
    this.visibilidadReporte = true;
    if (this.formulario.valid) {
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
  
      this.subscription.add(
        this.servicioProducto.rankingPromedio(8,this.body).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok) {
              if(this.body.fechaDesde> this.body.fechaHasta){
                Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
                this.visibilidadReporte= false;
                return;
              }else if(res.resultado?.length===0){
                Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
                this.visibilidadReporte= false;
              }
              this.promedioProd = res.resultado ? res.resultado[0].promedioProd : 0;
              this.resultadoPromedio = res.resultado ? res.resultado : [];
              this.cargar();
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
      Swal.fire({title:'Atención!', text:'¡Completar campos de fechas!', icon: 'warning'});
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
  
  private cargar(): void {
    const colores: { [producto: string]: string } = {};
  
    this.datosCantidad = {
      labels: ['Cantidad vendida por cada producto'],
      datasets: [],
    };
  
    this.datosPromedio = {
      labels: ['Promedio de venta por cada producto'],
      datasets: [],
    };
  
    // Construir el conjunto de datos para cantidades
    for (let i = 0; i < 8; i++) {
      const cantidadFila = this.resultadoCantidad[i];
      const nombreProducto = cantidadFila.nombre;
      const cantidad = cantidadFila.cantidad;
  
      // Generar un color aleatorio si el producto aún no tiene uno asignado
      if (!colores[nombreProducto]) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = `rgb(${r}, ${g}, ${b})`;
        colores[nombreProducto] = color;
      }
  
      const colorProducto = colores[nombreProducto];
  
      this.datosCantidad.datasets.push({
        label: nombreProducto,
        data: [cantidad],
        backgroundColor: colorProducto,
      });
    }
  
    // Construir el conjunto de datos para promedios
    for (let i = 0; i < 8; i++) {
      const promedioFila = this.resultadoPromedio[i];
      const nombreProducto = promedioFila.nombre;
      const promedio = promedioFila.promedio;
      const colorProducto = colores[nombreProducto];
  
      this.datosPromedio.datasets.push({
        label: nombreProducto,
        data: [promedio],
        backgroundColor: colorProducto,
      });
    }
  }
  
  
  
  descargarPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let ancho = 290;
      let altura = (canvas.height * ancho) / canvas.width;
      const urlArchivo = canvas.toDataURL('image/png');
      let ArchivoPDF = new jsPDF('l', 'mm', 'a4');
      let position = 0;
      let pageHeight = ArchivoPDF.internal.pageSize.getHeight();
  
      if (altura > pageHeight - 20) {
        altura = pageHeight - 20; 
      }
  
      ArchivoPDF.addImage(urlArchivo, 'PNG', 10, 10, ancho, altura);
  
      console.log(new Date().toLocaleDateString("es-AR"));
      ArchivoPDF.save(`Reporte Ranking Productos (${new Date().toLocaleDateString("es-AR")}).pdf`);
    });
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



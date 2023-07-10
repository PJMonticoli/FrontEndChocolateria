import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { DtoReportePromociones } from 'src/app/models/dto-reporte-promociones';
import { ChartData } from 'chart.js';
import autoTable from 'jspdf-autotable'
@Component({
  selector: 'app-reporte-promociones',
  templateUrl: './reporte-promociones.component.html',
  styleUrls: ['./reporte-promociones.component.css']
})
export class ReportePromocionesComponent implements OnInit, OnDestroy{
visibilidadReporte : boolean=false;
formulario : FormGroup;
resultadoReporte: DtoReportePromociones[] = [];
body : any;
search : string= '';
page : number = 0;
private subscription = new Subscription();
datos: ChartData<'bar'>;
cantidadCanjeos : number = 0;
constructor(private servicioPromocion : PromocionService,
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
solicitarReporte(generarPDF = false){
  if (!this.formulario.valid) {
    Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
    return;
  }
  this.visibilidadReporte = true;
  if(this.formulario.valid){
    const {fechaDesde, fechaHasta} = this.formulario.value;
    this.body = {
      fechaDesde: new Date(fechaDesde),
      fechaHasta: new Date(fechaHasta)
    }
    this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
    this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);

    this.subscription.add(
      this.servicioPromocion.reportePromociones(this.body).subscribe({
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
            this.resultadoReporte = res.resultado ? res.resultado : [];
            this.cargar();
            if (generarPDF) {
              this.descargarTablaPDF();
            }
          }
          else {
            console.error(res.mensaje);
          }
        },
        error: (err) => {
          console.error(err);
        }
      }))
  }else{
    alert ('¡Completar campos de fechas!')
  }
}


private cargar(): void {
  const colores: string[] = [];
  for (let i = 0; i < this.resultadoReporte.length; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colores.push(`rgb(${r}, ${g}, ${b})`);
  }
  this.datos = {
    labels: ['Cantidad de veces que se canjeo cada promoción'],
    datasets: [],
  };
  this.resultadoReporte.forEach((fila,index) => {
    this.datos.datasets.push(
      {
        label : fila.nombrePromocion,
        data: [
          fila.cantidadCanjeos
        ],
        backgroundColor: colores[index]
      }
    );
  });
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
    ArchivoPDF.save(`Reporte Promociones (${new Date().toLocaleDateString("es-AR")}).pdf`);
  });
}

descargarTablaPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const elementosTablaCantidad = this.obtenerElementosCantidadTabla();
  const cantidadTituloY = 20;
  doc.setFontSize(20);
  doc.text('Reporte de Promociones', 10, 10);
  
  doc.setFontSize(14);
  doc.text('Cantidad de veces que se canjeo cada promoción', 10, cantidadTituloY);
  autoTable(doc, { body: elementosTablaCantidad, startY: cantidadTituloY + 10 });

  console.log(new Date().toLocaleDateString("es-AR"));
  doc.save(`Tabla Reporte Promociones (${new Date().toLocaleDateString("es-AR")}).pdf`);
}



obtenerElementosCantidadTabla(): string[][] {
  const elementos: string[][] = [];
  this.resultadoReporte.forEach((res) => {
    const datosFila: string[] = [res.nombrePromocion, res.descripcion,res.cantidadCanjeos.toString()];
    elementos.push(datosFila);
  });
  return elementos;
}

onSearchProduct(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
}

nextPage(){
  this.page+=6;
}

prevPage(){
  if(this.page>0){
    this.page-=6;
  }
}



get controlFechaDesde () : FormControl{
  return this.formulario.controls['fechaDesde'] as FormControl;
}

get controlFechaHasta () : FormControl{
  return this.formulario.controls['fechaHasta'] as FormControl;
}
}

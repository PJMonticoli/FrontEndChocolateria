import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { SocioService } from 'src/app/services/socio.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData } from 'chart.js';
import { jsPDF } from "jspdf";
import { DtoSocios } from 'src/app/models/dto-socios';
import autoTable from 'jspdf-autotable'
@Component({
  selector: 'app-reporte-socios',
  templateUrl: './reporte-socios.component.html',
  styleUrls: ['./reporte-socios.component.css']
})
export class ReporteSociosComponent implements OnInit, OnDestroy{
private subscription : Subscription;
formulario : FormGroup;
visibilidadReporte : boolean= false;
body : any;
cantSociosNuevos : number = 0;
cantidadSociosBaja : number = 0;
datos: ChartData<'bar'>;
pedidosSocios : DtoSocios[];
sociosConMasPuntos: DtoSocios[];
private encabezado : string[] = ['Gráfico cantidad de socios'];
search : string= '';
page : number = 0;
constructor(private servicioSocio : SocioService,
            private formBuilder : FormBuilder){}

ngOnInit(): void {
  this.subscription = new Subscription();
  this.formulario= this.formBuilder.group({
    fechaDesde : [,Validators.required],
    fechaHasta : [,Validators.required]
  })
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

get controlFechaDesde () : FormControl{
  return this.formulario.controls['fechaDesde'] as FormControl
}

get controlFechaHasta() : FormControl{
  return this.formulario.controls['fechaHasta'] as FormControl
}

private getCantSociosNuevos(){
  const {fechaDesde, fechaHasta} = this.formulario.value;
  this.body = {
    fechaDesde : new Date(fechaDesde),
    fechaHasta : new Date(fechaHasta)
  }
  this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
  this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);

  this.subscription.add(
    this.servicioSocio.sociosNuevos(this.body).subscribe({
      next : (res : ResultadoGenerico)=>{
        if(res.ok){
          if(this.body.fechaDesde> this.body.fechaHasta){
            Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
            this.visibilidadReporte= false;
            return;
          }else if(res.resultado?.length===0){
            Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
            this.visibilidadReporte= false;
          }
          this.cantSociosNuevos=res.resultado ? res.resultado[0].cantSociosNuevos : 0;
          this.getCantSociosBaja();
        }
      },
      error : (err)=>{
        Swal.fire({title : 'Error', text:`Error al generar reporte socios: ${err}`, icon: 'error'})
      }
    })
  )
}

private getSociosConMasPedidos(generarPDF = false) {
  this.subscription.add(
    this.servicioSocio.sociosConMasPedidos(this.body).subscribe({
      next : (res: ResultadoGenerico) =>{    
        console.log('Socios con mas pedidos :'+ JSON.stringify(res));
        if(res.ok){ 
          if(this.body.fechaDesde> this.body.fechaHasta){
            Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
            this.visibilidadReporte= false;
            return;
          }else if(res.resultado?.length===0){
            Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
            this.visibilidadReporte= false;
          }
          this.pedidosSocios=res.resultado ? res.resultado: [];
        }
        this.obtenerSociosConMasPuntos();
        if (generarPDF) {
          this.descargarTablaPDF();
        }
      },
      error :(e) =>{
        Swal.fire({title:'Error!', text:`Error al generar reporte socios: ${e}`, icon: 'error'});
      }
    })
  )
}

private getCantSociosBaja() {
  this.subscription.add(
    this.servicioSocio.sociosBaja(this.body).subscribe({
      next : (res: ResultadoGenerico) =>{    
        console.log(res);
        if(res.ok){
          if(this.body.fechaDesde> this.body.fechaHasta){
            Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
            this.visibilidadReporte= false;
            return;
          }else if(res.resultado?.length===0){
            Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
            this.visibilidadReporte= false;
          } 
          this.cantidadSociosBaja=res.resultado ? res.resultado[0].cantidadSociosBaja : 0;
        }
        this.getSociosConMasPedidos();
      },
      error :(e) =>{
        Swal.fire({title:'Error!', text:`Error al generar reporte socios: ${e}`, icon: 'error'});
      }
    })
  )
}

private obtenerSociosConMasPuntos(): void {
  this.subscription.add(
    this.servicioSocio.getSociosConMasPuntos(8).subscribe({
      next: (r: ResultadoGenerico) => {
        if(r.ok) {
          if(this.body.fechaDesde> this.body.fechaHasta){
            Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
            this.visibilidadReporte= false;
            return;
          }else if(r.resultado?.length===0){
            Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
            this.visibilidadReporte= false;
          }
          this.sociosConMasPuntos = r.resultado? r.resultado : [];
          this.cargar();
        } else {
          console.error(r.mensaje);
        }
      },
      error: (err) => {
        Swal.fire({title:'Error!', text:`Error al generar reporte socios: ${err}`, icon: 'error'});
        console.error(err);
      }
    })
  )
}


private cargar(): void {
  this.datos = {
    labels: this.encabezado,
    datasets: [
      {
        label : 'Socios nuevos',
        data: [
          this.cantSociosNuevos
        ],
        backgroundColor: 'rgb(31 120 50)'
      },
      {
        label : 'Socios bajas',
        data: [
        this.cantidadSociosBaja 
        ],
        backgroundColor: 'rgba(255, 0, 0, 0.8)'
      },
    ],
  };
}


solicitarReporte(){
  if (this.formulario.valid) {
    this.visibilidadReporte = true;
    this.getCantSociosNuevos();
  } else { 
    Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
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

    // Verifica si la altura de la imagen supera la altura de la página
    if (altura > pageHeight - 20) {
      altura = pageHeight - 20; // Resta el alto de los márgenes superior e inferior
    }

    ArchivoPDF.addImage(urlArchivo, 'PNG', 10, 10, ancho, altura);

    console.log(new Date().toLocaleDateString("es-AR"));
    ArchivoPDF.save(`Reporte Socios (${new Date().toLocaleDateString("es-AR")}).pdf`);
  });
}


descargarTablaPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const elementosTablaCantidad = this.obtenerElementosCantidadTabla();
  const elementosTablaRanking = this.obtenerElementosRankingTabla();

  const cantidadTituloY = 20;
  const rankingTituloY = cantidadTituloY + elementosTablaCantidad.length * 10 + 10;
  
  doc.setFontSize(20);
  doc.text('Reporte de Socios', 10, 10);
  
  doc.setFontSize(14);
  doc.text('Listado de pedidos por socio', 10, cantidadTituloY);
  autoTable(doc, { body: elementosTablaCantidad, startY: cantidadTituloY + 10 });

  doc.text('Ranking de socios con más puntos', 10, rankingTituloY);
  autoTable(doc, { body: elementosTablaRanking, startY: rankingTituloY + 10 });

  console.log(new Date().toLocaleDateString("es-AR"));
  doc.save(`Tablas de Reportes Socios (${new Date().toLocaleDateString("es-AR")}).pdf`);
}



obtenerElementosCantidadTabla(): string[][] {
  const elementos: string[][] = [];
  this.pedidosSocios.forEach((res) => {
    const datosFila: string[] = [res.socio, res.dni.toString(),res.cantPedidos.toString()];
    elementos.push(datosFila);
  });
  return elementos;
}

obtenerElementosRankingTabla(): string[][] {
  const elementos: string[][] = [];
  this.sociosConMasPuntos.forEach((res) => {
    const datosFila: string[] = [res.socio, res.dni.toString(),res.puntos.toString()];
    elementos.push(datosFila);
  });
  return elementos;
}


nextPage(){
  this.page+=8;
}

prevPage(){
  if(this.page>0){
    this.page-=8;
  }
}

onSearchProduct(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
}
}

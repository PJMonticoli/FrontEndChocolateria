import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CobroService } from 'src/app/services/cobro.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData} from 'chart.js';
import { jsPDF } from "jspdf";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
@Component({
  selector: 'app-reporte-cobros',
  templateUrl: './reporte-cobros.component.html',
  styleUrls: ['./reporte-cobros.component.css']
})
export class ReporteCobrosComponent implements OnInit, OnDestroy{
  private subscription : Subscription;
  formulario : FormGroup;
  visibilidadReporte : boolean= false;
  body : any;
  resultadoReporte: any[] = [];
  datos: ChartData<'bar'>;
  cantidadCobros : number = 0;
  totalCobro : number = 0;
  constructor(private servicioCobro : CobroService,
              private formBuilder : FormBuilder){}

  ngOnInit(): void {
    this.formulario= this.formBuilder.group({
      fechaDesde :[,Validators.required],
      fechaHasta :[,Validators.required]
    })
    this.subscription = new Subscription();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  get controlFechaDesde() : FormControl{
    return this.formulario.controls['fechaDesde'] as FormControl;
  }

  get controlFechaHasta() : FormControl{
    return this.formulario.controls['fechaHasta'] as FormControl;
  }

  solicitarReporte(){
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
      return;
    }
    const {fechaDesde, fechaHasta} = this.formulario.value;
    this.body = {
      fechaDesde: new Date(fechaDesde),
      fechaHasta: new Date(fechaHasta)
    }
    this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
    this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
    this.subscription.add(
      this.servicioCobro.reporteCobro(this.body).subscribe({
        next : (res : ResultadoGenerico)=>{
          if(this.body.fechaDesde> this.body.fechaHasta){
            Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
            this.visibilidadReporte= false;
            return;
          }else if(res.resultado?.length===0){
            Swal.fire({title : 'Atención!', text:`No hay resultados para el período de fechas ingresado`, icon: 'warning'});
            this.visibilidadReporte= false;
          }
          this.resultadoReporte = res.resultado ? res.resultado : [];
          this.cantidadCobros=res.resultado ? res.resultado[0].cantidadCobros : 0;
          this.totalCobro=res.resultado ? res.resultado[0].totalCobro : 0;
          this.visibilidadReporte=true;
          this.cargar();
        },
        error :(err)=>{
          console.error(err);
          Swal.fire({title:'Atención!', text:'¡Completar campos de fechas!', icon: 'warning'})
        }
      })
    )
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
      labels: ['Monto total cobrado por cada tipo de pago'],
      datasets: [
      ],
    };
    this.resultadoReporte.forEach((res,index) => {
      this.datos.datasets.push(
        {
          label : res.nombre,
          data: [
            res.totalCobro
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
  
      // Verifica si la altura de la imagen supera la altura de la página
      if (altura > pageHeight - 20) {
        altura = pageHeight - 20; // Resta el alto de los márgenes superior e inferior
      }
  
      ArchivoPDF.addImage(urlArchivo, 'PNG', 10, 10, ancho, altura);
  
      console.log(new Date().toLocaleDateString("es-AR"));
      ArchivoPDF.save(`Reporte Cobros (${new Date().toLocaleDateString("es-AR")}).pdf`);
    });
  }

}

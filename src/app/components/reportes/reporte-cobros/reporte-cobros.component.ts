
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CobroService } from 'src/app/services/cobro.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ChartData } from 'chart.js';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-cobros',
  templateUrl: './reporte-cobros.component.html',
  styleUrls: ['./reporte-cobros.component.css']
})
export class ReporteCobrosComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  formulario: FormGroup;
  visibilidadReporte: boolean = false;
  resultadoReporte: any[] = [];
  datos: ChartData<'bar'>;

  constructor(private servicioCobro: CobroService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      fechaDesde: [, Validators.required],
      fechaHasta: [, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  solicitarReporte(): void {
    if (!this.formulario.valid) {
      Swal.fire({ title: 'Atención!', text: '¡Debes seleccionar una fecha desde y hasta!', icon: 'warning' });
      return;
    }
    const { fechaDesde, fechaHasta } = this.formulario.value;
    const body = { fechaDesde: new Date(fechaDesde), fechaHasta: new Date(fechaHasta) };
    body.fechaHasta.setHours(23, 59);

    this.subscription.add(
      this.servicioCobro.reporteCobro(body).subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            this.resultadoReporte = res.resultado || [];
            this.visibilidadReporte = true;
            this.cargarGrafico();
          } else {
            this.visibilidadReporte = false;
          }
        },
        error: () => {
          Swal.fire({ title: 'Error', text: 'Error al generar reporte', icon: 'error' });
          this.visibilidadReporte = false;
        }
      })
    );
  }

  private cargarGrafico(): void {
    const colores = this.resultadoReporte.map(() => `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`);

    this.datos = {
      labels: ['Monto total cobrado por cada tipo de pago'],
      datasets: this.resultadoReporte.map((res, index) => ({
        label: res.nombre,
        data: [res.totalCobro],
        backgroundColor: colores[index]
      }))
    };
  }

  descargarPDF(): void {
    Swal.fire({
      title: 'Generando PDF',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA, { scale: 2, useCORS: true }).then((canvas) => {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const ancho = 290;
      let altura = (canvas.height * ancho) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (altura > pageHeight - 20) altura = pageHeight - 20;

      pdf.text('Reporte de Cobros', 10, 10);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, ancho, altura);
      pdf.save(`Reporte_Cobros_${new Date().toLocaleDateString('es-AR')}.pdf`);
      Swal.close();
    }).catch(() => {
      Swal.fire({ title: 'Error', text: 'Ocurrió un error al generar el PDF', icon: 'error' });
    });
  }

  get controlFechaDesde(): FormControl {
    return this.formulario.controls['fechaDesde'] as FormControl;
  }

  get controlFechaHasta(): FormControl {
    return this.formulario.controls['fechaHasta'] as FormControl;
  }
}

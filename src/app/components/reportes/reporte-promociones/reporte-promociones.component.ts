import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PromocionService } from 'src/app/services/promocion.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ChartData } from 'chart.js';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-promociones',
  templateUrl: './reporte-promociones.component.html',
  styleUrls: ['./reporte-promociones.component.css']
})
export class ReportePromocionesComponent implements OnInit, OnDestroy {
  visibilidadReporte: boolean = false;
  formulario: FormGroup;
  resultadoReporte: any[] = [];
  body: any;
  search: string = '';
  page: number = 0;
  private subscription = new Subscription();
  datos: ChartData<'bar'>;

  constructor(private servicioPromocion: PromocionService, private formBuilder: FormBuilder) {}

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
      this.servicioPromocion.reportePromociones(body).subscribe({
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
      labels: ['Cantidad de veces que se canjeó cada promoción'],
      datasets: this.resultadoReporte.map((res, index) => ({
        label: res.nombrePromocion,
        data: [res.cantidadCanjeos],
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

      pdf.text('Reporte de Promociones', 10, 10);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, ancho, altura);
      pdf.save(`Reporte_Promociones_${new Date().toLocaleDateString('es-AR')}.pdf`);
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

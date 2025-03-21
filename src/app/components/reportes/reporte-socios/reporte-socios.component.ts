
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
export class ReporteSociosComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  formulario: FormGroup;
  visibilidadReporte: boolean = false;
  pedidosSocios: DtoSocios[] = [];
  sociosConMasPuntos: DtoSocios[] = [];
  datos: ChartData<'bar'>;
  search: string = '';
  page: number = 0;

  constructor(private servicioSocio: SocioService, private formBuilder: FormBuilder) {}

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
    if (this.formulario.valid) {
      this.visibilidadReporte = true;
      this.getSociosConMasPedidos();
    } else {
      Swal.fire({ title: 'Atención!', text: '¡Debes seleccionar una fecha desde y hasta!', icon: 'warning' });
    }
  }

  private getSociosConMasPedidos(): void {
    const { fechaDesde, fechaHasta } = this.formulario.value;
    const body = {
      fechaDesde: new Date(fechaDesde),
      fechaHasta: new Date(fechaHasta)
    };
    body.fechaHasta.setHours(23, 59);

    this.subscription.add(
      this.servicioSocio.sociosConMasPedidos(body).subscribe({
        next: (res) => {
          if (res.ok) {
            this.pedidosSocios = res.resultado || [];
            this.getSociosConMasPuntos();
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

  private getSociosConMasPuntos(): void {
    this.subscription.add(
      this.servicioSocio.getSociosConMasPuntos(8).subscribe({
        next: (res) => {
          if (res.ok) {
            this.sociosConMasPuntos = res.resultado || [];
            this.generarGrafico();
          } else {
            this.visibilidadReporte = false;
          }
        },
        error: () => {
          Swal.fire({ title: 'Error', text: 'Error al generar ranking', icon: 'error' });
          this.visibilidadReporte = false;
        }
      })
    );
  }

  private generarGrafico(): void {
    this.datos = {
      labels: ['Socios Nuevos vs. Dados de Baja'],
      datasets: [
        { label: 'Nuevos', data: [10], backgroundColor: 'rgb(31 120 50)' },
        { label: 'Bajas', data: [5], backgroundColor: 'rgba(255, 0, 0, 0.8)' }
      ]
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

      pdf.text('Reporte de Socios', 10, 10);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, ancho, altura);
      pdf.save(`Reporte_Socios_${new Date().toLocaleDateString('es-AR')}.pdf`);
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

  nextPage(): void {
    this.page += 8;
  }

  prevPage(): void {
    if (this.page > 0) this.page -= 8;
  }

  onSearchProduct(buscar: string): void {
    this.page = 0;
    this.search = buscar.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
}

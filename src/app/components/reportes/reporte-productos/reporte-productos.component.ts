
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { DtoReporte } from 'src/app/models/dto-reporte';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.css']
})
export class ReporteProductosComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  formulario: FormGroup;
  visibilidadReporte: boolean = false;
  resultadoCantidad: DtoReporte[] = [];
  resultadoPromedio: DtoReporte[] = [];
  search: string = '';
  page: number = 0;
  pageProm: number = 0;

  constructor(private servicioProducto: ProductoService, private formBuilder: FormBuilder) {}

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
      this.getCantidad();
      this.getPromedio();
    } else {
      Swal.fire({ title: 'Atención!', text: '¡Debes seleccionar una fecha desde y hasta!', icon: 'warning' });
    }
  }

  private getCantidad(): void {
    const { fechaDesde, fechaHasta } = this.formulario.value;
    const body = { fechaDesde: new Date(fechaDesde), fechaHasta: new Date(fechaHasta) };
    body.fechaHasta.setHours(23, 59);

    this.subscription.add(
      this.servicioProducto.reporteCantidad(body).subscribe({
        next: (res) => {
          if (res.ok) {
            this.resultadoCantidad = res.resultado || [];
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

  private getPromedio(): void {
    const { fechaDesde, fechaHasta } = this.formulario.value;
    const body = { fechaDesde: new Date(fechaDesde), fechaHasta: new Date(fechaHasta) };
    body.fechaHasta.setHours(23, 59);

    this.subscription.add(
      this.servicioProducto.reportePromedio(body).subscribe({ 
        next: (res) => {
          if (res.ok) {
            this.resultadoPromedio = res.resultado || [];
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

      pdf.text('Reporte de Productos', 10, 10);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, ancho, altura);
      pdf.save(`Reporte_Productos_${new Date().toLocaleDateString('es-AR')}.pdf`);
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

  nextPageProm(): void {
    this.pageProm += 8;
  }

  prevPageProm(): void {
    if (this.pageProm > 0) this.pageProm -= 8;
  }

  onSearchProduct(buscar: string): void {
    this.page = 0;
    this.search = buscar.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
}

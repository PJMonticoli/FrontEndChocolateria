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
    const chocolateColors = [
      'rgb(120, 63, 4)',    
      'rgb(165, 113, 67)',  
      'rgb(195, 144, 77)',  
      'rgb(210, 180, 140)', 
      'rgb(139, 69, 19)',   
      'rgb(160, 82, 45)',   
      'rgb(101, 67, 33)',   
      'rgb(205, 133, 63)'   
    ];
  
    this.datosCantidad = {
      labels: ['Cantidad vendida por cada producto'],
      datasets: [],
    };
  
    this.datosPromedio = {
      labels: ['Promedio de venta por cada producto'],
      datasets: [],
    };
    if (!this.resultadoCantidad.length || !this.resultadoPromedio.length) {
      return;
    }
  
    const productosSet = new Set<string>();
    this.resultadoCantidad.forEach(item => productosSet.add(item.nombre));
    this.resultadoPromedio.forEach(item => productosSet.add(item.nombre));
    const productos = Array.from(productosSet);
  
    const coloresProductos: { [key: string]: string } = {};
    productos.forEach((producto, index) => {
      coloresProductos[producto] = chocolateColors[index % chocolateColors.length];
    });
  
    const cantidadLimit = Math.min(8, this.resultadoCantidad.length);
    for (let i = 0; i < cantidadLimit; i++) {
      const cantidadFila = this.resultadoCantidad[i];
      if (cantidadFila) {
        const nombreProducto = cantidadFila.nombre;
        const cantidad = cantidadFila.cantidad;
        
        this.datosCantidad.datasets.push({
          label: nombreProducto,
          data: [cantidad],
          backgroundColor: coloresProductos[nombreProducto],
        });
      }
    }
  
    const promedioLimit = Math.min(8, this.resultadoPromedio.length);
    for (let i = 0; i < promedioLimit; i++) {
      const promedioFila = this.resultadoPromedio[i];
      if (promedioFila) {
        const nombreProducto = promedioFila.nombre;
        const promedio = promedioFila.promedio;
        
        this.datosPromedio.datasets.push({
          label: nombreProducto,
          data: [promedio],
          backgroundColor: coloresProductos[nombreProducto],
        });
      }
    }
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
    html2canvas(DATA, {
      scale: 2, 
      useCORS: true,
      logging: false, 
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      let ancho = 290;
      let altura = (canvas.height * ancho) / canvas.width;
      const urlArchivo = canvas.toDataURL('image/png');
      let ArchivoPDF = new jsPDF('l', 'mm', 'a4');
      let pageHeight = ArchivoPDF.internal.pageSize.getHeight();
    
      if (altura > pageHeight - 20) {
        altura = pageHeight - 20; 
      }
  
      ArchivoPDF.setFontSize(16);
      ArchivoPDF.setTextColor(90, 57, 33); 
      ArchivoPDF.text('Reporte de Chocolatería', 10, 10);
      
      ArchivoPDF.setFontSize(10);
      const { fechaDesde, fechaHasta } = this.formulario.value;
      const fechaDesdeStr = new Date(fechaDesde).toLocaleDateString('es-AR');
      const fechaHastaStr = new Date(fechaHasta).toLocaleDateString('es-AR');
      ArchivoPDF.text(`Período: ${fechaDesdeStr} al ${fechaHastaStr}`, 10, 18);
    
      ArchivoPDF.addImage(urlArchivo, 'PNG', 10, 22, ancho, altura);
    

      ArchivoPDF.setFontSize(8);
      ArchivoPDF.setTextColor(100, 100, 100);
      ArchivoPDF.text(`Generado el ${new Date().toLocaleDateString("es-AR")} a las ${new Date().toLocaleTimeString("es-AR")}`, 10, pageHeight - 10);
      
      ArchivoPDF.save(`Reporte_Ranking_Productos_${fechaDesdeStr}_${fechaHastaStr}.pdf`);
      
      Swal.close();
    }).catch(error => {
      console.error('Error al generar PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al generar el PDF',
        icon: 'error'
      });
    });
  }
  
  
  private getCantidadPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);

      this.servicioProducto.rankingCantidad(8, this.body).subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            this.cantidadProd = res.resultado ? res.resultado[0]?.cantidadProd || 0 : 0;
            this.resultadoCantidad = res.resultado || [];
            this.cargar();
            resolve();
          } else {
            reject(res.mensaje);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  private getPromedioPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);

      this.servicioProducto.rankingPromedio(8, this.body).subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.ok) {
            if (res.resultado?.length === 0) {
              this.visibilidadReporte = false;
              reject('No hay resultados para el período de fechas ingresado');
              return;
            }
            this.promedioProd = res.resultado ? res.resultado[0]?.promedioProd || 0 : 0;
            this.resultadoPromedio = res.resultado || [];
            this.cargar();
            resolve();
          } else {
            reject(res.mensaje);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
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



import { Pipe, PipeTransform } from '@angular/core';
import { DtoPromociones } from '../models/dto-promociones';
import { DtoReportePromociones } from '../models/dto-reporte-promociones';

@Pipe({
  name: 'filtroReportePromocion'
})
export class FiltroReportePromocionPipe implements PipeTransform {

  transform(promocion: DtoReportePromociones[], page: number=0, search : string): DtoReportePromociones[] {
    if(search.length === 0){
      return promocion.slice(page, page+8);
    }
    const promocionesFiltradas = promocion.filter(soc=>  soc.nombrePromocion.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search));
    return promocionesFiltradas.slice(page, page+8);
  }

}

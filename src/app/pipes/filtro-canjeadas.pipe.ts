import { Pipe, PipeTransform } from '@angular/core';
import { DtoPromociones } from '../models/dto-promociones';

@Pipe({
  name: 'filtroCanjeadas'
})
export class FiltroCanjeadasPipe implements PipeTransform {
  transform(promocion: DtoPromociones[], page: number=0, search : string): DtoPromociones[] {
    if(search.length === 0){
      return promocion.slice(page, page+8);
    }
    const promocionsFiltradas = promocion.filter(promo=>  promo.nombreSocio.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search) 
    || promo.nombrePromocion.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search));
    return promocionsFiltradas.slice(page, page+8);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DtoSocios } from '../models/dto-socios';

@Pipe({
  name: 'filtroReporteSocio'
})
export class FiltroReporteSocioPipe implements PipeTransform {

  transform(socios: DtoSocios[], page: number=0, search : string): DtoSocios[] {
    if(search.length === 0){
      return socios.slice(page, page+8);
    }
    const sociosFiltrados = socios.filter(soc=>  soc.socio.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search) 
    || soc.dni.toString().includes(search));
    return sociosFiltrados.slice(page, page+8);
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Socio } from '../models/socio';

@Pipe({
  name: 'filtroSocio'
})
export class FiltroSocioPipe implements PipeTransform {

  transform(socios: Socio[], page : number=0, search : string): Socio[] {
    if(search.length=== 0){
      return socios.slice(page, page+6);
    }
    const sociosFiltrados = socios.filter(soc=> soc.dni.toString().includes(search) || 
    soc.apellido.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search)
    || soc.nombre.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search));
    return sociosFiltrados.slice(page, page+6);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../models/producto';

@Pipe({
  name: 'filtroAltaPedido'
})
export class FiltroAltaPedidoPipe implements PipeTransform {

  transform(productos: Producto[], search: string, precioMin: number, precioMax: number): Producto[] {
    if (!search && precioMin === undefined && precioMax === undefined) {
      return productos;
    }
  
    const searchRegex = new RegExp(search, 'i'); // Create a case-insensitive regular expression for the search term
  
    return productos.filter(prod => {
      const cumpleFiltroNombre = search ? searchRegex.test(prod.nombre) : true;
      const cumpleFiltroPrecio = (precioMin === undefined || prod.precio >= precioMin) &&
        (precioMax === undefined || prod.precio <= precioMax);
  
      return cumpleFiltroNombre && cumpleFiltroPrecio;
    });
  }
  
}

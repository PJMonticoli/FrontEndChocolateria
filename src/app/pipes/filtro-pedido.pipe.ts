import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPedido'
})
export class FiltroPedidoPipe implements PipeTransform {

  transform(pedido: any[], page : number=0, search : string): any[] {
    if(search.length=== 0){
      return pedido.slice(page, page+8);
    }
    const pedidosFiltrados = pedido.filter(ped =>ped.fechaPedido?.toString().includes(search) ||
    ped.estado?.toLowerCase().includes(search) || ped.puntoVenta?.toLowerCase().includes(search) ||
    ped.socio?.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search)
    );
    return pedidosFiltrados.slice(page, page+8);


  }
}

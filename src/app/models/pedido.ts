import { DetallePedido } from "./detalle-pedido";

export class Pedido {
    id?: number;
    idPuntoVenta?: number;
    idSocio?: number;
    idEmpleado?: number;
    idEstado?: number;
    observaciones: string;
    fechaPedido?: Date;
    detalles: DetallePedido[];
}

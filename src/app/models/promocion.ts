import { DetallePromocion } from "./detalle-promocion";

export class Promocion {
    id : number;
    nombre : string;
    descripcion : string;
    precioPuntos : number;
    detalles: DetallePromocion[];
    fechaDesde : Date;
    fechaHasta : Date;
}
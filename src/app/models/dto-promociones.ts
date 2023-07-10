import { DetallePromocion } from "./detalle-promocion";
import { MovimientosPuntos } from "./movimientos-puntos";
import { Producto } from "./producto";
import { Promocion } from "./promocion";
import { Socio } from "./socio";
export class DtoPromociones {
    id : number;
    socio : Socio;
    promocion : Promocion;
    nombreSocio : string;
    nombrePromocion : string;
    producto : Producto;
    cantidad : DetallePromocion;
    puntos : MovimientosPuntos;
    fechaCanjeada : Date;
}

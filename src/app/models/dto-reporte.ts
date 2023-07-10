import { Producto } from "./producto";

export class DtoReporte {
    id : number;
    producto : Producto;
    nombre : string;
    cantidad : number;
    promedio : number;
}

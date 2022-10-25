import { Producto } from "./producto";

export class OrdenProducto {
    id_op?: number;

    cantidad_op: number;

    precioUni_op?: number;

    descProducto_op?: number;

    producto?: Producto;

    constructor() {
        this.cantidad_op = 0;//revisara
    }
}

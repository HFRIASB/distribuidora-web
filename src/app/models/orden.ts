import { Direccion } from "./direccion";
import { OrdenProducto } from "./orden-producto";
import { Usuario } from "./usuario";

export class Orden {
    id_ord?: number;

    fVenta_ord: Date;

    fEntrega_ord: Date;

    estado_ord?: string;

    numNota_ord?: string;

    url_ord?: string;

    descGeneral_ord?: number;

    total_ord?: number;

    usuario?: Usuario;

    direccion: Direccion;

    ordenProducto: OrdenProducto[];

    constructor() {
        this.fVenta_ord = new Date();
        this.fEntrega_ord = new Date();
        this.ordenProducto = [];
        this.direccion = new Direccion();
    }
}

import { Direccion } from "./direccion";
import { Usuario } from "./usuario";

export class Orden {
    id_ord?: number;

    fVenta_ord?: Date;

    fEntrega_ord?: Date;

    estado_ord?: string;

    numNota_ord?: string;

    url_ord?: string;

    descGeneral_ord?: number;

    total_ord?: number;

    usuario?: Usuario;

    direccion?: Direccion;

    // ordenProducto?: OrdenProducto[];
}

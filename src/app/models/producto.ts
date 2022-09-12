export class Producto {
    id_prod?: number;

    nombre_prod: string;

    foto_prod?: string;

    stock_prod?: number;

    precioCompra_prod?: number;

    estado_prod?: string;

    uniMedida_prod?: string;

    constructor(){
        this.nombre_prod = '';
    }
}

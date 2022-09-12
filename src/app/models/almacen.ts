export class Almacen {
	id_almacen: number;

    chofer_almacen: string;

    fecha_almacen: Date;

    tipo_almacen: string;//Producto o envase

    cantidad_almacen: number;

    item_almacen: string;

    estado_almacen: string;//Ingreso o despacho

	constructor() {
		this.id_almacen = -1;
		this.chofer_almacen = '';
		this.fecha_almacen = new Date();
		this.tipo_almacen = '';
		this.cantidad_almacen = 0;
		this.item_almacen = '';
		this.estado_almacen = '';
	}
}

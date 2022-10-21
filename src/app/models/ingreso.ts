import { Producto } from "./producto";

export class IngresoProducto {
	id_ingreso_producto: number;
	chofer_ingreso_producto: string;

	fecha_ingreso_producto: Date;

	cantidad_ingreso_producto: number;

	producto: Producto;


	constructor() {
		this.id_ingreso_producto = -1;
		this.chofer_ingreso_producto = '';
		this.fecha_ingreso_producto = new Date();
		this.cantidad_ingreso_producto = 0;
		this.producto = new Producto();
	}
}
